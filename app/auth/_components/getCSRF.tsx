"use client"

import { withBasePath } from "@/app/_lib/util/links"
import { useEffect } from "react"

export function GetCSRF() {
  useEffect(() => {
    fetch(withBasePath('/api/ory/login/browser'))
  }, [])
  return <></>
}