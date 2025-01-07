import { Box, Typography } from "@mui/material";
import { ForwardedRef } from "react";
import { IDateItem } from "@/app/_lib/armt/definition/field.interfaces";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


interface ArmtDateFieldProps extends IDateItem {
  setFieldValue: (id: string, value: Date) => void
  value?: Date,
  disabled?: boolean,
  key?: string,
  color? : 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning'
}

export function ArmtDateField({label, description, errorText, ...props}: ArmtDateFieldProps, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"}>
        <Typography variant="h4" component={'span'}>{props.title}</Typography>
        <Typography variant="body1" component={'span'}>{description}</Typography>
        <DatePicker 
          sx={{
            maxWidth: '16em'
          }}
          key={props.key}
          value={props.value ? dayjs(props.value) : null}
          disabled={props.disabled}
          openTo="year"
          views={['year','month', 'day']}
          format='DD/MM/YYYY'
          formatDensity='spacious'
          label={label}
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