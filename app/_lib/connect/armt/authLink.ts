"use client"

export async function getAuthLink(
  accessToken: any,
): Promise<string> {
  const token = JSON.stringify(accessToken)
  const referrer = process.env.NEXT_PUBLIC_HYDRA_PUBLIC_URL ?? window.location.href.split("?")[0]
  const UrlParams = new URLSearchParams([
    ['data', token],
    ['referrer', referrer]
  ])
  const appUrl = 'org.phidatalab.radar-armt://enrol?' + UrlParams.toString()
  return appUrl
}