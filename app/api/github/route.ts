import { NextRequest, NextResponse } from "next/server"
import { GITHUB_CONFIG } from "@/app/_lib/github/config/github-config"

const ALLOWED_HOSTS = new Set([
  "raw.githubusercontent.com",
])

const MAX_PDF_SIZE = GITHUB_CONFIG.MAX_CONTENT_LENGTH

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 })
  }

  if (parsed.protocol !== "https:") {
    return NextResponse.json({ error: "Only HTTPS allowed" }, { status: 403 })
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${response.status}` },
        { status: response.status },
      )
    }

    const contentLength = parseInt(response.headers.get("content-length") ?? "0", 10)
    if (contentLength > MAX_PDF_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 413 })
    }

    const buffer = await response.arrayBuffer()
    if (buffer.byteLength > MAX_PDF_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 413 })
    }

    const contentType = response.headers.get("content-type") ?? "application/octet-stream"

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch resource" }, { status: 502 })
  }
}
