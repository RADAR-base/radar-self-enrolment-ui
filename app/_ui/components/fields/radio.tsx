import { Box, FormControl, RadioGroup, Radio, Typography, FormControlLabel } from "@mui/material";
import { ForwardedRef } from "react";
import { IRadioItem } from "@/app/_lib/armt/definition/field.interfaces";

interface ArmtRadioFieldProps extends IRadioItem {
  disabled?: boolean,
  key?: string,
  value?: string
  color? : 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning',
  setFieldValue: (id: string, value: string) => void
}

interface RadioFieldChoiceProps {
  id: string,
  code: string,
  label: string,
  groupValue?: string,
  onChange: (event: React.ChangeEvent, checked: boolean) => void,
}

function RadioFieldChoice(props: RadioFieldChoiceProps, key?: string): React.ReactNode {
  return (
    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
      <Radio 
        id={props.id}
        value={props.code}
        checked={props.code == props.groupValue}
        onChange={props.onChange}
        inputProps={{ 'aria-label': props.label }}
      />
      <Typography variant="body1" key={key + "label"}>{props.label}</Typography>
  </Box>
  )
}

function groupHandleChange(id: string, setFieldValue: (id: string, value: string) => void) {
  return (event: React.ChangeEvent, value: string) => setFieldValue(id, value)
}

export function ArmtRadioField(props: ArmtRadioFieldProps, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <Box display={"flex"} flexDirection={"column"} textAlign={"left"} gap={1} key={props.key}>
      <Typography variant="h4">{props.title}</Typography>
      {/*<FormLabel>*/}
      {props.label && <Typography variant="body1" component={'span'}>{props.label}</Typography>}
      {props.description && <Typography variant="body1" component={'span'} fontStyle={'italic'}>{props.description}</Typography>}
      {/*</FormLabel>*/}
      <FormControl>
      <RadioGroup
        value={props.value ??  ""}
        name={props.id}
        onChange={groupHandleChange(props.id, props.setFieldValue)}
        >
          {props.choices.map((choice) => (
            <FormControlLabel value={choice.code} label={choice.label} control={<Radio />} key={props.id + choice.code + "_radio"} />
            ))
          }
      </RadioGroup>
      </FormControl>
  </Box>
  )
}