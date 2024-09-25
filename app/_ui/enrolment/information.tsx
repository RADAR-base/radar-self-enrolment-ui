import { Divider, Stack, Typography } from "@mui/material";
import React from "react";

interface EnrolmentStudyInformationProps {
  title?: string
  description?: string
  content?: string
}
export function EnrolmentStudyInformation(props: EnrolmentStudyInformationProps) {
  const title = props.title ? props.title : 'Study Information'
  const content = props.content

  return (
    <Stack spacing={4} alignItems="inherit">
      <Typography variant="h2" align="left">{title}</Typography>
      {props.description && <Typography variant="subtitle1" align="left" paddingBottom={2}>{props.description}</Typography>}
      {props.content && <Typography variant="body1" align="left">{content}</Typography>}
    </Stack>
)}