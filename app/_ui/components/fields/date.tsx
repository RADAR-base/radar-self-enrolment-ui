import { Box, Typography } from "@mui/material";
import { ForwardedRef } from "react";
import { IDateItem } from "@/app/_lib/armt/definition/field.interfaces";
import { DatePicker, DateView } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


function valueFormatFromView(view: DateView[]) {
  let formatArray: string[] = []
  if (view.includes("year")) {
    formatArray.push("YYYY")
  }
  if (view.includes("month")) {
    formatArray.push("MM")
  }
  if (view.includes("day")) {
    formatArray.push("DD")
  }
  return formatArray.join("-")
}

interface ArmtDateFieldProps extends IDateItem {
  setFieldValue: (id: string, value: string | Date) => void
  value?: string | Date,
  disabled?: boolean,
  key?: string,
  color? : 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning'
}

export function ArmtDateField({label, description, errorText, ...props}: ArmtDateFieldProps, ref: ForwardedRef<HTMLDivElement>) {
  const view = (props.views ?? ["year", "month", "day"]) as DateView[]
  const valueFormat = valueFormatFromView(view)
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"}>
        <Typography variant="h4" component={'span'}>{props.title}</Typography>
        <Typography variant="body1" component={'span'}>{description}</Typography>
        <DatePicker 
          sx={{
            maxWidth: '16em'
          }}
          key={props.key}
          value={props.value ? dayjs(props.value, valueFormat) : null}
          disabled={props.disabled}
          openTo="year"
          views={view}
          formatDensity='spacious'
          label={label}
          onChange={(value, context) => {
            if (value) {
              try {
              props.setFieldValue(props.id, value.format(valueFormat))
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