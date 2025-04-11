"use client"
import React, { useEffect, useRef, useState } from 'react';
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
import { sendGAEvent } from '@next/third-parties/google'
import { IOryRegistrationFlow } from '@/app/_lib/auth/ory/flows.interface';
import StepperProgress from '../components/base/stepperProgress';


function generateEligibilitySchema(protocol: EnrolmentProtocol): Yup.Schema {
  const schema: {[key: string]: Yup.Schema} = {};
  protocol.eligibility?.items.forEach(
    (item) => schema[item.id] = Yup.boolean().required().isTrue(item.errorText ?? "This must be true to take part in the study")
  )
  return Yup.object(schema)
}

function generateConsentSchema(protocol: EnrolmentProtocol): Yup.Schema {
  const schema: {[key: string]: Yup.Schema} = {};
  if (protocol.consent) {
    protocol.consent?.requiredItems.forEach(
      (item) => schema[item.id] = Yup.boolean().required().isTrue(item.errorText ?? "You must agree to this item to take part in the study")
    )
    schema['signature'] = Yup.string().required()
    schema['first_name'] = Yup.string().required()
    schema['last_name'] = Yup.string().required()
    schema['date'] = Yup.string().required()
  }

  return Yup.object(schema)
}

function generateEligibilityInitialValues(protocol: EnrolmentProtocol): {[key: string]: boolean | undefined} {
  const values: {[key: string]: boolean | undefined} = {}
  protocol.eligibility?.items.forEach(
    (item) => values[item.id] = undefined
  )
  return values
}

