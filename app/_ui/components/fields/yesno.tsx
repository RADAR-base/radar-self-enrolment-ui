import { Box, FormControl, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ForwardedRef } from "react";
import { MarkdownContainer } from "../base/markdown";

export const getYesNoOnChangeHandler = (setFieldValue: (id: string, value: boolean) => void): {
  (event: any, value: boolean): void } => {
    return (event: any, value: boolean) => { 
      if (value != null) setFieldValue(event.target.id, value) 
    }
  }

interface YesNoButtonProps {
  onChange?: (event: React.MouseEvent<HTMLElement>, value: boolean) => void,
  value?: boolean,
  disabled?: boolean,
  id?: string,
  key?: string,
  color?: 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning'
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
      size="small"
    >
      <ToggleButton sx={{ minWidth: "6em", width: { xs: "100%", sm: "auto" } }}
                    id={props.id} key={props.key} value={false} aria-label='no'>
        No
      </ToggleButton>
      <ToggleButton sx={{ minWidth: "6em", width: { xs: "100%", sm: "auto" } }} 
                    id={props.id} key={props.key} value={true} aria-label='yes'>
        Yes
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

interface YesNoFieldProps extends YesNoButtonProps {
  title?: string
  label?: string,
  description?: string
  errorText?: string
  setFieldValue: (id: string, value: boolean) => void
  autoFocus?: boolean
}

export function YesNoField({ 
  title,
  label,
  description,
  errorText,
  setFieldValue,
  autoFocus,
  ...props 
}: YesNoFieldProps) {
  return (
    <FormControl sx={{ width: '100%' }} autoFocus={autoFocus ?? false}>
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"} gap={1}>
        {title && <Typography variant="h4" component={'span'}>{title}</Typography>}
        <Box display={"flex"} flexDirection={{ xs: "column", sm: "row" }}
          justifyContent={"space-between"} alignItems={{ xs: "normal", sm: "center" }} gap={{ xs: 1, sm: 4 }}>
          {((label != undefined) || (description != undefined)) &&
            <Box display={"flex"} flexDirection={"column"} textAlign={"left"}>
              <Typography variant="h4">{label}</Typography>
              <MarkdownContainer>{description}</MarkdownContainer>
            </Box>}
          <YesNoButton {...props} onChange={getYesNoOnChangeHandler(setFieldValue)} />
        </Box>
        <Typography variant="overline" color="error">{errorText}</Typography>
      </Box>
    </FormControl>
  )
}