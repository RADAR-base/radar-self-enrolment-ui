// "use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as Yup from 'yup';

import { Box, Button, Stack, styled, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { withBasePath } from "@/app/_lib/util/links";
import { getCsrfToken } from "@/app/_lib/auth/ory/util";

const CustomTextField = styled(TextField)({
  '& .MuiFormHelperText-root.Mui-error': {
    position: 'absolute',
    top: '100%'
  }
});

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required("Required"),
  password: Yup.string().min(12, "Password must be at least 12 characters").required("Required")
})

const Register: React.FC<{onRegister?: () => void}> = (props: {onRegister?: () => void}) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  let [flow, setFlow] = useState<any>();
  let [errorText, setErrorText] = useState<string>('');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const getFlow = async (setFlow: (v: any) => void) => {
    const response = await fetch(withBasePath('/api/ory/registration/browser'))
    if (response.ok) {
      const data = await response.json()
      router.push(pathname + '?' + createQueryString('flowId', data.id ))
      setFlow(data)
    }
  }
  
  const register = async (email: string, password: string): Promise<Response> => {
    const body = {
      email: email,
      password: password,
      csrf_token: getCsrfToken(flow),
      traits: {}
    }
    const res = await fetch(withBasePath('/api/ory/registration?' + new URLSearchParams({
      flow: flow.id
    })), {
      method: 'POST',
      body: JSON.stringify(body)
    })
    return res
  }

  useEffect(() => {
    if (flow === undefined) {
      getFlow(setFlow)
    }
  }, [flow])

  const onRegister = props.onRegister ? props.onRegister : () => router.push('/')
  const formik = useFormik({
      validateOnMount: false,
      initialValues: {
          email: '',
          password: '',
      },
      validationSchema: RegisterSchema,
      onSubmit: async (values: {email: string, password: string}) =>  {
        const res = await register(values.email, values.password)
        if (res.ok) {
          onRegister()
        } else {
          if (res.status == 400) {
            const data = await res.json()
            setFlow(data)
            if (data?.ui?.messages !== undefined) {
              setErrorText(data.ui.messages[0]['text'])
            }
          }
        }
      }
  });
  return (
    <Box 
      justifyContent={"center"}
      p={4}>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={4} alignItems="center">
          <h1>Sign Up</h1>
          {(!!errorText) ? <Typography variant="caption" color="error">{errorText}</Typography> : null}
          <CustomTextField
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            hidden={true}
            fullWidth
            />
          <CustomTextField
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
            />
          <Button color="primary" variant="contained" type="submit" disabled={(formik.isValid == null) ? false : (!formik.isValid)}>
            Sign Up
          </Button>
        </Stack>
      </form>
  </Box>
)}

export default Register