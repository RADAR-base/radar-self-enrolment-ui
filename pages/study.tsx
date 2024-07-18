import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

// Import render helpers
import { MarginCard, CardTitle, TextCenterButton, InnerCard } from "../pkg"

// Renders the eligibility page
const Study: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady) {
      return
    }
  })

  return (
    <>
      <Head>
        <title>Welcome</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <MarginCard>
        <CardTitle>EDIFY Research Study</CardTitle>
        <img src="image.png" />
        <div className="center">
          <label className="inputLabel">Study Overview</label>
          <InnerCard>
            This study aims to understand the effects of eating disorders.
            Participants will be askeed to fill out questionnaires and undergo
            non-invaise tests over the course of one year.
          </InnerCard>
        </div>
        <TextCenterButton
          className=""
          disabled=""
          data-testid=""
          href="/eligibility"
        >
          Join Now
        </TextCenterButton>
        {/* <Flow onSubmit={onSubmit} flow={flow} /> */}
      </MarginCard>
    </>
  )
}

export default Study
