"use client"
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { FormikValues, useFormik } from 'formik';
import { EnrolmentStudyInformation } from './information';
import { EnrolmentEligability } from './eligability';
import { EnrolmentConsent } from './consent';
import { useEffect } from 'react';
import React from 'react';
import Yup from '@/app/_lib/validation/yupMethods'
import { LoremIpsum } from '../debug/lorem';
import { useRouter } from 'next/navigation'

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
            Submit
          </Button>
}

interface EnrolmentContentProps {}

export function EnrolmentContent(props: EnrolmentContentProps) {
  const router = useRouter();
  const steps = [
    "study_information",
    "eligability",
    "consent",
    "signin",
    "additional"
  ]

  const eligabilitySchema = Yup.object({
    'criteria1': Yup.boolean().isTrue().required(),
    'criteria2': Yup.boolean().isTrue().required(),
    'criteria3': Yup.boolean().isTrue().required(),
  })
  const consentSchema = Yup.object({
    'required1': Yup.boolean().isTrue().required(),
    'required2': Yup.boolean().isTrue().required()
  })
  const schemas: {[key: string]: Yup.Schema} = {
    eligability: eligabilitySchema,
    consent: consentSchema
  }
  const formik = useFormik({
    validateOnChange: true,
    validateOnMount: false,
    validateOnBlur: true,
    initialValues: {
      'eligability': {
        'criteria1': undefined,
        'criteria2': undefined,
        'criteria3': undefined
      },
      'consent': {
        'required1': undefined,
        'required2': undefined
      }
    },
    validationSchema: Yup.object(schemas),
    onSubmit: (values) => {
      console.log(values)
    },
  })

  const stepContent: {[key: string]: React.ReactElement} = {
    study_information: <EnrolmentStudyInformation />,
    eligability: <EnrolmentEligability 
      setFieldValue={formik.setFieldValue}
      errors={(formik.errors['eligability']) ? formik.errors['eligability'] : {}}
      values={formik.values['eligability']}
      items={
        [
          {
            fieldType: "yesno",
            id: "criteria1",
            label: "Criteria 1",
            description: LoremIpsum.slice(0, 90),
          },
          {
            fieldType: "yesno",
            id: "criteria2",
            label: "Criteria 2",
            description: LoremIpsum.slice(0, 120),
          },
          {
            fieldType: "yesno",
            id: "criteria3",
            label: "Criteria 3",
            description: LoremIpsum.slice(0, 100),
          },
        ]
      }
      />,
    consent: <EnrolmentConsent 
      setFieldValue={formik.setFieldValue}
      errors={(formik.errors['consent']) ? formik.errors['consent'] : {}}
      values={formik.values['consent']}
      requiredItems={
        [
          {
            fieldType: 'yesno',
            id: 'required1',
            label: 'Example required consent item 1',
            description: 'Consent item description'
          },
          {
            fieldType: 'yesno',
            id: 'required2',
            label: 'Example required consent item 2',
            description: LoremIpsum.slice(0, 190)
          }
        ]
      }
      optionalItems={
        [
          {
            fieldType: 'yesno',
            id: 'optional2',
            label: 'Example optional consent item 1',
            description: LoremIpsum.slice(0, 20)
          }
        ]
      }
    />,
    signin: <Box><Typography variant="h1">Sign In</Typography></Box>,
    additional: <Box><Typography variant="h1">Additional Questions</Typography></Box>,
  }
  const [disabled, setDisabled] = React.useState(true)
  const [stepIdx, setStep] = React.useState(0)

  useEffect(() => {
    validateStep()
  }, [formik.values, stepIdx])

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