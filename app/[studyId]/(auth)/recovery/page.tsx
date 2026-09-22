import { redirect } from 'next/navigation'
import { withBasePath } from '@/app/_lib/util/links'

export default async function Page() {
  redirect(withBasePath('/auth/recovery'))
}
