"use server"
import { delegateGet, delegatePost } from '../delegateApi'

// Login
export async function createLoginFlow(params?: { login_challenge?: string }) {
  return delegateGet('/ory/login/browser',
    params?.login_challenge
      ? new URLSearchParams([['login_challenge', params.login_challenge]])
      : undefined
  )
}

export async function submitLoginFlow(email: string, password: string, csrf_token: string, flow_id: string) {
  return delegatePost('/ory/login', {
    method: 'password',
    identifier: email,
    password,
    csrf_token,
  }, new URLSearchParams([['flow', flow_id]]))
}

export async function getLoginFlow(flowId: string) {
  return delegateGet('/ory/login/flows', new URLSearchParams([['flow', flowId]]))
}

// Registration
export async function createRegistrationFlow() {
  return delegateGet('/ory/registration/browser')
}

export async function getRegistrationFlow(flowId: string) {
  return delegateGet('/ory/registration/flows', new URLSearchParams([['flow', flowId]]))
}

export interface IUpdateRegistrationFlowBodyPassword {
  csrf_token: string
  method: string
  password: string
  traits: any
  transient_payload?: any
}

export async function updateRegistrationFlow(flowId: string, data: IUpdateRegistrationFlowBodyPassword) {
  return delegatePost('/ory/registration', data, new URLSearchParams([['flow', flowId]]))
}

// Recovery
export async function createRecoveryFlow() {
  return delegateGet('/ory/recovery/browser')
}

export async function getRecoveryFlow(flowId: string) {
  return delegateGet('/ory/recovery/flows', new URLSearchParams([['id', flowId]]))
}

export interface IUpdateRecoveryFlowBodyCode {
  csrf_token: string
  code: string
  method: string
  transient_payload?: any
}

export interface IUpdateRecoveryFlowBodyEmail {
  csrf_token: string
  email: string
  method: string
  transient_payload?: any
}

export async function updateRecoveryFlow(flowId: string, data: IUpdateRecoveryFlowBodyCode | IUpdateRecoveryFlowBodyEmail, token?: string) {
  const params = new URLSearchParams([['flow', flowId]])
  if (token) params.append('token', token)
  return delegatePost('/ory/recovery', data, params)
}

// Verification
export async function createVerificationFlow() {
  return delegateGet('/ory/verification/browser')
}

export async function getVerificationFlow(flowId: string) {
  return delegateGet('/ory/verification/flows', new URLSearchParams([['id', flowId]]))
}

export async function completeVerificationFlow(flowId: string, data: IUpdateRecoveryFlowBodyCode | IUpdateRecoveryFlowBodyEmail, token?: string) {
  const params = new URLSearchParams([['flow', flowId]])
  if (token) params.append('token', token)
  return delegatePost('/ory/verification', data, params)
}

// Settings
export async function createSettingsFlow() {
  return delegateGet('/ory/settings/browser')
}

export async function getSettingsFlow(flowId: string) {
  return delegateGet('/ory/settings/flows', new URLSearchParams([['id', flowId]]))
}

export interface IUpdateSettingsPassword {
  csrf_token: string
  password: string
  transient_payload?: any
}

export async function completeSettingsFlow(flowId: string, data: IUpdateSettingsPassword) {
  return delegatePost('/ory/settings', {
    password: data.password,
    method: 'password',
    csrf_token: data.csrf_token,
    transient_payload: data.transient_payload,
  }, new URLSearchParams([['flow', flowId]]))
}

// Logout
export async function createLogoutFlow() {
  return delegateGet('/ory/logout/browser')
}

export async function updateLogoutFlow(logout_token: string) {
  return delegateGet('/ory/logout', new URLSearchParams([['token', logout_token]]))
}

// Session
export async function whoAmI() {
  return delegateGet('/ory/whoAmI')
}
