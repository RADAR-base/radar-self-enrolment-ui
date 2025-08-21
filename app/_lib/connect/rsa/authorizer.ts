
const RSA_BACKEND_URL = process.env.RSA_BACKEND_URL
const RSA_FRONTEND_URL = process.env.RSA_FRONTEND_URL

export async function makeRestSourceUser(
  accessToken: string,
  userId: string,
  projectId: string,
  sourceType: string,
  startDate?: Date,
  endDate?: Date
): Promise<string | null> {
  try {
    if (RSA_BACKEND_URL == undefined) {return null}
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
    const body = JSON.stringify({
      userId: userId,
      projectId: projectId,
      sourceType: sourceType,
      startDate: startDate ?? new Date(2016, 6).toISOString(),
      endDate: endDate ?? new Date(2025, 0).toISOString()
    })
    const response = await fetch(`${RSA_BACKEND_URL}/users`, {
      method: "POST",
      headers: headers,
      body: body
    })
    if (!response.ok) {
      if (response.status === 409) {
        const data = await response.json()
        return data.user.id
      } else {
        const data = await response.text()
        throw new Error(
          `Failed to create user: ${data || response.statusText}`,
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

export async function getRestSourceAuthLink(
  accessToken: string,
  rsaUserId: string,
  redirect_uri: string
): Promise<string | null> {
  try {
    const response = await fetch(`${RSA_BACKEND_URL}/registrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userId: rsaUserId,
        persistent: false,
      }),
    })

    if (!response.ok) {
      console.error(`url: ${RSA_BACKEND_URL}/registrations`)
      throw new Error(
        `Failed to retrieve registration token: ${response.statusText}`,
      )
    }

    const data = await response.json()
    if (!data.token || !data.secret) {
      throw new Error("Failed to retrieve auth link")
    }

    return `${RSA_FRONTEND_URL}/users:auth?token=${data.token}&secret=${data.secret}&redirect=true&return_to=${encodeURIComponent(redirect_uri)}`
  } catch (error) {
    console.error(error)
    return null
  }
}