import { Box, Typography } from "@mui/material";
import { ForwardedRef } from "react";
import { ISliderItem } from "@/app/_lib/armt/definition/field.interfaces";
import Slider from '@mui/material/Slider';

interface ArmtSliderFieldProps extends ISliderItem {
  disabled?: boolean,
  key?: string,
  value?: number | number[]
  color? : 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning',
  setFieldValue: (id: string, value: number | number[]) => void
}


export function ArmtSliderField(props: ArmtSliderFieldProps, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <Box display={"flex"} flexDirection={"column"} textAlign={"left"} gap={1} key={props.key}>
      <Typography variant="h2">{props.title}</Typography>
      <Typography variant="h4" component={'span'}>{props.label}</Typography>
      <Slider 
        sx={{
          width: "80%",
          alignSelf: 'center'
        }}
        aria-label={"Slider for the " + props.id + " question"}
        defaultValue={0}
        slotProps={{
  
        }}
        step={1}
        marks={[
          {
            value: 0,
            label: '0',
          },
          {
            value: 1,
            label: '1',
          },
          {
            value: 2,
            label: '2',
          },
          {
            value: 3,
            label: '3',
          },
          {
            value: 4,
            label: '4',
          },
          {
            value: 5,
            label: '5',
          },
          {
            value: 6,
            label: '6',
          },
          {
            value: 7,
            label: '7',
          },
          {
            value: 8,
            label: '8',
          },
          {
            value: 9,
            label: '9',
          },
          {
            value: 10,
            label: '10',
          },
        ]}
        min={0}
        max={10}
        value={props.value ?? 0}
        onChange={(e, value) => props.setFieldValue(props.id, value)}
      />
  </Box>
  )
}