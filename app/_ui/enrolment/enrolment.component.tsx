"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import Yup from '@/app/_lib/armt/validation/yup'
import { useFormik } from 'formik';
import { Box, Button, Container, Divider, Stack, Typography } from '@mui/material';

import { EnrolmentStudyInformation } from './information.component';
import { EnrolmentEligibility } from './eligibility.component';
import { EnrolmentConsent } from './consent.component';
import { EnrolmentProtocol, StudyProtocol } from '@/app/_lib/study/protocol';
import fromRedcapDefinition from '@/app/_lib/armt/definition/fromRedcapDefinition';
import { ArmtForm } from '../components/form/form';
import { ArmtDefinition } from '@/app/_lib/armt/definition/definition.types';
import { schemaFromDefinition } from '@/app/_lib/armt/validation/parser';
import { EnrolmentRegister } from './register.component';
import { withBasePath } from '@/app/_lib/util/links';
import { getCsrfToken } from '@/app/_lib/auth/ory/util';


function generateEligibilitySchema(protocol: EnrolmentProtocol): Yup.Schema {
  const schema: {[key: string]: Yup.Schema} = {};
  protocol.eligibility.items.forEach(
    (item) => schema[item.id] = Yup.boolean().required().isTrue(item.errorText ?? "This must be true to take part in the study")
  )
  return Yup.object(schema)
}

function generateConsentSchema(protocol: EnrolmentProtocol): Yup.Schema {
  const schema: {[key: string]: Yup.Schema} = {};
  protocol.consent.requiredItems.forEach(
    (item) => schema[item.id] = Yup.boolean().required().isTrue(item.errorText ?? "You must agree to this item to take part in the study")
  )
  schema['signature'] = Yup.string().required()
  return Yup.object(schema)
}

function generateEligibilityInitialValues(protocol: EnrolmentProtocol): {[key: string]: boolean | undefined} {
  const values: {[key: string]: boolean | undefined} = {}
  protocol.eligibility.items.forEach(
    (item) => values[item.id] = undefined
  )
  return values
}

function generateConsentInitialValues(protocol: EnrolmentProtocol): {[key: string]: any} {
  const values: {[key: string]: any} = {}
  protocol.consent.requiredItems.forEach(
    (item) => values[item.id] = undefined
  )
  protocol.consent.optionalItems?.forEach(
    (item) => values[item.id] = undefined
  )
  values['consent_signature'] = undefined
  return values
}

const registerSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required(""),
  password: Yup.string().min(12, "Password must be at least 12 characters").required("")
})


interface NextButtonProps {
  disabled: boolean,
  onClick: () => void
}

function NextButton(props: NextButtonProps) {
  let text = "Next"
  return  <Button color="primary" variant="contained" disabled={props.disabled} onClick={props.onClick}>
            {text}
          </Button>
}

interface BackButtonProps {
  exit?: boolean,
  onClick: () => void
}

function BackButton(props: BackButtonProps) {
  let text = props.exit ? "Exit" : "Back"
  return  <Button color="primary" variant="contained" onClick={props.onClick}>
            {text}
          </Button>
}

interface SubmitButtonProps {
  disabled?: boolean
  onClick: () => void
}

function SubmitButton(props: SubmitButtonProps) {
  return  <Button color="primary" variant="contained" disabled={props.disabled} onClick={props.onClick} type={'submit'}>
            Join
          </Button>
}

function generateSteps(protocol: EnrolmentProtocol) {
  const steps: string[] = []
  if (protocol.studyInformation) {
    steps.push("studyInformation")
  }
  steps.push("eligibility")
  steps.push("consent")
  if (protocol.additional) {
    steps.push("additional")
  }
  steps.push("register")
  return steps
}

interface EnrolmentContentProps {
  studyProtocol: StudyProtocol
}
const isBrowser = () => typeof window !== 'undefined';

function scrollToTop() {
    if (!isBrowser()) return;
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },2);
}

