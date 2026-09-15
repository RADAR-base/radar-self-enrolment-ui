"use client"
import Yup from "@/app/_lib/armt/validation/yup"
import { IOrySettingsFlow } from "@/app/_lib/auth/ory/flows.interface"
import { getCsrfToken } from "@/app/_lib/auth/ory/util"
import { withBasePath } from "@/app/_lib/util/links"
import { Box, Typography, TextField, Button } from "@mui/material"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PasswordTextField } from "./passwordField"

interface SettingsProps {
  onComplete?: () => void
  redirectTo?: string
  flow?: IOrySettingsFlow
}

export default function SettingsComponent(props: SettingsProps) {
  let [errorText, setErrorText] = useState<string>('');
  let [flow, setFlow] = useState<IOrySettingsFlow | undefined>(props.flow);
  const router = useRouter()

  const getFlow = async (setFlow: (v: any) => void) => {
    const response = await fetch(withBasePath('/api/ory/settings/browser'))
    if (response.ok) {
      const data = await response.json()
      setFlow(data)
    }
  }

  const updatePassword = async (password: string): Promise<Response> => {
    const body = {
      password: password,
      csrf_token: getCsrfToken(flow)
    }
    if (flow) {
      const res = await fetch(withBasePath('/api/ory/settings?' + new URLSearchParams({
        flow: flow.id
      })), {
        method: 'POST',
        body: JSON.stringify(body)
      })  
      return res
    } else {
      throw new Error("No flow")
    }
  }

  const displayErrors = (flow: IOrySettingsFlow) => {
    if (flow) {
      if (("messages" in flow.ui) && (flow.ui.messages.length > 0)) {
        setErrorText(flow.ui.messages[0].text)
      }
      const passwordNode = (flow.ui.nodes.find(node => node.attributes.name == "password"))
      if (passwordNode && passwordNode.messages.length > 0) {
        formik.setFieldError("password", passwordNode.messages[0].text)
      }
    }
  }

  useEffect(() => {
    if (flow === undefined) {
      getFlow(setFlow)
    } else {
      displayErrors(flow)
    }
  }, [flow])

  const onComplete = props.onComplete ? props.onComplete : 
      () => {
        props.redirectTo && router.push(props.redirectTo)
        router.refresh()
      }

  const formik = useFormik({
    validateOnChange: true,
    validateOnMount: true,
    validateOnBlur: false,
    initialValues: {
      "password": "",
      "password_confirm": ""
    },
    validationSchema: Yup.object({
      password: Yup.string().min(12, "Your password must be over 12 characters").required("Please enter a new password"),
      password_confirm: Yup.string().oneOf([Yup.ref("password"), undefined], "Your passwords do not match").required("Please confirm your password")
    }),
    onSubmit: async (values) => {
      const r = await updatePassword(values.password)
      if (r.ok) {
        onComplete()
      } else {
        const data = await r.json()
        setFlow(data)
      }
      formik.setSubmitting(false)
    }
  })
  const title = 'Set a new password'
  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display={"flex"} flexDirection={"column"} gap={4} textAlign={"left"}>
        <Typography variant="h2">{title}</Typography>
          <PasswordTextField
            id="password"
            name="password"
            label="New Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
            autoComplete="new-password"
            />
          <PasswordTextField
            id="password_confirm"
            name="password_confirm"
            label="Confirm New Password"
            value={formik.values.password_confirm}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password_confirm && Boolean(formik.errors.password_confirm)}
            helperText={formik.touched.password_confirm && formik.errors.password_confirm}
            fullWidth
            autoComplete="new-password"
            />
        <Button color="primary" variant="contained" disabled={(!formik.isValid) || formik.isSubmitting} type={'submit'} style={{alignSelf: 'end'}}>
          Update password
        </Button>
      </Box>
    </form>
)}
