"use client"
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { getYesNoOnChangeHandler, YesNoField } from "@/app/_ui/components/fields/yesno";
import React, { useEffect, useState } from "react";
import { IYesNoItem } from "../../_lib/armt/definition/field.interfaces";
import { MarkdownContainer } from "../components/base/markdown";
import SignaturePad from 'react-signature-pad-wrapper';
import { SigPad } from "../components/base/signature";
import { ArmtSignatureField } from "../components/fields/signature";

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

  const onChange = (event: any, value: boolean) => {
    return getYesNoOnChangeHandler(props.setFieldValue)(event, value)
  }
  var requiredItems: React.ReactElement[] = [];
  for (let i = 0; i < props.requiredItems.length; i++) {
    requiredItems.push(<Divider key={"divider." + i} />)
    requiredItems.push(
      <YesNoField label={props.requiredItems[i].label}
        description={props.requiredItems[i].description}
        value={props.values[props.requiredItems[i].id]}
        onChange={onChange}
        id={'consent.' + props.requiredItems[i].id}
        errorText={(props.values[props.requiredItems[i].id] != null) ? props.errors[props.requiredItems[i].id] : ""}
        key={'consent.' + props.requiredItems[i].id}
      />
    )
  }
  var optionalItems: React.ReactElement[] = [];
  if (props.optionalItems) {
    for (let i = 0; i < props.optionalItems.length; i++) {
      optionalItems.push(<Divider key={"divider." + i} />)
      optionalItems.push(
        <YesNoField label={props.optionalItems[i].label}
          description={props.optionalItems[i].description}
          value={props.values[props.optionalItems[i].id]}
          onChange={onChange}
          id={'consent.' + props.optionalItems[i].id}
          errorText={(props.values[props.optionalItems[i].id] != null) ? props.errors[props.optionalItems[i].id] : ""}
          key={'consent.' + props.optionalItems[i].id}
        />
      )
    }
  }
  return (
    <Stack spacing={4} alignItems="inherit" textAlign={"left"} className="consentContent">
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
      <ArmtSignatureField setFieldValue={props.setFieldValue} fieldType="signature" id={"consent.signature"} value={props.values['signature']} />
    </Stack>
)}