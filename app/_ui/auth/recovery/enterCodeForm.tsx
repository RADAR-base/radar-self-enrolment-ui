import Yup from "@/app/_lib/armt/validation/yup"
import { IOryRecoveryFlow } from "@/app/_lib/auth/ory/flows.interface"
import { getCsrfToken } from "@/app/_lib/auth/ory/util"
import { ProtocolContext } from "@/app/_lib/study/protocol/provider.client"
import { withBasePath } from "@/app/_lib/util/links"
import { Box, Typography, TextField, Button } from "@mui/material"
import { useFormik } from "formik"
import { useContext} from "react"

interface RecoveryCodeComponentProps {
  flow: IOryRecoveryFlow
  setFlow: (flow: IOryRecoveryFlow) => void
  errors?: {[key: string]: string}
}

export function RecoveryCodeComponent(props: RecoveryCodeComponentProps) {
  const study = useContext(ProtocolContext)

  async function submit(code: string) {
    const body = {
      code: code,
      csrf_token: getCsrfToken(props.flow),
      method: 'code'
    }
    const res = await fetch(withBasePath('/api/ory/recovery?' + new URLSearchParams({
      flow: props.flow.id
    })), {
      method: 'POST',
      body: JSON.stringify(body)
    })
    if (res.status == 422) {
      const data = await res.json()
      const redirUri = new URL(data.redirect_browser_to)
      if (study.studyId != undefined) {
        window.location.assign(withBasePath('/' + study.studyId + '/account/settings' + redirUri.search))
      } else {
          window.location.assign(withBasePath('/account/settings' + redirUri.search))
      }
    } else {
      const data = await res.json()
      props.setFlow(data)
    }
    formik.setSubmitting(false)
  }
  
  const formik = useFormik({
    initialValues: {code: ''},
    validationSchema: Yup.object({
      code: Yup.string()
               .matches(/^[0-9]+$/, 'Please enter the six digit code from the recovery email')
               .required('Please enter the six digit code from the recovery email')
    }),
    initialErrors: props.errors,
    onSubmit: (values: {code: string}) => {submit(values.code)}
  });

  const onBackClick = () => window.history.back()

  const onResendClick = () => {
    window.location.replace(window.location.pathname)
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
        <Button color="primary" variant="contained" onClick={onResendClick}>
          Resend Code
        </Button>
        <Button color="primary" variant="contained" type="submit" disabled={formik.isSubmitting}>
          Submit
        </Button>
      </Box>
    </Box>
    </form>
  )
}