function generateConsentInitialValues(protocol: EnrolmentProtocol): {[key: string]: any} {
  const values: {[key: string]: any} = {}
  protocol.consent?.requiredItems.forEach(
    (item) => values[item.id] = undefined
  )
  protocol.consent?.optionalItems?.forEach(
    (item) => values[item.id] = undefined
  )
  values['signature'] = undefined
  values['first_name'] = undefined
  values['last_name'] = undefined
  values['date'] = (new Date()).toLocaleDateString('en-GB', {day:'numeric', month: 'short', year: 'numeric'})

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

function generateSteps(protocol: EnrolmentProtocol, stepContent: {[key: string]: React.ReactNode}) {
  const steps: string[] = [];
  if (stepContent["eligibility"]) {
    steps.push("eligibility")
  }
  if (protocol.studyInformation && stepContent["studyInformation"]) {
    steps.push("studyInformation")
  }
  if (stepContent["consent"]) {
    steps.push("consent")
  }
  if (protocol.additional && stepContent["additional"]) {
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
  const contentRef = useRef<HTMLElement>()

  
  const getFlow = async (setFlow: (v: any) => void) => {
    const response = await fetch(withBasePath('/api/ory/registration/browser'))
    if (response.ok) {
      const data = await response.json()
      setFlow(data)
    }
  }

  let additionalDefinition: ArmtDefinition | undefined;
  if (protocol.additional) {
    additionalDefinition = fromRedcapDefinition(protocol.additional?.items)
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
  
  const displayErrors = (flow: IOryRegistrationFlow) => {
    if (flow) {
      if ((flow.ui.messages) && (flow.ui.messages.length > 0)) {
        setErrorText(flow.ui.messages[0].text)
      }
      flow.ui.nodes.filter(node => node.messages.length > 0).forEach(
        (node) => {
          if ((node.attributes.name) == 'traits.email') {
            formik.setErrors({register: {email: node.messages[0].text}})
          } else if ((node.attributes.name) == 'password') {
            formik.setErrors({register: {password: node.messages[0].text}})
          }
        }
      )
    }
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
              ...traits,
              version: protocol.version
            }
          ]
        }
      }
      sendGAEvent('event', 'study_enrolment', {status: 'submitting'})
      fetch(withBasePath('/api/ory/registration?' + new URLSearchParams({
        flow: flow.id
      })), {
        method: 'POST',
        body: JSON.stringify(body)
      }).then(
        (res) => {
          if (res.ok) {
            sendGAEvent('event', 'study_enrolment', {status: 'joined'})
            res.json().then(
              (data) => {
                const verificationFlow = data.continue_with[0].flow.id
                if (verificationFlow) {
                  router.push(`/${studyProtocol.studyId}/verification?flow=${verificationFlow}`)
                  router.refresh()
                } else {
                  router.push(`/${studyProtocol.studyId}/portal`)
                  router.refresh()
                }
              }
            )
            return
          }
          if (res.status == 400) {
            sendGAEvent('event', 'study_enrolment', {status: 'submission_error'})
            res.json().then(
              (data) => {
                if (data?.ui?.messages !== undefined) {
                  setErrorText(data.ui.messages[0]['text'])
                  scrollToTop()
                } 
                displayErrors(data)   
                setFlow(data)
              }
            )
          }
        }
      ).finally(
        () => formik.setSubmitting(false)
      )
    },
  })

  const stepContent: { [key: string]: React.ReactNode } = {
    ...(protocol.studyInformation && protocol.studyInformation.content
      ? {
          studyInformation: (
            <EnrolmentStudyInformation
              title={protocol.studyInformation.title}
              content={protocol.studyInformation.content}
            />
          ),
        }
      : {}),
  
    ...(protocol.eligibility && protocol.eligibility?.items
      ? {
          eligibility: (
            <EnrolmentEligibility
              setFieldValue={formik.setFieldValue}
              errors={(formik.errors['eligibility']) ? formik.errors['eligibility'] : {}}
              values={formik.values["eligibility"]}
              title={protocol.eligibility.title}
              description={protocol.eligibility.description}
              items={protocol.eligibility.items}
            />
          ),
        }
      : {}),
  
    ...(protocol.consent && (protocol.consent?.requiredItems || protocol.consent?.optionalItems)
      ? {
          consent: (
            <EnrolmentConsent
              setFieldValue={formik.setFieldValue}
              errors={(formik.errors['consent']) ? formik.errors['consent'] : {}}
              values={formik.values["consent"]}
              title={protocol.consent.title}
              description={protocol.consent.description}
              requiredItems={protocol.consent.requiredItems}
              optionalItems={protocol.consent.optionalItems}
              signatureDescription={protocol.consent.signatureDescription}
            />
          ),
        }
      : {}),
  
    ...(protocol.additional && protocol.additional?.items 
      ? {
          additional: (
            <ArmtForm
              title={protocol.additional.title}
              definition={fromRedcapDefinition(protocol.additional.items)}
              values={formik.values.additional}
              errors={formik.errors['additional']}
              setFieldValue={(id, value) => formik.setFieldValue("additional." + id, value)}
            />
          ),
        }
      : {}),
  
    register: (
      <EnrolmentRegister
        setFieldValue={formik.setFieldValue}
        title={protocol.account?.title}
        description={protocol.account?.description}
        errors={(formik.errors['register']) ? formik.errors['register'] : {}}
        values={formik.values["register"]}
      />
    ), 
  }

  const steps = generateSteps(protocol, stepContent)

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
      sendGAEvent('event', 'study_enrolment', {'step': steps[stepIdx + 1], status: 'ongoing'})
      setStep(stepIdx + 1)
      contentRef.current?.focus()
    }
  }
  
  function previousStep() {
    if (stepIdx > 0) {
      sendGAEvent('event', 'study_enrolment', {'step': steps[stepIdx - 1], status: 'ongoing'})
      setStep(stepIdx - 1)
      scrollToTop()
    } else {
      router.back()
    }
  }

  useEffect(() => {
    if (flow === undefined) {
      sendGAEvent('event', 'study_enrolment', {'step': steps[stepIdx], status: 'start'})
      getFlow(setFlow)
    } else {
      validateStep()
    }
  }, [formik.values, stepIdx, flow])


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
        <StepperProgress numSteps={steps.length} currentStep={stepIdx} />
        {((stepIdx+1) == steps.length) ? 
          <SubmitButton disabled={disabled || formik.isSubmitting} onClick={formik.submitForm} /> : 
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
        <Box display={'inline'} gap={2} margin={"auto"} aria-live="polite">
          {errorText && <Typography variant='overline' color='error'>{errorText}</Typography>}
          <Box  ref={contentRef}> 
           {stepContent[steps[stepIdx]]}
          </Box>
          <br />
          {ControlButtons}
        </Box>  
      </form>
    </Container>
  )
}