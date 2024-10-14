import { Box, Fade, Collapse, Zoom, Stack, Typography } from "@mui/material";
import React from "react";
import { CSSTransition } from 'react-transition-group';

import { getYesNoOnChangeHandler, YesNoField } from "../components/fields/yesno";
import { ITextItem, IYesNoItem } from "../../_lib/armt/definition/field.interfaces";
import { MarkdownContainer } from "../components/base/markdown";



type EligabilityItem = IYesNoItem | ITextItem

interface EnrolmentEligabilityProps {

  title?: string
  description?: string
  items: EligabilityItem[]
  setFieldValue: (id: string, value: boolean) => void
  values: {[key: string]: boolean | undefined}
  errors: {[key: string]: string | undefined}
}

export function EnrolmentEligability(props: EnrolmentEligabilityProps) {
  const title = props.title ? props.title : 'Eligability'
  const description = props.description
  const onChange = (event: any, value: boolean) => {
    return getYesNoOnChangeHandler(props.setFieldValue)(event, value)
  }
  var items = [
    <YesNoField
      label={props.items[0].label}
      description={props.items[0].description}
      value={props.values[props.items[0].id]}
      onChange={onChange}
      id={'eligability.' + props.items[0].id}
      helperText={(props.values[props.items[0].id] != null) ? props.errors[props.items[0].id] : ""}
      key={'eligability.' + props.items[0].id}
    />
  ];
  for (let i = 1; i < props.items.length; i++) {
      items.push(
        <Collapse key={'eligability.' + props.items[i].id + '.collapse'} in={(props.values[props.items[i-1].id] != null)} unmountOnExit>
          <Box>
            <YesNoField 
              label={props.items[i].label}
              description={props.items[i].description}
              value={props.values[props.items[i].id]}
              onChange={onChange}
              id={'eligability.' + props.items[i].id}
              helperText={(props.values[props.items[i].id] != null) ? props.errors[props.items[i].id] : ""}
              key={'eligability.' + props.items[i].id}/>
              </Box>
          </Collapse>
      )
  }
  return (
    <Stack spacing={4} alignItems="inherit" textAlign={"left"}>
      <Typography variant="h2" align="left">{title}</Typography>
      {description && <MarkdownContainer>{description}</MarkdownContainer>}
      <Box display={"flex"} flexDirection={"column"} gap={2}>
        {items}
      </Box>
    </Stack>
)}