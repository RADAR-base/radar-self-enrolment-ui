import { cookies } from "next/headers";

export function parseSetCookie(c: string): [string, string, {[key: string]: string | boolean}] {
  var split = c.split(';')
  var namevalue = split[0].split('=')
  var opts = Object.fromEntries(split.slice(1).map(
    (opt) => {
      var kv = opt.split('=')
      var key = kv[0].trim()
      key = key.charAt(0).toLowerCase() + key.slice(1).replaceAll('-', '')
      return [key, kv[1] ? kv[1] : true]
    }
  ))
  return [namevalue[0], namevalue[1], opts]
}

export async function setCookies(res: Response) {
  const cookieJar = await cookies()
  res.headers.getSetCookie().map(
    (c) => {
      var [name, value, opts] = parseSetCookie(c)
      cookieJar.set(name, value, opts)
    }
  )
}