"use client"
import { ArmtDefinition, ArmtItem } from "@/app/_lib/armt/definition/definition.types";
import { Box, Typography } from "@mui/material";
import React from "react";
import { ArmtDescriptiveField } from "../fields/descriptive";
import { ArmtRadioField } from "../fields/radio";
import { ArmtTextField } from "../fields/text";
import { YesNoField } from "../fields/yesno";
import { ArmtDateField } from "../fields/date";

interface ArmtFieldProps {
  item: ArmtItem
  value: any
  setFieldValue: (id: string, value: any) => void
  errorText?: string
}

export function ArmtField({ item, value, setFieldValue, errorText }: ArmtFieldProps): React.ReactNode {
  switch(item.content.fieldType) {
    case "descriptive": {
      return <ArmtDescriptiveField {...item.content} />
    }
    case "radio": {
      return <ArmtRadioField  {...item.content} value={value} setFieldValue={setFieldValue} errorText={errorText} />
    }
    case "text": {
      return <ArmtTextField {...item.content} value={value} setFieldValue={setFieldValue}  errorText={errorText} />
    }
    case "yesno": {
      return <YesNoField {...item.content} value={value} />
    }
    case "date": {
      return <ArmtDateField {...item.content} value={value} setFieldValue={setFieldValue}  errorText={errorText} />
    }
  }
}

interface ArmtFormProps {
  title?: string
  definition: ArmtDefinition
  values:  {[key: string]: any}
  errors?: {[key: string]: string}
  setFieldValue: (id: string, value: any) => void
}

export function ArmtForm({ title, definition, values, setFieldValue, errors }: ArmtFormProps): React.ReactNode {
  return  (
    <Box display={"flex"} flexDirection={"column"} gap={4} textAlign={"left"}>
      {title ? <Typography variant="h2">{title}</Typography> : null}
      {definition.items.map(
        (item) => {
          let errorText = errors ? errors[item.content.id] : undefined
          return (<ArmtField item={item} 
                              setFieldValue={setFieldValue}
                              value={values[item.content.id]}
                              key={item.content.id}
                              errorText={errorText} />)
        })
      }
    </Box>
  )
}