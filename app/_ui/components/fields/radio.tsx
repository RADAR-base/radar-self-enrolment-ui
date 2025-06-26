import { Box, FormControl, RadioGroup, Radio, Typography, FormControlLabel } from "@mui/material";
import { IRadioItem } from "@/app/_lib/armt/definition/field.interfaces";

interface ArmtRadioFieldProps extends IRadioItem {
  disabled?: boolean,
  key?: string,
  value?: string
  color? : 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning',
  setFieldValue: (id: string, value: string) => void
}

function groupHandleChange(id: string, setFieldValue: (id: string, value: string) => void) {
  return (event: React.ChangeEvent, value: string) => setFieldValue(id, value)
}

export function ArmtRadioField(props: ArmtRadioFieldProps) {
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