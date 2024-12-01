"use server"
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { TaskPanel } from '@/app/_ui/portal/taskPanel';
import Auth from '@/app/_lib/auth'
import { redirect } from 'next/navigation'
import { withBasePath } from '@/app/_lib/util/links';

export default async function Page({ params }: { params: { studyId: string } }) {
  var registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  const auth = new Auth()
  const loggedIn = await auth.isLoggedIn()
  if (!loggedIn) {redirect(withBasePath('enrol'))} // check study
  return (
    <main>
      <TaskPanel protocol={protocol}/>
    </main>
  )}