import { Box, FormControl, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ForwardedRef } from "react";

export const getYesNoOnChangeHandler = (setFieldValue: (id: string, value: boolean) => void): {(event: any, value: boolean): void} => {
  return (event: any, value: boolean) => { if (value != null) setFieldValue(event.target.id, value) }
}

interface YesNoButtonProps {
  onChange?: (event: React.MouseEvent<HTMLElement>, value: boolean) => void,
  value?: boolean,
  disabled?: boolean,
  id?: string,
  key?: string,
  color? : 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning'
}

export function YesNoButton(props: YesNoButtonProps) {
  var color = props.color ? props.color : 'primary'
  return (
      <ToggleButtonGroup 
        id={props.id}
        key={props.key}
        value={props.value}
        onChange={props.onChange}
        exclusive={true}
        disabled={props.disabled}
        color={color}
      >
        <ToggleButton id={props.id} key={props.key} value={false} aria-label='no'>No</ToggleButton>
        <ToggleButton id={props.id} key={props.key} value={true} aria-label='yes'>Yes</ToggleButton>
      </ToggleButtonGroup>
  )
}

interface YesNoFieldProps extends YesNoButtonProps {
  label?: string,
  description?: string
  helperText?: string
}

export function YesNoField({label, description, helperText, ...props}: YesNoFieldProps, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <FormControl sx={{width: '100%'}}>
      <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} gap={4}>
        <Box display={"flex"} flexDirection={"column"} textAlign={"left"}>
          <Typography variant="h4">{label}</Typography>
          <Typography variant="body1" >{description ? description : <div>&nbsp;</div>}</Typography>
          <Typography variant="overline"  color="error">{helperText ? helperText : <div>&nbsp;</div>}</Typography>
        </Box>
        <YesNoButton {...props}/>
      </Box>
    </FormControl>
  )
}