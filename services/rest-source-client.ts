export class RestSourceClient {
  private readonly AUTH_BASE_URL = "http://localhost:4444/oauth2"
  private readonly GRANT_TYPE = "authorization_code"
  private readonly CLIENT_ID = "SEP"
  private readonly CLIENT_SECRET = "secret"
  private readonly REGISTRATION_ENDPOINT =
    "http://localhost:8085/rest-sources/backend/registrations"
  private readonly FRONTEND_ENDPOINT =
    "http://localhost:8081/rest-sources/authorizer"

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

    const response = await fetch(`${this.AUTH_BASE_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: bodyParams,
    })

    const data = await response.json()
    return data.access_token || null
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

    const authUrl = `${this.AUTH_BASE_URL}/auth?client_id=${this.CLIENT_ID}&response_type=code&state=${Date.now()}&audience=res_restAuthorizer&scope=${scopes}&redirect_uri=${window.location.href.split("?")[0]}`

    window.location.href = authUrl
  }

  // Make a POST request to the registration endpoint to retrieve the authorization link
  async getRestSourceAuthLink(accessToken: string): Promise<string | null> {
    const response = await fetch(this.REGISTRATION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userId: "4",
        persistent: true,
      }),
    })

    const data = await response.json()
    if (!data.token || !data.secret) {
      console.error("Failed to retrieve auth link")
      return null
    }

    return `${this.FRONTEND_ENDPOINT}/users:auth?token=${data.token}&secret=${data.secret}`
  }

  // Redirect user to the authorization link for the rest source
  async redirectToRestSourceAuthLink(accessToken: string): Promise<void> {
    const url = await this.getRestSourceAuthLink(accessToken)
    if (url) {
      console.log("Redirecting to: ", url)
      window.location.href = url
    }
  }
}

export default new RestSourceClient()
