import Yup from "@/app/_lib/armt/validation/yup";
import { IOryRecoveryFlow } from "@/app/_lib/auth/ory/flows.interface";
import { getCsrfToken } from "@/app/_lib/auth/ory/util";
import { withBasePath } from "@/app/_lib/util/links";
import { Stack, Typography, TextField, Box, Button } from "@mui/material";
import { useFormik } from "formik";
import { ChangeEventHandler, FocusEventHandler, FormEventHandler, useState } from "react";
import { errorTextFromFlow, FlowErrors } from "../common/displayErrors";

interface RecoveryEmailFormValues {
  email: string
}

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
  flow?: IOryRecoveryFlow
  email?: string
  setFlow: (flow: IOryRecoveryFlow) => void
}

export function EnterEmailRecoveryComponent(props: EnterEmailRecoveryComponentProps) {
  const [errors, setErrors] = useState<FlowErrors>()
  const submit = async ({email}: RecoveryEmailFormValues): Promise<void> => {
    if (props.flow) {
      const body = {
        email: email,
        csrf_token: getCsrfToken(props.flow),
        method: 'code'
      }
      const res = await fetch(withBasePath('/api/ory/recovery?' + new URLSearchParams({
        flow: props.flow.id
      })), {
        method: 'POST',
        body: JSON.stringify(body)
      })
      if (res.ok) {
        const newFlow = (await res.json()) as IOryRecoveryFlow
        setErrors(errorTextFromFlow(newFlow))
        props.setFlow(newFlow)
      }
      formik.setSubmitting(false)
    }
  }

  const formik = useFormik<RecoveryEmailFormValues>({
      initialValues: {
          email: props.email ?? '',
      },
      validationSchema: Yup.object({
        email: Yup.string().email("Please enter a valid email").required()
      }),
      onSubmit: submit
  });

  return <RecoveryEmailForm 
              values={formik.values}
              errors={errors}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onSubmit={formik.handleSubmit}
              disabled={(props.flow == undefined) || (formik.isSubmitting)}
  
    />
}