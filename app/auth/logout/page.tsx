"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { withBasePath } from '@/app/_lib/util/links'

async function logout(): Promise<Response> {
  const flowResponse = await fetch(withBasePath('/api/ory/logout/browser'))
  if (flowResponse.ok) {
    const flowData = await flowResponse.json()
    return await fetch(withBasePath('/api/ory/logout?') +
      new URLSearchParams({ logout_token: flowData['logout_token'] })
    )
  }
  return flowResponse
}

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('return_to') ?? withBasePath('/')

  useEffect(() => {
    logout().then(() => {
      router.push(returnTo)
      router.refresh()
    })
  }, [])

  return <div></div>
}
