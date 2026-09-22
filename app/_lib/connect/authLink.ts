"use client"

export function buildAuthLink(scheme: string, accessToken: any): string {
  const token = JSON.stringify(accessToken)
  const referrer = window.location.href.split("?")[0]
  const params = new URLSearchParams([
    ['data', token],
    ['referrer', referrer]
  ])
  return `${scheme}?${params.toString()}`
}
