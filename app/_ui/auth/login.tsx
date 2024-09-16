"use client"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Box, Button, Card, Container, Grid, Link, Popover, Stack, TextField } from "@mui/material"
import React from "react"
import { useFormik } from "formik"
import Auth from '@/app/_lib/auth'
import { RadarCard } from "../components/base/card"

interface LoginProps {
    onLogin?: () => void
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
// const Login: React.FC<{onLogin?: () => void}> = (params: {onLogin?: () => void}) => {
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
            var errors = await auth.signIn(values?.email, values?.password)
            console.log(errors)
            if (errors.ok) {
                onLogin()
            } else {
                console.log('error')
            }
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