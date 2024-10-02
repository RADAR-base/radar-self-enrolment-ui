import { Box, FormControl, TextField, Typography } from "@mui/material";
import { ForwardedRef } from "react";
import { IDescriptiveItem } from "@/app/_lib/armt/definition/field.interfaces";
import { MarkdownContainer } from "@/app/_ui/components/base/markdown";

interface ArmtDescriptiveFieldProps extends IDescriptiveItem {
  disabled?: boolean,
  key?: string,
  color? : 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning'
}

export function ArmtDescriptiveField({label, content, ...props}: ArmtDescriptiveFieldProps, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <FormControl>
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"}>
        <Typography variant="h4">{label}</Typography>
        <MarkdownContainer>{content}</MarkdownContainer>       
      </Box>
    </FormControl>
  )
}