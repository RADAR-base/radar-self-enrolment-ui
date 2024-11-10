import { Stack, Typography } from "@mui/material";
import React from "react";
import { MarkdownContainer } from "../components/base/markdown";

interface EnrolmentStudyInformationProps {
  title?: string
  content?: string
}

export function EnrolmentStudyInformation(props: EnrolmentStudyInformationProps) {
  const title = props.title ? props.title : 'Study Information'

  return (
    <Stack spacing={4} alignItems="inherit" textAlign={"left"}>
      <Typography variant="h2">{title}</Typography>
      <MarkdownContainer>{props.content}</MarkdownContainer>
    </Stack>
)}