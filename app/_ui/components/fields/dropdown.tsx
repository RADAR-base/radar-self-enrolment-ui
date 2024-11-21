import { Box, Typography, MenuItem, TextField } from "@mui/material";
import { ForwardedRef } from "react";
import { IDropdownItem } from "@/app/_lib/armt/definition/field.interfaces";

interface ArmtDropdownFieldProps extends IDropdownItem {
  disabled?: boolean,
  key?: string,
  value?: string
  color? : 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning',
  setFieldValue: (id: string, value: string) => void
}

export function ArmtDropdownField(props: ArmtDropdownFieldProps, ref: ForwardedRef<HTMLDivElement>) {

  return (
    <Box display={"flex"} flexDirection={"column"} textAlign={"left"} gap={1} key={props.key}>
      <Typography variant="h2">{props.title}</Typography>
        <TextField
          select
          id={props.id}
          value={props.value ?? ""}
          onChange={(event) => {props.setFieldValue(props.id, event.target.value)}}
          variant="standard"
          label={props.label}
        >
          {props.choices.map((choice) => (
            <MenuItem value={choice.code} key={props.id + '.' + choice.code}>{choice.label}</MenuItem>
          ))}          
        </TextField>
  </Box>
  )
}