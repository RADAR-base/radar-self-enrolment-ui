"use client"
import { IOryErrorFlow, IOryRecoveryFlow } from "@/app/_lib/auth/ory/flows.interface"
import { getCsrfToken } from "@/app/_lib/auth/ory/util"
import { withBasePath } from "@/app/_lib/util/links"
import { RecoveryCodeFormValues, RecoveryEmailFormValues } from "./recovery.interfaces"

export async function SubmitRecoveryEmail({email}: RecoveryEmailFormValues, flow: IOryRecoveryFlow): Promise<IOryRecoveryFlow | IOryErrorFlow | undefined> {
    const body = {
      email: email,
      csrf_token: getCsrfToken(flow),
      method: 'code'
    }
    const res = await fetch(withBasePath('/api/ory/recovery?' + new URLSearchParams({
      flow: flow.id
    })), {
      method: 'POST',
      body: JSON.stringify(body)
    })
    try {
      const newFlow = (await res.json())
      if (res.ok) {
        return newFlow as IOryRecoveryFlow
      } else {
        return newFlow as IOryErrorFlow
      }
    } catch {
      return undefined
    }
  }



export async function SubmitRecoveryCode({ code }: RecoveryCodeFormValues, flow: IOryRecoveryFlow):
  Promise<IOryRecoveryFlow | IOryErrorFlow | undefined> {

  const body = {
    code: code,
    csrf_token: getCsrfToken(flow),
    method: 'code'
  }
  const res = await fetch(withBasePath('/api/ory/recovery?' + new URLSearchParams({
    flow: flow.id
  })), {
    method: 'POST',
    body: JSON.stringify(body)
  })
  const data = await res.json()
  return data
}