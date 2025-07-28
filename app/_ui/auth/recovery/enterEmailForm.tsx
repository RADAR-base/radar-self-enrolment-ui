import Yup from "@/app/_lib/armt/validation/yup";
import { IOryErrorFlow, IOryRecoveryFlow } from "@/app/_lib/auth/ory/flows.interface";
import { Stack, Typography, TextField, Box, Button } from "@mui/material";
import { useFormik } from "formik";
import { ChangeEventHandler, FocusEventHandler, FormEventHandler, useState } from "react";
import { errorTextFromFlow, FlowErrors } from "../common/displayErrors";
import { RecoveryEmailFormValues } from "./recovery.interfaces";
import { SubmitRecoveryEmail } from "./requests";


function HelperText({children}: {children: React.ReactNode}) {
  return <Typography variant="overline" component={'span'} color="error">
    {children}
  </Typography>
}

interface RecoveryEmailFormProps {
  values: RecoveryEmailFormValues,
  errors?: FlowErrors,
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  onSubmit?: FormEventHandler<HTMLFormElement>,
  disabled?: boolean
}

function RecoveryEmailForm({
  values, errors, onChange, onBlur, onSubmit, disabled
}: RecoveryEmailFormProps) {
  const onBackClick = () => window.history.back()

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={4} alignItems="flex-start">
        <Typography>Please enter the email address for the account you wish to recover</Typography>
        <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={values.email}
            onChange={onChange}
            onBlur={onBlur}
            helperText={<HelperText>{errors?.fields['email']}</HelperText>}
            error={(errors?.fields['email'] != undefined)}
            />
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} width={'100%'}>
            <Button color="primary" variant="contained" onClick={onBackClick}>
                Back
            </Button>
            <Button color="primary" variant="contained" type="submit" disabled={disabled}>
                Submit
            </Button>
          </Box>
        </Stack>
    </form>)
}

interface EnterEmailRecoveryComponentProps {
  flow: IOryRecoveryFlow
  email?: string
  setFlow: (flow: IOryRecoveryFlow | IOryErrorFlow) => void
}

export function EnterEmailRecoveryComponent(props: EnterEmailRecoveryComponentProps) {
  const formik = useFormik<RecoveryEmailFormValues>({
      initialValues: {
          email: props.email ?? '',
      },
      validationSchema: Yup.object({
        email: Yup.string().email("Please enter a valid email").required()
      }),
      onSubmit: (values) => {
        SubmitRecoveryEmail(values, props.flow).then(
          (flow) => {
            if (flow) {
              props.setFlow(flow)
            }
            formik.setSubmitting(false)
          }
        )
      }
  });

  const errors = errorTextFromFlow(props.flow)

  return <RecoveryEmailForm 
              values={formik.values}
              errors={errors}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onSubmit={formik.handleSubmit}
              disabled={(props.flow == undefined) || (formik.isSubmitting)}
  
    />
}