"use client"
import { buildAuthLink } from "../authLink"

export async function getAuthLink(accessToken: any): Promise<string> {
  return buildAuthLink('org.phidatalab.radar-armt://enrol', accessToken)
}
