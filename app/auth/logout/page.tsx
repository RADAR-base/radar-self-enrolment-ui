"use client"
import { redirect, useRouter } from 'next/navigation'
import { withBasePath } from '@/app/_lib/util/links';

async function logout(): Promise<Response> {
  const flowResponse = await fetch(withBasePath('/api/ory/logout/browser'))
  if (flowResponse.ok) {
    const flowData = await flowResponse.json()
    const logoutResponse = await fetch(withBasePath('/api/ory/logout?') + 
      new URLSearchParams({
        logout_token: flowData['logout_token']
      })
    )
    return logoutResponse
  } else {
    return flowResponse
  }
}


export default function Page({ 
  params 
}: { 
  params: Promise<{ studyId: string }>
}) {
  const router = useRouter()
  const redirect_uri = '/'
  logout().then(
    (resp) => {
      router.push(redirect_uri)
      router.refresh()
    }
  )
  return <div></div>
}