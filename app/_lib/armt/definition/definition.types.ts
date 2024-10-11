import Yup from "../validation/yup"
import { IYesNoItem, ITextItem, IRadioItem, IDescriptiveItem, IDateItem } from "./field.interfaces"

export type ArmtItemContent = IYesNoItem | ITextItem | IRadioItem | IDescriptiveItem | IDateItem

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