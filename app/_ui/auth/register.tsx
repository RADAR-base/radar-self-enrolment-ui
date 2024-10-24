// "use client";
import { useRouter } from "next/navigation";
import * as Yup from 'yup';

import { Box, Button, Stack, styled, TextField, Typography } from "@mui/material";

import { useFormik } from "formik";
import Auth from '@/app/_lib/auth'
import { useState } from "react";

const CustomTextField = styled(TextField)({
  '& .MuiFormHelperText-root.Mui-error': {
    position: 'absolute',
    top: '100%'
  }
});

const auth = new Auth();

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required("Required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Required")
})

const Register: React.FC<{onRegister?: () => void}> = (params: {onRegister?: () => void}) => {
    const router = useRouter()   
    const onRegister = params.onRegister ? params.onRegister : () => router.push('/')
    
    let [errorText, setErrorText] = useState<string>("")

    const formik = useFormik({
        validateOnMount: false,
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: RegisterSchema,
        onSubmit: (values: {email: string, password: string}) => {
          auth.register(values.email, values.password).then(
            (resp) => {
              if (resp.ok) {
                onRegister()
              } else {
                setErrorText(resp.errors?.pop().text)
              }
            }
          )
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