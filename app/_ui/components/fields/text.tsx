import { Box, FormControl, TextField, Typography } from "@mui/material";
import { ChangeEvent, ForwardedRef } from "react";
import { ITextItem } from "../../../_lib/armt/definition/field.interfaces";

interface ArmtTextFieldProps extends ITextItem {
  setFieldValue: (id: string, value: string) => void
  value?: string,
  disabled?: boolean,
  key?: string,
  color? : 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning'
}

function handleChange(setFieldValue: (id: string, value: string) => void) {
  return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log("onChange: ", event.target.value)
    setFieldValue(event.target.id, event.target.value)
  }
}

export function ArmtTextField({
  title, 
  label, 
  description, 
  errorText, 
  type, 
  id, 
  key, 
  value, 
  disabled,
  setFieldValue,
  multiline
}: ArmtTextFieldProps) {
  const mt = (((title != undefined ) || (description != undefined)) && (label == undefined)) ? 2 : 0
  return (
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"} >
        {title && <Typography variant="h4" component={'span'}>{title}</Typography>}
        <Typography variant="body1" fontStyle={'italic'}>{description}</Typography>
        <TextField
          sx={{mt: mt}}
          type={type}
          id={id}
          label={label}
          key={key}
          value={value ?? ""}
          disabled={disabled}
          onChange={handleChange(setFieldValue)}
          helperText={<Typography variant="overline" component={'span'} color="error">{errorText}</Typography>}
          multiline={multiline}
          minRows={3}
          maxRows={16}
          variant={"outlined"}
        />
      </Box>
  )
}