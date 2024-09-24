"use client"
import { Box, Button, Container, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { EnrolmentStudyInformation } from './information';
import { EnrolmentEligability } from './eligability';
import { EnrolmentConsent } from './consent';
import { useEffect } from 'react';
import React from 'react';

interface EnrolmentContentProps {}

export function EnrolmentContent(props: EnrolmentContentProps) {

  var schema = Yup.object({
    'eligability': Yup.object({
      'criteria1': Yup.boolean().isTrue().required(),
      'criteria2': Yup.boolean().isTrue('Required').required(),
      'criteria3': Yup.boolean().isTrue().required(),
    }),
    'consent': Yup.object({
      'required1': Yup.boolean().isTrue().required(),
      'required2': Yup.boolean().isTrue().required()
    })
  })

  const formik = useFormik({
    isInitialValid: false,
    validateOnChange: false,
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
    validationSchema: schema,
    onSubmit: (values) => {console.log(values)},
  })

  const steps = [
    <EnrolmentStudyInformation />,
    <EnrolmentEligability formik={formik} />,
    <EnrolmentConsent />
  ]

  const [disabled, setDisabled] = React.useState(true)

  useEffect(() => {
    validateStep()
  })

  function validateStep() {
      schema.validateAt('eligability', formik.values, {abortEarly: false}).then(
        (val) => setDisabled(false)
      ).catch(
        (err: Yup.ValidationError) => {
          setDisabled(true)
        }
      )
      return
    }

  return (
    <Container sx={{
      padding: 4,
      maxWidth: 'xs',
    }}
    maxWidth={'md'}
>
      <Stack gap={4}>
        <form onSubmit={formik.handleSubmit}>
          {steps[1]}
        </form>
        <Box
          display={"flex"}
          sx={{ justifyContent: 'space-between' }}
          width={1}
          >
          <Button color="primary" variant="contained">
              Back
          </Button>
          <Button color="primary" variant="contained" disabled={disabled}>
              Continue
          </Button>
        </Box>
      </Stack>  
    </Container>
  )
}