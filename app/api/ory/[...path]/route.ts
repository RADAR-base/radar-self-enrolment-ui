import { proxyToDelegate } from "@/app/_lib/auth/proxy"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyToDelegate('ory', request, (await params).path.join('/'))
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyToDelegate('ory', request, (await params).path.join('/'))
}
