import { AuthResponse, ClientAuthService } from '../service.interface';
import client from './api.client';
import { OrySession } from './types'
import { getCsrfToken } from './util';

export class OryAuthClientService extends ClientAuthService {
  private async getOrySession(refresh?: boolean): Promise<OrySession | null> {
    const resp = await client.whoAmI()
    var session: OrySession | null = null
    if (resp.ok) {
      try {
      session = new OrySession(await resp.json())
      console.log(session)
      } catch (err) {
        console.debug(err)
      }
    }
    return session
  }

  async isLoggedIn(): Promise<boolean> {
    const resp = await client.whoAmI()
    return resp.ok
  }

  async getDisplayName(): Promise<string | null> {
    const session = await this.getOrySession()
    if (session != null) {
      return session.identity.traits.email
    }
    return null
  }

  async getEmail(): Promise<string | null> {
    const session = await this.getOrySession()
    if (session != null) {
      return session.identity.traits.email
    }
    return null
  }

  async getUid(): Promise<string | null> {
    const session = await this.getOrySession()
    if (session != null) {
      return session.identity.id
    }
    return null
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    var createLoginResponse = await client.createLoginFlow({})
    if (createLoginResponse.ok) {
      var flow = await createLoginResponse.json()
    } else {
      return {ok: false, errors: [2]}
    }
    const body = {
      method: 'password',
      identifier: email,
      password: password,
      csrf_token: getCsrfToken(flow),      
    }
    var loginResponse = await client.submitLoginFlow(flow.id, body)
    return {ok: loginResponse.ok, errors: []}
  }

  async logOut(): Promise<AuthResponse> {
    const flowResponse = await client.createLogoutFlow()
    if (!flowResponse.ok) {
      return {ok: false, errors: []}
    }
    const flowData = await flowResponse.json()
    const logoutResponse = await client.updateLogoutFlow(flowData.logout_token)
    if (logoutResponse.ok) {
      return {ok: true, errors: []}
    }
    return {ok: false, errors: []}
  }

  async register(email: string, password: string, traits?: {[key: string]: any}): Promise<AuthResponse> {
    const flowResponse = await client.createRegistrationFlow()
    if (!flowResponse.ok) {
      return {ok: false, errors: []}
    }
    const flow = await flowResponse.json()
    if (traits == null) {
      traits = {}
    }
    traits['email'] = email
    const body = {
      method: 'password',
      password: password,
      csrf_token: getCsrfToken(flow),
      traits: traits
    }
    const resp = await client.updateRegistrationFlow(flow.id, body)

    if (resp.ok) {
      return {ok: true, errors: []}
    }
    return {ok: false, errors: []}

  }
}

export default OryAuthClientService