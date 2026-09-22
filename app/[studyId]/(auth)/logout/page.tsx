import { redirect } from 'next/navigation'
import { withBasePath } from '@/app/_lib/util/links'

export default async function Page(props: { params: Promise<{ studyId: string }> }) {
  const { studyId } = await props.params
  redirect(withBasePath(`/auth/logout?return_to=${encodeURIComponent(withBasePath(`/${studyId}`))}`))
}
