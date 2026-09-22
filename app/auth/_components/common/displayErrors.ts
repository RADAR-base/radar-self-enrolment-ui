import { IOryLoginFlow, IOryRecoveryFlow, IOryRegistrationFlow } from "@/app/_lib/auth/ory/flows.interface"


type OryFlows = IOryRecoveryFlow | IOryLoginFlow | IOryRegistrationFlow | IOryRegistrationFlow

export interface FlowErrors {
  general?: string,
  fields: {[key: string]: string}
}

export function errorTextFromFlow(flow: OryFlows): FlowErrors {
  var errors = {
    general: undefined,
    fields: {}
  } as FlowErrors
  if (flow) {
    if (flow.ui.messages) {
      const msg = flow.ui.messages.find(msg => msg.type == 'error')
      errors.general = msg && msg.text
    }
    flow.ui.nodes.filter(node => node.messages.length > 0).forEach(
      (node) => {
        errors.fields[node.attributes.name] = node.messages[0].text
      }
    )
  }
  return errors
}