// "use client";
// import { Card } from "@mui/material";
// import { usePathname, useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// import { kratos, hydra } from "@/app/_lib/auth/ory/ory";
// import { OAuth2ApiGetOAuth2ClientRequest, OAuth2ConsentRequest } from "@ory/client";
// import { OrySession } from "@/app/_lib/auth/ory/types";


// async function acceptSkipConsent(consent: OAuth2ConsentRequest, userSession: OrySession) {
//   const router = useRouter()
//   let r = await hydra.acceptOAuth2ConsentRequest({consentChallenge: consent.challenge})
//   if (r.status == 200) {
//     router.push(r.data.redirect_to)
//   }
// }

// function getUserSession(setSession: (value: any) => void) {
//   kratos.toSession().then(
//     (response) => {
//       if (response.status == 200) {
//         setSession(response.data)
//       }
//     }
//   )
// }

// function getConsentRequest(consentChallenge: string, setConsent: (value: any) => void) {
//   hydra.getOAuth2ConsentRequest({
//     consentChallenge: consentChallenge
//   }).then(
//     (value) => {
//       console.log(value)
//       setConsent(value.data)
//     }
//   )
// }

// export default function Page() {
//   const router = useRouter()
//   const pathname = usePathname()
//   const searchParams = useSearchParams()

//   const [userSession, setUserSession] = useState<any>(undefined)
//   const [consent, setConsent] = useState<OAuth2ConsentRequest | null | undefined>(undefined)

//   const consentChallenge = searchParams.get('consent_challenge') ?? ""

//   useEffect(() => {
//     if (consentChallenge == "") {
//       router.push('/')
//       return
//     }
//     if (userSession == undefined) {
//       getUserSession(setUserSession)
//     }
//     if (consent == undefined) {
//       getConsentRequest(consentChallenge, setConsent)
//     }
//   }, [consent])


//   console.log('skip')
//   console.log(consent)
//   console.log(userSession)

//   if ((!!consent?.client?.skip_consent) && (!!userSession)) {
//     acceptSkipConsent(consent, userSession)
//   }
//   return <Card>{userSession?JSON.stringify(userSession, null, 2):""}</Card>
// }