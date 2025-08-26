"use client"

export async function getAuthLink(
  accessToken: any,
): Promise<string> {
  const token = JSON.stringify(accessToken)
  const referrer = window.location.href.split("?")[0]
  const UrlParams = new URLSearchParams([
    ['data', token],
    ['referrer', referrer]
  ])
  const appUrl = 'org.radarbase.prmt://?' + UrlParams.toString()
  return appUrl
}