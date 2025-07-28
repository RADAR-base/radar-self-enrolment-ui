import Yup from "@/app/_lib/armt/validation/yup"
import { IOryErrorFlow, IOryRecoveryFlow } from "@/app/_lib/auth/ory/flows.interface"
import { getCsrfToken } from "@/app/_lib/auth/ory/util"
import { ProtocolContext } from "@/app/_lib/study/protocol/provider.client"
import { withBasePath } from "@/app/_lib/util/links"
import { Box, Typography, TextField, Button } from "@mui/material"
import { useFormik } from "formik"
import { useContext, useState} from "react"
import { SubmitRecoveryCode, SubmitRecoveryEmail } from "./requests"

function emailFromFlow(flow: IOryRecoveryFlow): string | undefined {
  if (flow.state == 'sent_email') {
    const node = flow.ui.nodes.find((node) => node.attributes.name == 'email')
    if (node) {
      return node.attributes.value
    }
  }
  return undefined
}

interface RecoveryCodeComponentProps {
  flow: IOryRecoveryFlow
  setFlow: (flow: IOryRecoveryFlow | IOryErrorFlow) => void
  errors?: {[key: string]: string}
  email?: string
}

export function RecoveryCodeComponent(props: RecoveryCodeComponentProps) {  
  const [disabled, setDisabled] = useState<boolean>(false)
  const formik = useFormik({
    initialValues: {code: ''},
    validationSchema: Yup.object({
      code: Yup.string()
               .matches(/^[0-9]+$/, 'Please enter the six digit code from the recovery email')
               .required('Please enter the six digit code from the recovery email')
    }),
    initialErrors: props.errors,
    onSubmit: (values) => {
       SubmitRecoveryCode(values, props.flow).then(
          (flow) => {
            if (flow) {
              props.setFlow(flow)
            }
            formik.setSubmitting(false)
          }
        )
      }
  });

  
  const onBackClick = () => window.history.back()

  const onResendClick = async () => {
    setDisabled(true)
    const email = emailFromFlow(props.flow)
    if (email) {
      const newFlow = await SubmitRecoveryEmail({email}, props.flow)
      if (newFlow) {
        props.setFlow(newFlow)
      }
    }
    setDisabled(false)
  }

  return (
    <form onSubmit={formik.handleSubmit}>
    <Box display={'flex'} flexDirection={'column'} gap={4}>
      <Box>
      <Typography>An email has been sent containing a recovery code. Please enter it in the box below</Typography>
      </Box>
      <TextField
              fullWidth
              id="code"
              name="code"
              label="Recovery Code"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              slotProps={{htmlInput: {'inputMode': 'numeric'}, input: {inputMode: 'numeric'}}}
              helperText={<Typography variant="overline" component={'span'} color="error">{formik.errors.code?.toString()}</Typography>}
              error={(formik.errors.code != undefined)}
              autoComplete='one-time-code'
              />
      <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} width={'100%'}>
        <Button color="primary" variant="contained" onClick={onBackClick}>
          Back
        </Button>
        <Button color="primary" variant="contained" onClick={onResendClick} disabled={disabled}>
          Resend Code
        </Button>
        <Button color="primary" variant="contained" type="submit" disabled={formik.isSubmitting || disabled}>
          Submit
        </Button>
      </Box>
    </Box>
    </form>
  )
}