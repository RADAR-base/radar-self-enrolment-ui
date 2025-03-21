import { AuthResponse, ClientAuthService, ServerAuthService } from '../service.interface'
import * as ory from './kratos'
import { OrySession } from './types'
import { getCsrfToken } from './util'

class OryAuthServerService extends ClientAuthService {
  private async getSession(): Promise<OrySession | null> {
    const resp = await ory.whoAmI()
    var session: OrySession | null = null
    if (resp.ok) {
      try {
      session = new OrySession(await resp.json())
      } catch (err) {
        console.debug(err)
      }
    }
    return session
  }
  async isLoggedIn(): Promise<boolean> {
    const resp = await ory.whoAmI()
    return resp.ok
  }
  async getDisplayName(): Promise<string | undefined> {
    return this.getEmail()
  }
  async getEmail(): Promise<string | undefined> {
    return (await this.getSession())?.identity.traits.email
  }
  async getUid(): Promise<string | undefined> {
    throw (await this.getSession())?.identity.id
  }
  async signIn(email: string, password: string): Promise<AuthResponse> {
    var createLoginResponse = await ory.createLoginFlow()
    if (createLoginResponse.ok) {
      var flow = await createLoginResponse.json()
    } else {
      return {ok: false, errors: [2]}
    }
    var loginResponse = await ory.submitLoginFlow(email, password, getCsrfToken(flow), flow.id)
    return {ok: loginResponse.ok, errors: []}
  }
  async logOut(): Promise<AuthResponse> {
    const flowResponse = await ory.createLogoutFlow()
    if (!flowResponse.ok) {
      return {ok: false, errors: []}
    }
    const flowData = await flowResponse.json()
    const logoutResponse = await ory.updateLogoutFlow(flowData.logout_token)
    if (logoutResponse.ok) {
      return {ok: true, errors: []}
    }
    return {ok: false, errors: []}
  }

  async register(email: string, password: string, traits?: {[key: string]: any}): Promise<AuthResponse> {
    const flowResponse = await ory.createRegistrationFlow()
    if (!flowResponse.ok) {
      return {ok: false, errors: []}
    }
    const flow = await flowResponse.json()
    if (traits == null) {
      traits = {}
    }
    traits['email'] = email
    const body = {
      method: "password",
      password: password,
      csrf_token: getCsrfToken(flow),
      traits: traits
    }
    const resp = await ory.updateRegistrationFlow(flow.id, body)

    if (resp.ok) {
      return {ok: true, errors: []}
    }
    return {ok: false, errors: []}

  }
}

export default OryAuthServerService