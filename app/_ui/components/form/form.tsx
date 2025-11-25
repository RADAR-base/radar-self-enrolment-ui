"use client"
import { ArmtDefinition, ArmtItem } from "@/app/_lib/armt/definition/definition.types";
import { Box, Typography } from "@mui/material";
import React from "react";
import { ArmtDescriptiveField } from "../fields/descriptive";
import { ArmtRadioField } from "../fields/radio";
import { ArmtTextField } from "../fields/text";
import { YesNoField } from "../fields/yesno";
import { ArmtDateField } from "../fields/date";
import { ArmtDropdownField } from "../fields/dropdown";
import { ArmtSliderField } from "../fields/slider";
import { parseAndEvalLogic } from "@/app/_lib/parsers/evaluation-parser";

interface ArmtFieldProps {
  item: ArmtItem
  value: any
  setFieldValue: (id: string, value: any) => void
  errorText?: string
  showItem?: boolean,
  disabled?: boolean
}

export function ArmtField({ item, value, setFieldValue, errorText, showItem, disabled }: ArmtFieldProps): React.ReactNode {
  if (showItem == false) {
    return <></>
  }
  switch(item.content.fieldType) {
    case "descriptive": {
      return <ArmtDescriptiveField {...item.content} />
    }
    case "radio": {
      return <ArmtRadioField {...item.content} value={value} setFieldValue={setFieldValue} errorText={errorText} disabled={disabled} />
    }
    case "text": {
      return <ArmtTextField {...item.content} value={value} setFieldValue={setFieldValue} errorText={errorText} disabled={disabled} />
    }
    case "yesno": {
      return <YesNoField {...item.content} value={value}  setFieldValue={setFieldValue} disabled={disabled} />
    }
    case "date": {
      return <ArmtDateField {...item.content} value={value} setFieldValue={setFieldValue}  errorText={errorText} disabled={disabled}  />
    }
    case "dropdown": {
      return <ArmtDropdownField {...item.content} value={value} setFieldValue={setFieldValue} errorText={errorText} disabled={disabled} />
    }
    case "slider": {
      return <ArmtSliderField {...item.content} value={value} setFieldValue={setFieldValue} errorText={errorText} disabled={disabled} />
    }
  }
}

interface ArmtFormProps {
  title?: string
  definition: ArmtDefinition
  values:  {[key: string]: any}
  errors?: {[key: string]: any}
  setFieldValue: (id: string, value: any) => void
  disabled?: boolean
}

export function ArmtForm({ title, definition, values, setFieldValue, errors, disabled}: ArmtFormProps): React.ReactNode {
  return  (
    <Box display={"flex"} flexDirection={"column"} gap={4} textAlign={"left"}>
      {title ? <Typography variant="h2">{title}</Typography> : null}
      {definition.items.map(
        (item) => {
          let errorText = errors ? errors[item.content.id] : undefined
          let showItem: boolean = true;
          if (item.branchingLogic) {
            showItem = parseAndEvalLogic(item.branchingLogic, values)
          }
          return (<ArmtField item={item} 
                              setFieldValue={setFieldValue}
                              value={values[item.content.id]}
                              key={item.content.id}
                              errorText={errorText} 
                              showItem={showItem}
                              disabled={disabled}
                              />)
        })
      }
    </Box>
  )
}