import { Box, FormControl, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ChangeEvent, ForwardedRef } from "react";
import { ITextItem } from "../../../_lib/armt/definition/field.interfaces";

interface ArmtTextFieldProps extends ITextItem {
  setFieldValue: (id: string, value: string) => void
  value?: boolean,
  disabled?: boolean,
  key?: string,
  color? : 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning'
}

function handleChange(setFieldValue: (id: string, value: string) => void) {
  return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFieldValue(event.target.id, event.target.value)
}

export function ArmtTextField({label, description, errorText, type, ...props}: ArmtTextFieldProps, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <FormControl>
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"}>
        <Typography variant="h4" component={'span'}>{label}</Typography>
        <Typography variant="body1" component={'span'} >{description ? description : <div>&nbsp;</div>}</Typography>
        <Typography variant="overline" component={'span'} color="error">{errorText ? errorText : <div>&nbsp;</div>}</Typography>
        <TextField 
          type={type}
          id={props.id}
          key={props.key}
          value={props.value}
          disabled={props.disabled}
          onChange={handleChange(props.setFieldValue)}
        />
      </Box>
    </FormControl>
  )
}