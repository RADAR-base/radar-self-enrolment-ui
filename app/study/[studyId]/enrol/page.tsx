import Auth from '@/app/_lib/auth'
import AuthServer from '@/app/_lib/auth/ory/service.server'

const auth = new Auth();
const authServer = new AuthServer();

export default async function Page({ params }: { params: { studyId: string } }) {
  const content = await authServer.getDisplayName()

  return (
    <main>
      {content}
    </main>
  )}