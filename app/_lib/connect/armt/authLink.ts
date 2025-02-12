"use client"

export async function getAuthLink(
  accessToken: any,
): Promise<string> {
  const token = JSON.stringify(accessToken)
  const referrer = window.location.href.split("?")[0]
  const appUrl = `org.phidatalab.radar-armt://enrol?data=${encodeURIComponent(token)}&referrer=${referrer}`
  return appUrl
}