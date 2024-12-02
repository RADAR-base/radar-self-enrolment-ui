import { Box, FormControl, TextField, Typography } from "@mui/material";
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
  const labelComponent = label ? <Box paddingRight={1} style={{'background': 'white'}}>{label}</Box> : null
  const mt = (((props.title != undefined ) || (description != undefined)) && (label == undefined)) ? 2 : 0
  return (
    <FormControl>
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"} marginTop={1}>
        {props.title && <Typography variant="h4" component={'span'}>{props.title}</Typography>}
        <Typography variant="body1" fontStyle={'italic'}>{description}</Typography>
        <TextField
          sx={{mt: mt}}
          type={type}
          id={props.id}
          label={labelComponent}
          key={props.key}
          value={props.value ?? ""}
          disabled={props.disabled}
          onChange={handleChange(props.setFieldValue)}
          helperText={<Typography variant="overline" component={'span'} color="error">{errorText}</Typography>}
          multiline={props.multiline}
          minRows={props.multiline ? 3 : undefined}
          maxRows={20}
          variant={props.multiline ? "outlined" : "standard"}
        />
      </Box>
    </FormControl>
  )
}