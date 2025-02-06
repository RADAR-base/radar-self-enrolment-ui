"use client"

import { withBasePath } from "@/app/_lib/util/links"

export function GetCSRF() {
  console.log('getting kratos CSRF token')
  fetch(withBasePath('/api/ory/login/browser'))
  return null
}