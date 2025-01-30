interface IOryUiNodeAttributes {
  disabled: boolean,
  name: string,
  node_type: string,
  required: boolean,
  type: string,
  value: string
}

interface IOryUiNode {
  attributes: IOryUiNodeAttributes,
  group: string,
  messages: IOryMessage[],
  meta: any
  
}

interface IOryUi {
  action: string,
  messages: IOryMessage[],
  method: string,
  nodes: IOryUiNode[]
}

interface IOryMessage {
  id: number,
  text: string,
  type: string,
  context?: any
}

interface IOryLoginFlow {
  created_at: Date,
  expires_at: Date,
  id: string,
  issued_at: Date,
  organization_id?: string,
  refresh: boolean,
  request_url: string,
  requested_aal: string,
  state: string,
  type: string,
  ui: IOryUi,
  updated_at: Date
}

interface IOryRegistrationFlow {
  expires_at: Date,
  id: string,
  issued_at: Date,
  organization_id?: string,
  request_url: string,
  state: string,
  ui: IOryUi,
  updated_at: Date
}