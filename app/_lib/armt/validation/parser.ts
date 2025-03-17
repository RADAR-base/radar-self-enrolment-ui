import { ArmtDefinition } from "../definition/definition.types";
import Yup from '@/app/_lib/armt/validation/yup'

export function schemaFromDefinition(definition: ArmtDefinition): Yup.Schema {
  const schema: {[key: string]: Yup.Schema} = {};
  for (let item of definition.items) {
    if (item.validation) {
      schema[item.content.id] = item.validation
    }
  }
  return Yup.object(schema)
}