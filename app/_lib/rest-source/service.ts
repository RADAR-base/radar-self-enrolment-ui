const USER_ENDPOINT = ''

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