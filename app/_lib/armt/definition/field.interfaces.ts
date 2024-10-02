export interface IYesNoItem {
  fieldType: "yesno",
  id: string,
  title?: string,
  label?: string,
  description?: string,
  errorText?: string
}

export interface ITextItem {
  fieldType: "text",
  id: string,
  title?: string,
  label?: string,
  description?: string,
  errorText?: string
}

export interface IRadioChoice {
  code: string,
  label: string
}

export interface IRadioItem {
  fieldType: "radio",
  id: string,
  title?: string,
  label?: string,
  description?: string,
  errorText?: string,
  choices: IRadioChoice[]
}

export interface IDescriptiveItem {
  fieldType: "descriptive",
  id: string,
  label?: string,
  content: string
}