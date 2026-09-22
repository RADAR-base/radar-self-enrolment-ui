import { redirect } from 'next/navigation'
import { withBasePath } from '@/app/_lib/util/links'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ studyId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { studyId } = await params
  const sp = await searchParams
  const redirectTo = sp.redirect_to?.toString() ?? withBasePath(`/${studyId}/portal`)
  redirect(withBasePath(`/auth/login?redirect_to=${encodeURIComponent(redirectTo)}`))
}
