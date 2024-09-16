"use server"
import { cookies } from 'next/headers'
import { OrySession } from './types';

const BASEURL = process.env.ORY_SDK_URL;

function parseSetCookie(c: string): [string, string, {[key: string]: string | boolean}] {
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

export async function createLoginFlow(): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  const url = new URL("self-service/login/browser", BASEURL)
  const res = await fetch(url, {
    headers: { 
      'accept': 'application/json',
      Cookie: cookieString,
    },
  })
  setCookies(res)
  return res
}


export async function submitLoginFlow(flowId: string, data: any): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL("self-service/login", BASEURL)
  var params = new URLSearchParams([["flow", flowId]])
  url.search = params.toString();
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookieString,
    },
    body: JSON.stringify(data)
  })
  setCookies(res)
  return res
}


export async function getLoginFlow(flowId: string): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL('self-service/login/flows', BASEURL)
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
  var url = new URL('self-service/logout/browser', BASEURL)
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
  var url = new URL('self-service/logout', BASEURL)
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
  var url = new URL('self-service/registration/browser', BASEURL)
  return await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      Cookie: cookieString,
    },
  })
}


export async function updateRegistrationFlow(flowId: string, data: any): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  var url = new URL("self-service/registration", BASEURL)
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


export async function whoAmI(): Promise<Response> {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  const url = new URL("sessions/whoami", BASEURL)
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