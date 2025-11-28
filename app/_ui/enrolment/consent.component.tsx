"use client"
import { Box, Divider, TextField, Typography } from "@mui/material";
import { YesNoField } from "@/app/_ui/components/fields/yesno";
import React, { useEffect, useState } from "react";
import { IYesNoItem } from "../../_lib/armt/definition/field.interfaces";
import { MarkdownContainer } from "../components/base/markdown";
import { ArmtSignatureField } from "../components/fields/signature";
import { ArmtTextField } from "../components/fields/text";

type ConsentItem = IYesNoItem

interface EnrolmentConsentProps {
  title?: string
  description?: string,
  signatureDescription?: string
  requiredItems: ConsentItem[]
  optionalItems?: ConsentItem[]
  setFieldValue: (id: string, value: any) => void
  values: {[key: string]: any}
  errors: {[key: string]: any | undefined}
}

export function EnrolmentConsent(props: EnrolmentConsentProps) {
  const title = props.title ? props.title : 'Consent'
  const description = props.description

  var requiredItems: React.ReactElement<any>[] = [];
  for (let i = 0; i < props.requiredItems.length; i++) {
    requiredItems.push(<Divider key={"divider." + i} />)
    requiredItems.push(
      <YesNoField label={props.requiredItems[i].label}
        description={props.requiredItems[i].description}
        value={props.values[props.requiredItems[i].id]}
        setFieldValue={props.setFieldValue}
        id={'consent.' + props.requiredItems[i].id}
        errorText={(props.values[props.requiredItems[i].id] != null) ? props.errors[props.requiredItems[i].id] : ""}
        key={'consent.' + props.requiredItems[i].id}
      />
    )
  }
  var optionalItems: React.ReactElement<any>[] = [];
  if (props.optionalItems) {
    for (let i = 0; i < props.optionalItems.length; i++) {
      optionalItems.push(<Divider key={"divider." + i} />)
      optionalItems.push(
        <YesNoField label={props.optionalItems[i].label}
          description={props.optionalItems[i].description}
          value={props.values[props.optionalItems[i].id]}
          setFieldValue={props.setFieldValue}
          id={'consent.' + props.optionalItems[i].id}
          errorText={(props.values[props.optionalItems[i].id] != null) ? props.errors[props.optionalItems[i].id] : ""}
          key={'consent.' + props.optionalItems[i].id}
        />
      )
    }
  }
  return (
    <Box gap={4} flexDirection={'column'} display={'flex'} alignItems="inherit" textAlign={"left"} className="consentContent">
      <Typography variant="h2" align="left">{title}</Typography>
      {description && <MarkdownContainer>{description}</MarkdownContainer>}
      {(props.optionalItems) && <Typography variant="h3" align="left">Required Items</Typography>}
      {requiredItems}
      {(props.optionalItems) && <Divider />}
      {(props.optionalItems) && <Typography variant="h3" align="left">Optional Items</Typography>}
      {(props.optionalItems) && <Typography variant="subtitle1" align="left">The following activities are optional, you may participate in the research without agreeing to the following:</Typography>}
      {props.optionalItems && optionalItems}
      <Divider />
      {<MarkdownContainer>{props.signatureDescription ?? "Sign here"}</MarkdownContainer>}
      <Box display={'flex'} flexWrap={'wrap'} flexDirection={'row'} width={'100%'} gap={2}>
        <Box minWidth={{xs: "100%", sm: 390}} flexGrow={1}>
          <ArmtTextField label={"First Name"} setFieldValue={props.setFieldValue} value={props.values['first_name']} id='consent.first_name' fieldType="text" />
        </Box>
        <Box minWidth={{xs: "100%", sm: 390}} flexGrow={1}>
          <ArmtTextField label={"Last Name"} setFieldValue={props.setFieldValue} value={props.values['last_name']} id='consent.last_name' fieldType="text"/>
        </Box>
        <TextField label={'Date'} value={props.values['date']} />
      </Box>
        <ArmtSignatureField setFieldValue={props.setFieldValue} fieldType="signature" id={"consent.signature"} value={props.values['signature']} />
    </Box>
)}