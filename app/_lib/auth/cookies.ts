import { cookies } from "next/headers"

export function parseSetCookie(c: string): [string, string, {[key: string]: string | boolean}] {
  var split = c.split(';')
  var namevalue = split[0].split('=')
  var opts = Object.fromEntries(split.slice(1).map(
    (opt) => {
      var kv = opt.split('=')
      var k = kv[0].trim()
      var k = k.charAt(0).toLowerCase() + k.slice(1).replaceAll('-', '')
      return [k, kv[1] ? kv[1] : true]
    }
  ))
  return [namevalue[0], namevalue[1], opts]
}

export function setCookies(res: Response) {
  res.headers.getSetCookie().map(
    (c) => {
      var [name, value, opts] = parseSetCookie(c)
      cookies().set(name, value, opts)
    }
  )
}