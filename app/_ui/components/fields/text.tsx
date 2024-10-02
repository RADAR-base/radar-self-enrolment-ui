import { Box, FormControl, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ForwardedRef } from "react";
import { ITextItem } from "../../../_lib/armt/definition/field.interfaces";

interface ArmtTextFieldProps extends ITextItem {
  type?: string
  onChange?: (event: React.MouseEvent<HTMLElement>, value: boolean) => void,
  value?: boolean,
  disabled?: boolean,
  key?: string,
  color? : 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning'
}

export function ArmtTextField({label, description, errorText, type, ...props}: ArmtTextFieldProps, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <FormControl>
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"}>
        <Typography variant="h4">{label}</Typography>
        <Typography variant="body1" >{description ? description : <div>&nbsp;</div>}</Typography>
        <Typography variant="overline"  color="error">{errorText ? errorText : <div>&nbsp;</div>}</Typography>
        <TextField 
          type={type}
          id={props.id}
          key={props.key}
          value={props.value}
          // onChange={props.onChange}
          disabled={props.disabled}
          // color={color}
        />
      </Box>
    </FormControl>
  )
}