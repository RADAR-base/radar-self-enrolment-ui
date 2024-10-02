"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Yup from '@/app/_lib/armt/validation/yup'
import { useFormik } from 'formik';
import { Box, Button, Container, Stack, Typography } from '@mui/material';

import { EnrolmentStudyInformation } from './information.component';
import { EnrolmentEligability } from './eligability.component';
import { EnrolmentConsent } from './consent.component';
import { EnrolmentProtocol } from '@/app/_lib/study/protocol';
import { ArmtRadioField } from '../components/fields/radio';
import fromRedcapDefinition from '@/app/_lib/armt/definition/fromRedcapDefinition';
import { ArmtForm } from '../components/form/form';
import { ArmtDefinition } from '@/app/_lib/armt/definition/definition.types';
import LoginComponent from '../auth/login';
import Register from '../auth/register';

function generateEligabilitySchema(protocol: EnrolmentProtocol): Yup.Schema {
  const schema: {[key: string]: Yup.Schema} = {};
  protocol.eligability.items.forEach(
    (item) => schema[item.id] = Yup.boolean().required().isTrue(item.errorText)
  )
  return Yup.object(schema)
}

function generateFormInitialValues(definition: ArmtDefinition): {[key: string]: any} {
  return {}
}

function generateConsentSchema(protocol: EnrolmentProtocol): Yup.Schema {
  const schema: {[key: string]: Yup.Schema} = {};
  protocol.consent.requiredItems.forEach(
    (item) => schema[item.id] = Yup.boolean().required().isTrue(item.errorText)
  )
  return Yup.object(schema)
}

function generateEligabilityInitialValues(protocol: EnrolmentProtocol): {[key: string]: boolean | undefined} {
  const values: {[key: string]: boolean | undefined} = {}
  protocol.eligability.items.forEach(
    (item) => values[item.id] = undefined
  )
  return values
}

function generateConsentInitialValues(protocol: EnrolmentProtocol): {[key: string]: boolean | undefined} {
  const values: {[key: string]: boolean | undefined} = {}
  protocol.consent.requiredItems.forEach(
    (item) => values[item.id] = undefined
  )
  protocol.consent.optionalItems?.forEach(
    (item) => values[item.id] = undefined
  )
  return values
}


interface NextButtonProps {
  disabled: boolean,
  onClick: () => void
}

function NextButton(props: NextButtonProps) {
  let text = "Continue"
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
            Join Study
          </Button>
}

function generateSteps(protocol: EnrolmentProtocol) {
  const steps: string[] = []
  if (protocol.studyInformation) {
    steps.push("studyInformation")
  }
  steps.push("eligability")
  steps.push("consent")
  if (protocol.additional) {
    steps.push("additional")
  }
  steps.push("account")
  return steps
}

interface EnrolmentContentProps {
  protocol: EnrolmentProtocol
}

export function EnrolmentContent({protocol}: EnrolmentContentProps) {
  const router = useRouter();
  const [disabled, setDisabled] = React.useState(true)
  const [stepIdx, setStep] = React.useState(0)

  const steps = generateSteps(protocol)

  const eligabilitySchema = generateEligabilitySchema(protocol)
  const consentSchema = generateConsentSchema(protocol)
  const schemas: {[key: string]: Yup.Schema} = {
    eligability: eligabilitySchema,
    consent: consentSchema
  }

  const formik = useFormik({
    validateOnChange: true,
    validateOnMount: false,
    validateOnBlur: true,
    initialValues: {
      'eligability': generateEligabilityInitialValues(protocol),
      'consent': generateConsentInitialValues(protocol),
      'additional': protocol.additional ? generateFormInitialValues(fromRedcapDefinition(protocol.additional.items)) : undefined,
    },
    validationSchema: Yup.object(schemas),
    onSubmit: (values) => {
      console.log(values)
      router.push("portal")
    },
  })

  const stepContent: {[key: string]: React.ReactNode} = {
    studyInformation: <EnrolmentStudyInformation 
        title={protocol.studyInformation?.title}
        content={protocol.studyInformation?.content}
      />,
    eligability: <EnrolmentEligability 
        setFieldValue={formik.setFieldValue}
        errors={(formik.errors['eligability']) ? formik.errors['eligability'] : {}}
        values={formik.values['eligability']}
        title={protocol.eligability.title}
        description={protocol.eligability.description}
        items={protocol.eligability.items}
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
            definition={fromRedcapDefinition(protocol.additional.items)}
            values={formik.values.additional} 
            setFieldValue={(id, value) => formik.setFieldValue('additional.' + id, value)} />,
    account: <Box>Register</Box>,
  }

  const _getKeyValue_ = (key: string) => (obj: Record<string, any>) => obj[key];

  function validateStep() {
    if (schemas[steps[stepIdx]]) {
      let vals = _getKeyValue_(steps[stepIdx])(formik.values)
      schemas[steps[stepIdx]].validate(vals, {abortEarly: false}).then(
        (val) => setDisabled(false)
      ).catch(
        (err: Yup.ValidationError) => {
          setDisabled(true)
          err.inner.map(
            (o) => {
              if (o.path) {
                formik.setFieldError(o.path, o.message)
              }
            }
          )
        }
      )
    } else {
      setDisabled(false)
    }}

  function nextStep() {
    if ((stepIdx + 1) < steps.length) {
      setStep(stepIdx + 1)
    }
  }
  
  function previousStep() {
    if (stepIdx > 0) {
      setStep(stepIdx - 1)
    } else {
      router.back()
    }
  }

  useEffect(() => {
    validateStep()
  }, [formik.values, stepIdx])

  return (
    <Container sx={{
      padding: 4,
      maxWidth: 'xs',
    }}
    maxWidth={'md'}
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack gap={4} margin={"auto"}>
          {stepContent[steps[stepIdx]]}
          <Box
            paddingTop={4}
            display={"flex"}
            sx={{ justifyContent: 'space-between' }}
            width={1}
            >
            <BackButton exit={stepIdx == 0} onClick={previousStep}/>
            {((stepIdx+1) == steps.length) ? 
              <SubmitButton disabled={disabled || formik.isSubmitting} onClick={formik.submitForm}/> : 
              <NextButton disabled={disabled} onClick={nextStep} />
            }
          </Box>
        </Stack>  
      </form>
    </Container>
  )
}