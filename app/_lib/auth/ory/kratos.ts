"use server"
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { IOrySettingsFlow } from './flows.interface';
import { setCookies } from '../cookies';

const BASEURL = process.env.KRATOS_INTERNAL_URL;

export async function createLoginFlow(params?: { login_challenge?: string, refresh?: boolean }): Promise<NextResponse> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  let url = new URL(BASEURL + "/self-service/login/browser")
  if (params?.login_challenge) {
    let urlParams = new URLSearchParams([['login_challenge', params.login_challenge]])
    url.search = urlParams.toString()
  }
  const res = await fetch(url, {
    headers: {
      'accept': 'application/json',
      Cookie: cookieString,
    },
    cache: 'no-store'
  }) as NextResponse
  await setCookies(res)
  return res
}

export async function submitLoginFlow(email: string, password: string, csrf_token: string, flow_id: string): Promise<NextResponse> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + "/self-service/login")
  var params = new URLSearchParams([["flow", flow_id]])
  url.search = params.toString();
  const res = await fetch(url, {
    cache: 'no-cache',
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Cookie': cookieString,
    },
    body: JSON.stringify({
      method: 'password',
      identifier: email,
      password: password,
      csrf_token: csrf_token,
    }),
  }) as NextResponse
  await setCookies(res)
  return res
}

export async function getLoginFlow(flowId: string): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/login/flows')
  var params = new URLSearchParams([
    ['flow', flowId]
  ])
  url.search = params.toString()
  return await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
  })
}

export async function createLogoutFlow(): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/logout/browser')
  return await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      Cookie: cookieString,
    },
  })
}

export async function updateLogoutFlow(logout_token: string): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/logout')
  var params = new URLSearchParams([
    ['token', logout_token]
  ])
  url.search = params.toString()
  return await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      Cookie: cookieString,
    },
  })
}

export async function createRegistrationFlow(): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/registration/browser')
  return await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      Cookie: cookieString,
    },
  })
}

export async function getRegistrationFlow(flowId: string): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/registration/flows')
  var params = new URLSearchParams([
    ['flow', flowId]
  ])
  url.search = params.toString()
  return await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
  })
}

export interface IUpdateRegistrationFlowBodyPassword {
  csrf_token: string,
  method: string,
  password: string,
  traits: any,
  transient_payload?: any
}

export async function updateRegistrationFlow(flowId: string, data: IUpdateRegistrationFlowBodyPassword): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + "/self-service/registration")
  var params = new URLSearchParams([["flow", flowId]])
  url.search = params.toString();
  return await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
    body: JSON.stringify(data)
  })
}

export async function createRecoveryFlow(return_to?: string): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/recovery/browser')
  return await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      Cookie: cookieString,
    },
  })
}

export async function getRecoveryFlow(flowId: string): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/recovery/flows')
  var params = new URLSearchParams([
    ['id', flowId]
  ])
  url.search = params.toString()
  return await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
  })
}

export interface IUpdateRecoveryFlowBodyCode {
  csrf_token: string,
  code: string,
  method: string,
  transient_payload?: any
}

export interface IUpdateRecoveryFlowBodyEmail {
  csrf_token: string,
  email: string,
  method: string,
  transient_payload?: any
}

export async function updateRecoveryFlow(flowId: string, data: IUpdateRecoveryFlowBodyCode | IUpdateRecoveryFlowBodyEmail, token?: string): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + "/self-service/recovery")
  var params = new URLSearchParams([
    ["flow", flowId],
  ])
  if (token) { params.append("token", token) }
  url.search = params.toString();
  return await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
    body: JSON.stringify(data)
  })
}


export async function getVerificationFlow(flowId: string): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/verification/flows')
  var params = new URLSearchParams([
    ['id', flowId]
  ])
  url.search = params.toString()
  return await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
  })
}

export async function createVerificationFlow(return_to?: string): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/verification/browser')
  return await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      Cookie: cookieString,
    },
  })
}

export async function completeVerificationFlow(flowId: string, data: IUpdateRecoveryFlowBodyCode | IUpdateRecoveryFlowBodyEmail, token?: string): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + "/self-service/verification")
  var params = new URLSearchParams([
    ["flow", flowId],
  ])
  if (token) { params.append("token", token) }
  url.search = params.toString();
  return await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
    body: JSON.stringify(data)
  })
}


export async function getSettingsFlow(flowId: string): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/settings/flows')
  var params = new URLSearchParams([
    ['id', flowId]
  ])
  url.search = params.toString()
  return await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
  })
}

export async function createSettingsFlow(return_to?: string): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/settings/browser')
  return await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      Cookie: cookieString,
    },
  })
}

export interface IUpdateSettingsPassword {
  csrf_token: string,
  password: string,
  transient_payload?: any
}

export async function completeSettingsFlow(flowId: string, data: IUpdateSettingsPassword): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + "/self-service/settings")
  var params = new URLSearchParams([
    ["flow", flowId],
  ])
  url.search = params.toString();
  const body = {
    password: data.password,
    method: "password",
    csrf_token: data.csrf_token,
    transient_payload: data.transient_payload
    
  }
  return await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
    body: JSON.stringify(body)
  })
}

export async function whoAmI(): Promise<Response> {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  const url = new URL(BASEURL + "/sessions/whoami")
  const res = await fetch(url,
    {
      cache: 'no-store',
      headers: {
        'accept': 'application/json',
        Cookie: cookieString,
      },
    })
  await setCookies(res)
  return res
}