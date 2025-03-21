// "use client"
import Yup from "../validation/yup";
import dayjs, { Dayjs } from 'dayjs';
import { ArmtDefinition, ArmtItem, ArmtItemContent } from "./definition.types";
import { RadarRedcapDefinition, RadarRedcapFieldDefinition } from "./redcap.types";

function getTextSchema(field: RadarRedcapFieldDefinition) {
  switch (field.text_validation_type_or_show_slider_number) {
    case "datetime_dmy": {
      let validation = Yup.date().typeError("")
      if (field.text_validation_min) {
        let minDate = dayjs(field.text_validation_min).toDate()
        validation = validation.min(minDate, "This date must be later than " + field.text_validation_min)
      }
      if (field.text_validation_max) {
        let maxDate = dayjs(field.text_validation_max).toDate()
        validation = validation.max(maxDate, "This date must be before " + field.text_validation_max)
      }
      return validation
    }
    case "postcode": {
      let validation = Yup.string().uppercase().ukPostcode("The postcode you entered does not appear to be valid.")
      return validation
    }
    case "nhs_number": {
      let validation = Yup.string().nhsNumber("The number you entered is not a valid NHS number.")
      return validation
    }
    case "email": {
      let validation = Yup.string().email("The email address you entered is not valid")
      return validation
    }
    default: {      
        return Yup.string()
    }
  }
}

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
        description: field.field_note,
        choices: field.select_choices_or_calculations,
      }
      validation = Yup.string().oneOf(field.select_choices_or_calculations.map((choice) => choice.code))
  }
  if (field.field_type == "slider") {
    content = {
      fieldType: "slider",
      id: field.field_name,
      label: field.field_label,
      title: field.section_header,
      description: field.field_note,
      marks: field.select_choices_or_calculations.map((v) => {return {value: +v.code, label: v.label}}),
    }
    validation = Yup.number()
}
  if (field.field_type == "dropdown") {
    content = {
      fieldType: "dropdown",
      id: field.field_name,
      label: field.field_label,
      title: field.section_header,
      description: field.field_note,
      choices: field.select_choices_or_calculations,
    }
    validation = Yup.string().oneOf(field.select_choices_or_calculations.map((choice) => choice.code))
  }
  if (field.field_type == "descriptive") {
      content = {
        fieldType: "descriptive",
        id: field.field_name,
        title: field.section_header,
        description: field.field_note,
        content: field.field_label,
      }
    }
    if (field.field_type == "yesno") {
      content = {
        fieldType: "yesno",
        id: field.field_name,
        title: field.section_header,
        description: field.field_note,
        label: field.field_label,
      }
      validation = Yup.boolean()
    }
    if (field.field_type == "text") {
      if (field.text_validation_type_or_show_slider_number == "datetime_dmy") {
        content = {
          fieldType: 'date',
          id: field.field_name,
          title: field.section_header,
          description: field.field_note,
          label: field.field_label,
          views: (field.select_choices_or_calculations ? field.select_choices_or_calculations.map((e) => e.code) : ['year', 'month', 'day']) as ('year' | 'month' | 'day')[]
        }
        validation = getTextSchema(field)
      } else {
        content = {
          fieldType: "text",
          id: field.field_name,
          title: field.section_header,
          description: field.field_note,
          label: field.field_label,
          type: field.text_validation_type_or_show_slider_number,
        }
      validation = getTextSchema(field)
      }
    }
    if (field.field_type == "notes") {
        content = {
          fieldType: "text",
          multiline: true,
          id: field.field_name,
          title: field.section_header,
          description: field.field_note,
          label: field.field_label,
          type: field.text_validation_type_or_show_slider_number,
        }
      validation = getTextSchema(field)
    }
  if (field.required_field) {
    validation = validation?.required("")
  }
  return {
    content: content,
    validation: validation,
    branchingLogic: field.evaluated_logic
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