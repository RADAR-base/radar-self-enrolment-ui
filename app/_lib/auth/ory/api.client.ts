import { FrontendApiCreateBrowserLoginFlowRequest } from "@ory/client";

const BASEURL = process.env.NEXT_PUBLIC_ORY_SDK_URL;


export const createLoginFlow = async (params: {login_challenge?: string, refresh?: boolean} | undefined): Promise<Response> => {
  let url = new URL("self-service/login/browser", BASEURL)
  if (params?.login_challenge) {
    url.searchParams.set('login_challenge', params.login_challenge)
  }
  if (params?.refresh) {
    url.searchParams.set('refresh', params.refresh.toString())
  }

  return await fetch(url, {
    headers: { 'accept': 'application/json' },
    credentials: 'include',
  })
}

export const submitLoginFlow = async (flowId: string, data: any): Promise<Response> => {
  var url = new URL("self-service/login", BASEURL)
  var params = new URLSearchParams([["flow", flowId]])
  url.search = params.toString();
  return await fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  })
}

export const getLoginFlow = async (flowId: string): Promise<Response> => {
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
    },
    credentials: 'include',
  })
}


export const createLogoutFlow = async (): Promise<Response> => {
  var url = new URL('self-service/logout/browser', BASEURL)
  return await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
    credentials: 'include',
  })
}


export const updateLogoutFlow = async (logout_token: string): Promise<Response> => {
  var url = new URL('self-service/logout', BASEURL)
  var params = new URLSearchParams([
    ['token', logout_token]
  ])
  url.search = params.toString()
  return await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
    credentials: 'include',
  })
}

export const createRegistrationFlow = async (): Promise<Response> => {
  var url = new URL('self-service/registration/browser', BASEURL)
  return await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
    credentials: 'include',
  })
}

export const updateRegistrationFlow = async (flowId: string, data: any): Promise<Response> => {
  var url = new URL("self-service/registration", BASEURL)
  var params = new URLSearchParams([["flow", flowId]])
  url.search = params.toString();
  return await fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  })
}

export const whoAmI = async (): Promise<Response> => {
  const url = new URL("sessions/whoami", BASEURL)
  return await fetch(url,
    {
      headers: { 'accept': 'application/json' },
      credentials: 'include'
    })
}

export default {
  createLoginFlow,
  submitLoginFlow,
  getLoginFlow,
  createLogoutFlow,
  updateLogoutFlow,
  createRegistrationFlow,
  updateRegistrationFlow,
  whoAmI
}