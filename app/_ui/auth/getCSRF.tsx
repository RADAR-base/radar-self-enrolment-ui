"use client"

import { withBasePath } from "@/app/_lib/util/links"

export function GetCSRF() {
  fetch(withBasePath('/api/ory/login/browser'))
  return null
}