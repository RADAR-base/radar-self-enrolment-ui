import { Box, FormControl, Typography } from "@mui/material";
import { ChangeEvent, ForwardedRef } from "react";
import { IDateItem } from "@/app/_lib/armt/definition/field.interfaces";
import { DateField, DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


interface ArmtDateFieldProps extends IDateItem {
  setFieldValue: (id: string, value: Date) => void
  value?: Date,
  disabled?: boolean,
  key?: string,
  color? : 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning'
}

function handleChange(setFieldValue: (id: string, value: string) => void) {
  return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFieldValue(event.target.id, event.target.value)
}

export function ArmtDateField({label, description, errorText, ...props}: ArmtDateFieldProps, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"}>
        <Typography variant="h4" component={'span'}>{label}</Typography>
        <Typography variant="body1" component={'span'} >{description}</Typography>
        <DatePicker 
          sx={{
            maxWidth: '16em'
          }}
          key={props.key}
          value={props.value ? dayjs(props.value) : null}
          disabled={props.disabled}
          openTo="year"
          views={['year','month','day']}
          format='DD/MM/YYYY' 
          onChange={(value, context) => {
            if (value) {
              try {
              props.setFieldValue(props.id, value.toDate())
              } catch {
              }
            }
          }}
          
        />
        <Typography variant="overline" component={'span'} color="error">{errorText}</Typography>
      </Box>
    </LocalizationProvider>

  )
}