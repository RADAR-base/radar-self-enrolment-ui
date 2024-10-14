import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()

export class RestSourceClient {
  private readonly AUTH_BASE_URL = `${publicRuntimeConfig.hydraPublicUrl}/oauth2`
  private readonly GRANT_TYPE = "authorization_code"
  private readonly CLIENT_ID = `${publicRuntimeConfig.frontEndClientId}`
  private readonly CLIENT_SECRET = `${publicRuntimeConfig.frontEndClientSecret}`
  private readonly REGISTRATION_ENDPOINT = `${publicRuntimeConfig.restSourceBackendEndpoint}/registrations`
  private readonly USER_ENDPOINT = `${publicRuntimeConfig.restSourceBackendEndpoint}/users`
  private readonly FRONTEND_ENDPOINT = `${publicRuntimeConfig.restSourceFrontendEndpoint}`
  private readonly SOURCE_TYPE = "Oura"

  async getRestSourceUser(
    accessToken: string,
    project: any,
  ): Promise<string | null> {
    try {
      const response = await fetch(this.USER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: project.userId,
          projectId: project.id,
          sourceType: this.SOURCE_TYPE,
          startDate: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        if (response.status === 409 && data.user) {
          console.warn("User already exists:", data.message)
          return data.user.id
        } else {
          throw new Error(
            `Failed to create user: ${data.message || response.statusText}`,
          )
        }
      }

      const userDto = await response.json()
      return userDto.id
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async getAccessToken(
    code: string,
    redirectUri: string,
  ): Promise<string | null> {
    const bodyParams = new URLSearchParams({
      grant_type: this.GRANT_TYPE,
      code,
      redirect_uri: redirectUri,
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
    })

    try {
      const response = await fetch(`${this.AUTH_BASE_URL}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: bodyParams,
      })

      if (!response.ok) {
        throw new Error(
          `Failed to retrieve access token: ${response.statusText}`,
        )
      }

      const data = await response.json()
      return data.access_token || null
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async getAccessTokenFromRedirect(): Promise<string | null> {
    const url = new URL(window.location.href)
    const code = url.searchParams.get("code")
    if (!code) return null

    const redirectUri = window.location.href.split("?")[0]
    return this.getAccessToken(code, redirectUri)
  }

  redirectToAuthRequestLink(): void {
    const scopes = [
      "SOURCETYPE.READ",
      "PROJECT.READ",
      "SUBJECT.READ",
      "SUBJECT.UPDATE",
      "SUBJECT.CREATE",
    ].join("%20")

    const authUrl = `${this.AUTH_BASE_URL}/auth?client_id=${
      this.CLIENT_ID
    }&response_type=code&state=${Date.now()}&audience=res_restAuthorizer&scope=${scopes}&redirect_uri=${
      window.location.href.split("?")[0]
    }`

    window.location.href = authUrl
  }

  async getRestSourceAuthLink(
    accessToken: string,
    project: any,
  ): Promise<string | null> {
    try {
      const userId = await this.getRestSourceUser(accessToken, project)
      if (!userId) {
        throw new Error("Failed to retrieve or create user")
      }

      const response = await fetch(this.REGISTRATION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId,
          persistent: false,
        }),
      })

      if (!response.ok) {
        throw new Error(
          `Failed to retrieve registration token: ${response.statusText}`,
        )
      }

      const data = await response.json()
      if (!data.token || !data.secret) {
        throw new Error("Failed to retrieve auth link")
      }

      return `${this.FRONTEND_ENDPOINT}/users:auth?token=${data.token}&secret=${data.secret}`
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async redirectToRestSourceAuthLink(
    accessToken: string,
    project: any,
  ): Promise<void> {
    const url = await this.getRestSourceAuthLink(accessToken, project)
    if (url) {
      console.log("Redirecting to: ", url)
      window.location.href = url
    }
  }
}

export default new RestSourceClient()
