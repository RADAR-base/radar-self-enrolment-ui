import { ArmtDefinition, ArmtItem } from "@/app/_lib/armt/definition/definition.types";
import { Box, Typography } from "@mui/material";
import React from "react";
import { ArmtDescriptiveField } from "../fields/descriptive";
import { ArmtRadioField } from "../fields/radio";
import { ArmtTextField } from "../fields/text";
import { YesNoField } from "../fields/yesno";

interface ArmtFieldProps {
  item: ArmtItem
  value: any
  setFieldValue: (id: string, value: any) => void
}

export function ArmtField({ item, value, setFieldValue }: ArmtFieldProps): React.ReactNode {
  switch(item.content.fieldType) {
    case "descriptive": {
      return <ArmtDescriptiveField {...item.content} />
    }
    case "radio": {
      return <ArmtRadioField  {...item.content} value={value} setFieldValue={setFieldValue} />
    }
    case "text": {
      return <ArmtTextField {...item.content} />
    }
    case "yesno": {
      return <YesNoField {...item.content} />
    }
  }
}

interface ArmtFormProps {
  definition: ArmtDefinition
  values: any
  setFieldValue: (id: string, value: any) => void
}

export function ArmtForm({ definition, values, setFieldValue }: ArmtFormProps): React.ReactNode {
  return  (
    <Box display={"flex"} flexDirection={"column"} gap={4} textAlign={"left"}>
      {definition.items.map((item) => <ArmtField item={item} setFieldValue={setFieldValue} value={values[item.content.id]} key={item.content.id}/>)}
    </Box>
  )
}