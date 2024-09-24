import { Box, FormControl, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

export const getYesNoOnChangeHandler = (formik: any): {(event: any, value: boolean): void} => {
  return (event: any, value: boolean) => { if (value != null) formik.setFieldValue(event.target.id, value) }
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
    <div onInput={console.log} onBlur={console.log}>
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
      </div>
  )
}

interface YesNoFieldProps extends YesNoButtonProps {
  label?: string,
  description?: string
  helperText?: string
}

export function YesNoField(props: YesNoFieldProps) {
  return (
    <FormControl>
      <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} gap={4}>
        <Box display={"flex"} flexDirection={"column"}>
          <Typography variant="h4" align="left">{props.label}</Typography>
          <Typography variant="body1" align="left">{props.description}</Typography>
          <Typography variant="overline" align="left" color="error">{props.helperText}</Typography>
        </Box>
        <YesNoButton {...props}/>
      </Box>
    </FormControl>
  )
}