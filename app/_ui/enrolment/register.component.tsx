import { Box, Stack, TextField, Typography } from "@mui/material";
import React, { ChangeEvent } from "react";
import { MarkdownContainer } from "../components/base/markdown";
import { ArmtDescriptiveField } from "../components/fields/descriptive";

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
    <Box display={"flex"} flexDirection={"column"} gap={4} textAlign={"left"}>
      {title ? <Typography variant="h2">{title}</Typography>: null}
      {props.description && <ArmtDescriptiveField title={undefined} fieldType={"descriptive"} content={props.description} id={"heading"} />}
        <TextField
          id="email"
          name="email"
          label="Email"
          value={values.email ?? ''}
          onChange={(ev) => setFieldValue('register.email', ev.target.value)}
          error={(errors.email != undefined) && (errors.email.length > 0)}
          helperText={<Typography variant="overline"  color="error">{errors.email}</Typography>}
          fullWidth
          autoComplete="email"
          />

        <TextField
          id="password"
          name="password"
          label="Password"
          type="password"
          value={values.password ?? ''}
          onChange={(ev) => setFieldValue('register.password', ev.target.value)}
          error={(errors.password != undefined) && (errors.password.length > 0)}
          helperText={<Typography variant="overline"  color="error">{errors.password}</Typography>}
          fullWidth
          autoComplete="new-password"
          />
    </Box>
)}
