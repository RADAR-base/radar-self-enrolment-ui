const USER_ENDPOINT = ''
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_HYDRA_PUBLIC_URL + "/oauth2"
const GRANT_TYPE = "authorization_code"
const CLIENT_ID = process.env.ARMT_CLIENT_ID ?? "SEP"
const CLIENT_SECRET = process.env.ARMT_CLIENT_SECRET  ?? ""
const REDIRECT_URI = process.env.NEXT_PUBLIC_RSA_REDIRECT_URI

async function getRestSourceUser(
  accessToken: string,
  userId: string,
  projectId: string,
  sourceType: string
): Promise<string | null> {
  try {
    const response = await fetch(USER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userId: userId,
        projectId: projectId,
        sourceType: sourceType,
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


export function authRequestLink(state: string): string {
  const scopes = [
    "SOURCETYPE.READ",
    "PROJECT.READ",
    "SUBJECT.READ",
    "SUBJECT.UPDATE",
    "SUBJECT.CREATE",
  ].join("%20")
  const audience = "res_restAuthorizer"
  const authUrl = `${AUTH_BASE_URL}/auth?client_id=${CLIENT_ID}&response_type=code&state=${state}&audience=${audience}&scope=${scopes}&redirect_uri=${REDIRECT_URI}`
  return authUrl
}