import { OryIdentity } from "./types"

export interface IOryUiNodeAttributes {
  disabled: boolean,
  name: string,
  node_type: string,
  required: boolean,
  type: string,
  value: string
}

export interface IOryUiNode {
  attributes: IOryUiNodeAttributes,
  group: string,
  messages: IOryMessage[],
  meta: any
  
}

export interface IOryUi {
  action: string,
  messages: IOryMessage[],
  method: string,
  nodes: IOryUiNode[]
}

export interface IOryMessage {
  id: number,
  text: string,
  type: string,
  context?: any
}

export interface IOryContinueWith {
  action: string,
  flow: {
    id: string,
    url: string,
    verifiable_address: string
  }[]
}

export interface IOryErrorFlow {
  error: {
    code: number,
    id: string,
    message: string,
    reason: string,
    request: string,
    status: string
  }
}

export interface IOryLoginFlow {
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

export interface IOryRegistrationFlow {
  expires_at: Date,
  id: string,
  issued_at: Date,
  organization_id?: string,
  request_url: string,
  state: string,
  ui: IOryUi,
  updated_at: Date
}

export interface IOryRecoveryFlow {
  active: string,
  continue_with: IOryContinueWith[],
  expires_at: Date,
  id: string,
  issued_at: Date,
  request_url: string,
  return_to: string,
  transient_payload: any
  type: string,
  ui: IOryUi
  state: string
}

export interface IOryVerificationFlow {
  active: string,
  expires_at: Date,
  id: string,
  issued_at: Date,
  request_url: string,
  return_to: string,
  transient_payload: any,
  type: string,
  ui: IOryUi
  state: string
}

export interface IOrySettingsFlow {
  active: string,
  continue_with: IOryContinueWith[],
  expires_at: Date,
  id: string,
  identity: OryIdentity,
  issued_at: Date,
  request_url: string,
  return_to: string,
  state: string,
  transient_payload: any,
  type: string,
  ui: IOryUi
}