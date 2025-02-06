"use server"
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';

const BASEURL = process.env.KRATOS_INTERNAL_URL;

function parseSetCookie(c: string): [string, string, { [key: string]: string | boolean }] {
  var split = c.split(';')
  var namevalue = split[0].split('=')
  var opts = Object.fromEntries(split.slice(1).map(
    (opt) => {
      var kv = opt.split('=')
      var k = kv[0].trim()
      var k = k.charAt(0).toLowerCase() + k.slice(1).replaceAll('-', '')
      return [k, kv[1] ? kv[1] : true]
    }
  ))
  return [namevalue[0], namevalue[1], opts]
}

function setCookies(res: Response) {
  res.headers.getSetCookie().map(
    (c) => {
      var [name, value, opts] = parseSetCookie(c)
      cookies().set(name, value, opts)
    }
  )
}

export async function createLoginFlow(params?: { login_challenge?: string, refresh?: boolean }): Promise<NextResponse> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
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
  }) as NextResponse
  setCookies(res)
  return res
}

export async function submitLoginFlow(email: string, password: string, csrf_token: string, flow_id: string): Promise<NextResponse> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
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
    })
  }) as NextResponse
  setCookies(res)
  return res
}

export async function getLoginFlow(flowId: string): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/login/flows')
  var params = new URLSearchParams([
    ['flow', flowId]
  ])
  url.search = params.toString()
  return await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
  })
}

export async function createLogoutFlow(): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/logout/browser')
  return await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      Cookie: cookieString,
    },
  })
}

export async function updateLogoutFlow(logout_token: string): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/logout')
  var params = new URLSearchParams([
    ['token', logout_token]
  ])
  url.search = params.toString()
  return await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      Cookie: cookieString,
    },
  })
}

export async function createRegistrationFlow(): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/registration/browser')
  return await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      Cookie: cookieString,
    },
  })
}

export async function getRegistrationFlow(flowId: string): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/registration/flows')
  var params = new URLSearchParams([
    ['flow', flowId]
  ])
  url.search = params.toString()
  return await fetch(url, {
    method: 'GET',
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
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + "/self-service/registration")
  var params = new URLSearchParams([["flow", flowId]])
  url.search = params.toString();
  return await fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
    body: JSON.stringify(data)
  })
}

export async function createRecoveryFlow(return_to?: string): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
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
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/recovery/flows')
  var params = new URLSearchParams([
    ['id', flowId]
  ])
  url.search = params.toString()
  return await fetch(url, {
    method: 'GET',
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
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + "/self-service/recovery")
  var params = new URLSearchParams([
    ["flow", flowId],
  ])
  if (token) { params.append("token", token) }
  url.search = params.toString();
  return await fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
    body: JSON.stringify(data)
  })
}


export async function getVerificationFlow(flowId: string): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/verification/flows')
  var params = new URLSearchParams([
    ['id', flowId]
  ])
  url.search = params.toString()
  return await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
  })
}

export async function createVerificationFlow(return_to?: string): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + '/self-service/verification/browser')
  return await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      Cookie: cookieString,
    },
  })
}

export async function completeVerificationFlow(flowId: string, data: IUpdateRecoveryFlowBodyCode | IUpdateRecoveryFlowBodyEmail, token?: string): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL(BASEURL + "/self-service/verification")
  var params = new URLSearchParams([
    ["flow", flowId],
  ])
  if (token) { params.append("token", token) }
  url.search = params.toString();
  return await fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
    body: JSON.stringify(data)
  })
}

export async function whoAmI(): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  const url = new URL(BASEURL + "/sessions/whoami")
  const res = await fetch(url,
    {
      headers: {
        'accept': 'application/json',
        Cookie: cookieString,
      },
    })
  setCookies(res)
  return res
}