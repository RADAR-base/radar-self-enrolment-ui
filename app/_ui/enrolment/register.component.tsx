import { Stack, TextField, Typography } from "@mui/material";
import React, { ChangeEvent } from "react";
import { MarkdownContainer } from "../components/base/markdown";

interface EnrolmentRegisterProps {
  title?: string
  description?: string
  setFieldValue: (id: string, value: string) => void
  values: {[key: string]: string | undefined}
  errors: {[key: string]: string | undefined}
}

export function EnrolmentRegister({setFieldValue, values, errors, ...props}: EnrolmentRegisterProps) {
  const title = props.title ? props.title : 'Sign up'
  return (
    <Stack spacing={4} alignItems="center" textAlign={"left"}>
      <Typography variant="h2">{title}</Typography>
      {props.description && <MarkdownContainer>{props.description}</MarkdownContainer>}
        <TextField
          sx={{maxWidth: 400}}
          id="email"
          name="email"
          label="Email"
          value={values.email ?? ''}
          onChange={(ev) => setFieldValue('register.email', ev.target.value)}
          error={(errors.email != undefined) && (errors.email.length > 0)}
          helperText={errors.email}
          fullWidth
          />
        <TextField
          sx={{maxWidth: 400}}
          id="password"
          name="password"
          label="Password"
          type="password"
          value={values.password ?? ''}
          onChange={(ev) => setFieldValue('register.password', ev.target.value)}
          error={(errors.password != undefined) && (errors.password.length > 0)}
          helperText={errors.password}
          fullWidth
          />
    </Stack>
)}
