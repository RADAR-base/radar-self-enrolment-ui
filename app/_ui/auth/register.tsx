// "use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from 'yup';

import { Box, Button, Card, Container, Link, Stack, TextField } from "@mui/material";

import { useFormik } from "formik";
import Auth from '@/app/_lib/auth'

const auth = new Auth();

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required("Required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Required")
})

const Register: React.FC<{onRegister?: () => void}> = (params: {onRegister?: () => void}) => {
    const router = useRouter()   
    const onRegister = params.onRegister ? params.onRegister : () => router.push('/')
         
    const formik = useFormik({
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
                console.log('something wrong')
              }
            }
          )
        }
    });

    return (
      <Box 
        display="flex"
        alignItems="center"
        alignContent="center"
        p={4}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2} alignItems="center">
            <h1>Sign Up</h1>
            <TextField
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
            <TextField
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
            <Button color="primary" variant="contained" type="submit">
                Sign Up
            </Button>
          </Stack>
        </form>
    </Box>
)}


export default Register