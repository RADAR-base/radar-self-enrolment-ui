"use client"
import { useEffect } from "react"
import { useSearchParams, useParams } from "next/navigation"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { RadarRedcapFieldDefinition } from "@/app/_lib/armt/definition/redcap.types"

dayjs.extend(customParseFormat)

const STORAGE_KEY_PREFIX = "enrolment_params_"

function storageKey(studyId: string): string {
  return STORAGE_KEY_PREFIX + studyId
}

export function getCapturedParams(studyId: string): Record<string, string> {
  if (typeof window === "undefined") return {}
  try {
    const raw = sessionStorage.getItem(storageKey(studyId))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function clearCapturedParams(studyId: string): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(storageKey(studyId))
  } catch {}
}

export function buildAdditionalInitialValues(
  items: RadarRedcapFieldDefinition[],
  searchParams: URLSearchParams,
  studyId: string
): Record<string, string> {
  const stored = getCapturedParams(studyId)
  const values: Record<string, string> = {}

  for (const item of items) {
    if (item.field_type === "descriptive") continue
    const raw = searchParams.get(item.field_name) ?? stored[item.field_name]
    if (raw == null) continue

    if (item.field_type === "text" && item.text_validation_type_or_show_slider_number === "datetime_dmy") {
      const parsed = dayjs(raw, ["DD/MM/YYYY", "YYYY-MM-DD"], true)
      if (parsed.isValid()) values[item.field_name] = parsed.format("YYYY-MM-DD")
    } else {
      values[item.field_name] = raw
    }
  }
  return values
}

/**
 * Captures URL search params into sessionStorage so they survive
 * navigation across pages (e.g. landing page → enrol).
 */
export function SearchParamsCapture() {
  const searchParams = useSearchParams()
  const { studyId } = useParams<{ studyId: string }>()

  useEffect(() => {
    if (!studyId || searchParams.size === 0) return
    const existing = getCapturedParams(studyId)
    const updated = { ...existing }
    searchParams.forEach((value, name) => { updated[name] = value })
    try {
      sessionStorage.setItem(storageKey(studyId), JSON.stringify(updated))
    } catch {}
  }, [searchParams, studyId])

  return null
}
