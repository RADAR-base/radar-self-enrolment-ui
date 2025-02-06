"use server"
import { TaskPanel } from '@/app/_ui/portal/taskPanel';

import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { ArmtStatus } from '@/app/api/study/[studyId]/tasks/status/route';
import { withBasePath } from '@/app/_lib/util/links';
import { allTaskStatus } from '@/app/_lib/study/tasks/status';
import { whoAmI } from '@/app/_lib/auth/ory/kratos';

async function fetchTaskStatus(studyId: string): Promise<{[key: string]: ArmtStatus} | null> {
  const resp = await whoAmI()
  if (resp.status == 200) {
    const oryUser = await resp.json()
    const userId = oryUser['identity']['id']
    if (userId) {
      return await allTaskStatus(studyId, userId)
    }
  }
  return null
}

export default async function Page({ params }: { params: { studyId: string } }) {
  var registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  const status = await fetchTaskStatus(params.studyId)

  return (
    <main>
      <TaskPanel armtStatuses={status ?? undefined}/>
    </main>
  )}