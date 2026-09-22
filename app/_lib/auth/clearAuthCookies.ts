import { cookies } from "next/headers"

export async function clearAuthCookies() {
  const cookieJar = await cookies()
  cookieJar.delete('sep_access_token')
  for (const c of cookieJar.getAll()) {
    if (c.name.includes('csrf') || c.name.includes('hydra')) {
      cookieJar.delete(c.name)
    }
  }
}
