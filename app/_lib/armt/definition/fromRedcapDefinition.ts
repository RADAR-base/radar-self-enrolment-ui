"use client"
import Yup from "../validation/yup";
import { ArmtDefinition, ArmtItem, ArmtItemContent } from "./definition.types";
import { RadarRedcapDefinition, RadarRedcapFieldDefinition } from "./redcap.types";


function FieldFromRedcap(field: RadarRedcapFieldDefinition): ArmtItem {
  let content: ArmtItemContent
  let validation: Yup.Schema | undefined
  content = {
    fieldType: "descriptive",
    id: field.field_name,
    label: "Error: Unknown field type",
    content: field.field_label
  }
  if (field.field_type == "radio") {
      content = {
        fieldType: "radio",
        id: field.field_name,
        label: field.field_label,
        title: field.section_header,
        choices: field.select_choices_or_calculations,
      }
      validation = Yup.string().oneOf(field.select_choices_or_calculations.map((choice) => choice.code))
  }
  if (field.field_type == "descriptive") {
      content = {
        fieldType: "descriptive",
        id: field.field_name,
        label: undefined,
        content: field.field_label,
      }
    }
    if (field.field_type == "yesno") {
      content = {
        fieldType: "yesno",
        id: field.field_name,
        label: field.field_label,
      }
      validation = Yup.boolean()
    }
    if (field.field_type == "text") {
      content = {
        fieldType: "text",
        id: field.field_name,
        label: field.field_label,
      }
      validation = Yup.string()
    }
  
  if (field.required_field) {
    validation = validation?.required()
  }
  return {
    content: content,
    validation: validation,
    branchingLogic: undefined
  }
}



export default function fromRedcapDefinition(redcap: RadarRedcapDefinition): ArmtDefinition {
  const first = redcap.at(0)
  const definition: ArmtDefinition = {
    name: first ? first.form_name : "",
    id: first ? first.form_name : "",
    items: redcap.map((field) => FieldFromRedcap(field))
  } 

  return definition
}