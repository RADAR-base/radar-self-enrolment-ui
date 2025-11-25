interface IItem { 
  fieldType: string,
  id: string,
  title?: string,
  label?: string,
  description?: string,
  errorText?: string,
  disabled?: boolean
}

export interface IDateItem extends IItem {
  fieldType: "date",
  views?: ("year" | "month" | "day")[],
  minDate?: Date | string,
  maxDate?: Date | string
}

export interface IYesNoItem extends IItem {
  fieldType: "yesno",
}

export interface ITextItem extends IItem {
  fieldType: "text",
  type?: string
  multiline?: boolean
}

export interface ISignatureItem extends IItem {
  fieldType: "signature",
}

export interface IRadioChoice {
  code: string,
  label: string
}

export interface IRadioItem extends IItem {
  fieldType: "radio",
  choices: IRadioChoice[]
}

export interface ISliderItem extends IItem {
  fieldType: "slider",
  marks?: {value: number, label: string}[]
  min?: number
  max?: number
  step?: number
}

export interface IDropdownItem extends IItem {
  fieldType: "dropdown",
  choices: IRadioChoice[]
}

export interface IDescriptiveItem extends IItem {
  fieldType: "descriptive",
  content: string
}