export function EnrolmentContent({studyProtocol}: EnrolmentContentProps) {
  const protocol = studyProtocol.enrolment
  const router = useRouter();
  const [disabled, setDisabled] = React.useState(true)
  const [stepIdx, setStep] = React.useState(0)
  let [flow, setFlow] = useState<any>();
  let [errorText, setErrorText] = useState<string>('');
  
  const getFlow = async (setFlow: (v: any) => void) => {
    const response = await fetch(withBasePath('/api/ory/registration/browser'))
    if (response.ok) {
      const data = await response.json()
      setFlow(data)
    }
  }

  const steps = generateSteps(protocol)
  let additionalDefinition: ArmtDefinition | undefined;
  if (protocol.additional) {
    additionalDefinition = fromRedcapDefinition(protocol.additional.items)
  }

  const eligibilitySchema = generateEligibilitySchema(protocol)
  const consentSchema = generateConsentSchema(protocol)
  let schemas: {[key: string]: Yup.Schema} = {
    eligibility: eligibilitySchema,
    consent: consentSchema,
    register: registerSchema
  }
  if (additionalDefinition) {
    schemas['additional'] = schemaFromDefinition(additionalDefinition)
  }

  const formik = useFormik({
    validateOnChange: true,
    validateOnMount: false,
    validateOnBlur: false,
    initialValues: {
      'eligibility': generateEligibilityInitialValues(protocol),
      'consent': generateConsentInitialValues(protocol),
      'additional': {},
      'register': {'email': undefined, 'password': undefined}
    },
    validationSchema: Yup.object(schemas),
    onSubmit: (values) => {
      const {register, ...traits} = values
      const body = {
        email: register.email,
        password: register.password,
        csrf_token: getCsrfToken(flow),
        traits: {
          projects: [
            {
              id: studyProtocol.studyId,
              name: studyProtocol.name,
              userId: crypto.randomUUID(),
              ...traits
            }
          ]
        }
      }
      fetch(withBasePath('/api/ory/registration?' + new URLSearchParams({
        flow: flow.id
      })), {
        method: 'POST',
        body: JSON.stringify(body)
      }).then(
        (res) => {
          if (res.ok) {
            router.push("portal")
            window.location.reload()
            return
          }
          if (res.status == 400) {
            res.json().then(
              (data) => {
                if (data?.ui?.messages !== undefined) {
                  setErrorText(data.ui.messages[0]['text'])
                  scrollToTop()
                }              
              }
            )
          }
        }
      ).finally(
        () => formik.setSubmitting(false)
      )
    },
  })

  const stepContent: {[key: string]: React.ReactNode} = {
    studyInformation: <EnrolmentStudyInformation 
        title={protocol.studyInformation?.title}
        content={protocol.studyInformation?.content}
      />,
    eligibility: <EnrolmentEligibility 
        setFieldValue={formik.setFieldValue}
        errors={(formik.errors['eligibility']) ? formik.errors['eligibility'] : {}}
        values={formik.values['eligibility']}
        title={protocol.eligibility.title}
        description={protocol.eligibility.description}
        items={protocol.eligibility.items}
      />,
    consent: <EnrolmentConsent 
      setFieldValue={formik.setFieldValue}
      errors={(formik.errors['consent']) ? formik.errors['consent'] : {}}
      values={formik.values['consent']}
      title={protocol.consent.title}
      description={protocol.consent.description}
      requiredItems={protocol.consent.requiredItems}
      optionalItems={protocol.consent.optionalItems}
    />,
    additional: (protocol.additional == undefined) ? undefined : 
        <ArmtForm 
            title={protocol.additional.title}
            definition={fromRedcapDefinition(protocol.additional.items)}
            values={formik.values.additional}
            errors={formik.errors['additional']}
            setFieldValue={(id, value) => formik.setFieldValue('additional.' + id, value)} />,
    register: <EnrolmentRegister
      setFieldValue={formik.setFieldValue}
      title={protocol.account?.title}
      description={protocol.account?.description}
      errors={(formik.errors['register']) ? formik.errors['register'] : {}}
      values={formik.values['register']}
    />,
  }

  const _getKeyValue_ = (key: string) => (obj: Record<string, any>) => obj[key];
  function validateStep() {
    if (schemas[steps[stepIdx]]) {
      let vals = _getKeyValue_(steps[stepIdx])(formik.values)
      schemas[steps[stepIdx]].validate(vals, {abortEarly: false})
        .then(() => setDisabled(false))
        .catch(() =>setDisabled(true))
    } else {
      setDisabled(false)
    }}

  function nextStep() {
    if ((stepIdx + 1) < steps.length) {
      scrollToTop()
      setStep(stepIdx + 1)
    }
  }
  
  function previousStep() {
    if (stepIdx > 0) {
      setStep(stepIdx - 1)
      scrollToTop()
    } else {
      router.back()
    }
  }

  useEffect(() => {
    if (flow === undefined) {
      getFlow(setFlow)
    } else {
      validateStep()
    }
  }, [formik.values, stepIdx, flow])


  const shapeStyles = { width: '0.5rem', height: '0.5rem' };
  const shapeCircleStyles = { borderRadius: '50%' };
  const rectangle = <Box component="span" sx={shapeStyles} />;
  const circle = (active: boolean, key?: string) => {
    return <Box component="span"
                key={key}
                sx={{ 
                  bgcolor: (active) ? 'primary.main' : 'lightgray',
                  ...shapeStyles, 
                  ...shapeCircleStyles,}} />
  }
  let stepperDots: JSX.Element[] = [];
  for (let i=0; i < steps.length; i++) {
    stepperDots.push(
      circle(i <= stepIdx, 'stepdot' + i)
    )
  }
  const ControlButtons = (
    <Box 
      width={"100%"}
      position={'sticky'}
      bottom={0}
      zIndex={1000}>
      <Divider />
      <Box
        paddingTop={4}
        paddingBottom={4}
        display={"flex"}
        alignItems={'center'}
        sx={{ 
          justifyContent: 'space-between', 
          background: 'white'
        }}
        >
        <BackButton exit={stepIdx == 0} onClick={previousStep}/>
        <Box display={'flex'} flexDirection={'row'} gap={0.5}>
          {stepperDots}
        </Box>
        {((stepIdx+1) == steps.length) ? 
          <SubmitButton disabled={disabled || formik.isSubmitting} onClick={formik.submitForm}/> : 
          <NextButton disabled={disabled} onClick={nextStep} />
        }
      </Box>
    </Box>
  )

  return (
    <Container 
      sx={{
        paddingRight: 4,
        paddingLeft: 4,
        paddingTop: 4
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack gap={4} margin={"auto"}>
          {errorText && <Typography variant='overline' color='error'>{errorText}</Typography>}
          {stepContent[steps[stepIdx]]}
          {ControlButtons}
        </Stack>  
      </form>
    </Container>
  )
}