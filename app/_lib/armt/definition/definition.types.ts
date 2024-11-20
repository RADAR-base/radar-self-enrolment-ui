import Yup from "../validation/yup"
import { IYesNoItem, ITextItem, IRadioItem, IDescriptiveItem, IDateItem, IDropdownItem } from "./field.interfaces"

export type ArmtItemContent = IYesNoItem | ITextItem | IRadioItem | IDescriptiveItem | IDateItem | IDropdownItem

export type ArmtItem = {
  content: ArmtItemContent
  validation: Yup.Schema | undefined
  branchingLogic: any
}

export type ArmtDefinition = {
  name: string
  id: string
  items: ArmtItem[]
}