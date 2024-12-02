import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()

export class ArmtClient {
  private readonly AUTH_BASE_URL = `${publicRuntimeConfig.hydraPublicUrl}/oauth2`
  private readonly GRANT_TYPE = "authorization_code"
  private readonly CLIENT_ID = `aRMT`
  private readonly CLIENT_SECRET = ``

  async getAccessToken(
    code: string,
    redirectUri: string,
  ): Promise<any> {
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
      return data || null
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async getAccessTokenFromRedirect(): Promise<any> {
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
      "MEASUREMENT.CREATE",
      "SOURCEDATA.CREATE",
      "SOURCETYPE.UPDATE",
      "offline_access"
    ].join("%20")

    const audience = ["res_ManagementPortal", "res_gateway", "res_AppServer"].join("%20")

    const authUrl = `${this.AUTH_BASE_URL}/auth?client_id=${this.CLIENT_ID
      }&response_type=code&state=${Date.now()}&audience=${audience}&scope=${scopes}&redirect_uri=${window.location.href.split("?")[0]
      }`

    window.location.href = authUrl
  }

  async getAuthLink(
    accessToken: any,
    project: any,
  ): Promise<string> {
    const token = JSON.stringify(accessToken)
    const referrer = window.location.href.split("?")[0]
    const appUrl = `org.phidatalab.radar-armt://enrol?data=${encodeURIComponent(token)}&referrer=${referrer}`
    return appUrl
  }
}

export default new ArmtClient()
