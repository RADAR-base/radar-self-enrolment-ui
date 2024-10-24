"use client"
import { useRouter } from "next/navigation"
import { Box, Button, Popover, Stack, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import Auth from '@/app/_lib/auth'
import { RadarCard } from "../components/base/card"

import ory from '@/app/_lib/auth/ory/api.client'
import { getCsrfToken } from "@/app/_lib/auth/ory/util"


interface LoginProps {
    onLogin?: () => void
    loginChallenge?: string
}

export function LoginModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const router = useRouter();
    return (
      <React.Fragment>
        <Button 
          onClick={handleOpen}
          fullWidth>
            Login Modal
        </Button>
        <Popover
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          anchorOrigin={{
            'vertical': 'center',
            'horizontal': 'center',
          }}
          transformOrigin={{
            'vertical': 'center',
            'horizontal': 'center',
          }}
        >
          <RadarCard>
            <LoginComponent onLogin={() => {handleClose(); router.refresh()}}></LoginComponent>
          </RadarCard>
        </Popover>
      </React.Fragment>
    )
  }

export function LoginComponent(props: LoginProps) {
    let [flow, setFlow] = useState<any>();


    useEffect(() => {
      if (flow === undefined) {
        // kratos.createBrowserLoginFlow({loginChallenge: props.loginChallenge}).then(
        //   (({data: data}) => {
        //     setFlow(data)
        //   }))
        console.log(props.loginChallenge)
        ory.createLoginFlow({login_challenge: props.loginChallenge}).then(
          (val) => {
            val.json().then(
              (data) => {
                setFlow(data)
              }
            )
            setFlow(val)
          }
        )
        }
      console.log(flow)
    }, [])

    const router = useRouter()
    const auth = new Auth();
    const onLogin = props.onLogin ? props.onLogin : () => router.push('/')
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async (values: any) => 
        {
          const body = {
            method: 'password',
            identifier: values.email,
            password: values.password,
            csrf_token: getCsrfToken(flow),      
          }
          console.log(body)
          let b = await ory.submitLoginFlow(flow.id, body)
          console.log(await b.json())
            // var errors = await auth.signIn(values?.email, values?.password)
            // console.log(errors)
            // if (errors.ok) {
            //     onLogin()
            // } else {
            //     console.log('error')
            // }
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
                <h1>Login</h1>
                <TextField
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}/>
                <TextField
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}/>
                <Button color="primary" variant="contained" type="submit" disabled={formik.isSubmitting}>
                    Login
                </Button>
                </Stack>
            </form>
        </Box>
)}

export default LoginComponent