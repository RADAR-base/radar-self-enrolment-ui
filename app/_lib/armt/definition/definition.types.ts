import Yup from "../validation/yup"
import { IYesNoItem, ITextItem, IRadioItem, IDescriptiveItem } from "./field.interfaces"

export type ArmtItemContent = IYesNoItem | ITextItem | IRadioItem | IDescriptiveItem

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