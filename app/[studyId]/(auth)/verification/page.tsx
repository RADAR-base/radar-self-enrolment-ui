"use client"
import { redirect, useRouter } from 'next/navigation'
import { withBasePath } from '@/app/_lib/util/links';
import { useEffect, useState } from 'react';

// async function logout(): Promise<Response> {
//   const flowResponse = await fetch(withBasePath('/api/ory/logout/browser'))
//   if (flowResponse.ok) {
//     const flowData = await flowResponse.json()
//     const logoutResponse = await fetch(withBasePath('/api/ory/logout?') + 
//       new URLSearchParams({
//         logout_token: flowData['logout_token']
//       })
//     )
//     return logoutResponse
//   } else {
//     return flowResponse
//   }
// }


export default function Page({ params }: { params: { studyId: string } }) {
  const router = useRouter()
  const redirect_uri = '/' + params.studyId
  const [flow, setFlow] = useState<IOryVerificationFlow | undefined>(undefined)

  useEffect(() => {
    if (flow == undefined) {
      fetch(withBasePath('/api/ory/verification/browser')).then(
        (response) => {
          if (response.ok) {
            response.json().then(
              (data) => {
                setFlow(data as IOryVerificationFlow)
              }
            )
          }
        }
      )
    }
  })
  console.log(flow)
  return <div></div>
}