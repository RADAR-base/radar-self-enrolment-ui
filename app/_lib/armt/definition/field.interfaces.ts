interface IItem { 
  fieldType: string,
  id: string,
  title?: string,
  label?: string,
  description?: string,
  errorText?: string,
}

export interface IDateItem extends IItem {
  fieldType: "date",
}

export interface IYesNoItem extends IItem {
  fieldType: "yesno",
}

export interface ITextItem extends IItem {
  fieldType: "text",
  type?: string
  multiline?: boolean
}

export interface ITextItem extends IItem {
  fieldType: "text",
  type?: string
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

export interface IDropdownItem extends IItem {
  fieldType: "dropdown",
  choices: IRadioChoice[]
}

export interface IDescriptiveItem extends IItem {
  fieldType: "descriptive",
  content: string
}