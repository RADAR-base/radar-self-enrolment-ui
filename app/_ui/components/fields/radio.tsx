import { Box, FormControl, RadioGroup, Radio, Typography, FormLabel, FormControlLabel, Button } from "@mui/material";
import { ChangeEvent, ForwardedRef, MouseEventHandler } from "react";
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

function handleChange(id: string, setFieldValue: (id: string, value: string) => void) {
  return (event: React.ChangeEvent, checked: boolean) => {
    if (checked) {
      setFieldValue(id, event.target.id)
    } else {
      setFieldValue(id, "")
    }
    }
  }

export function ArmtRadioField({label, choices, ...props}: ArmtRadioFieldProps, ref: ForwardedRef<HTMLDivElement>) {
  return (

      <Box display={"flex"} flexDirection={"column"} textAlign={"left"} gap={2} key={props.key}>
        <Typography variant="h2">{props.title}</Typography>
        <FormControl>
        <FormLabel>
          <Typography variant="h3">{label}</Typography>
        </FormLabel>
          <Box display={"flex"} flexDirection={"column"} textAlign={"left"} justifyItems={"left"}>
            {choices.map((choice) => (
              <RadioFieldChoice 
                  id={choice.code} 
                  code={choice.code}
                  groupValue={props.value} 
                  onChange={handleChange(props.id, props.setFieldValue)}
                  label={choice.label}
                  key={props.key + choice.code} 
                  />)
            )}
          </Box>
        </FormControl>
    </Box>
  )
}