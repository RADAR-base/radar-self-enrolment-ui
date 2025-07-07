"use server"
import { TaskPanel } from '@/app/_ui/portal/taskPanel';
import { ArmtStatus } from '@/app/api/study/[studyId]/tasks/status/route';
import { allTaskStatus } from '@/app/_lib/study/tasks/status';
import { whoAmI } from '@/app/_lib/auth/ory/kratos';
import { getStudyStatus, setStudyStatus } from '@/app/_lib/study/status';
import { paprkaEmailOnEnrol, paprkaEmailOnFinish } from '@/app/_lib/email/paprka';
import { FinishBanner } from '@/app/_ui/components/portal/finishBanner';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';

async function getOryUser() {
  const resp = await whoAmI()
  if (resp.status == 200) {
    const oryUser = await resp.json()
    return oryUser
  }
}

async function fetchTaskStatus(studyId: string, oryUser: any): Promise<{[key: string]: ArmtStatus} | null> {
  const userId = oryUser['identity']['id']
  if (userId) {
    return await allTaskStatus(studyId, userId)
  }
  return null
}

async function fetchStudyStatus(studyId: string, oryUser: any) {
  const userId = oryUser['identity']['id']
  if (userId) {
    return await getStudyStatus(studyId, userId)
  }
  return null
}

async function paprkaEmails(studyId: string, oryUser: any, status: {[key:string]: ArmtStatus} | null) {
  const studyStatus = await fetchStudyStatus(studyId, oryUser)
    if (studyStatus == 'enrolled') {
      await setStudyStatus('paprka', oryUser['identity']['id'], 'active')
      paprkaEmailOnEnrol(oryUser)
    } 
    if (studyStatus != 'complete') {
      if (!(status &&
        ((status['paprka_about'].due) ||
        (status['paprka_surgery'].due) ||
        (status['connect'].due) )
      )) {
        await setStudyStatus('paprka', oryUser['identity']['id'], 'complete')
        paprkaEmailOnFinish(oryUser)
        return true
      }
    }
  return false
}

export default async function Page(props: { params: Promise<{ studyId: string }> }) {

  var showFinishBanner: boolean = false
  const params = await props.params;
  const oryUser = await getOryUser()
  const status = await fetchTaskStatus(params.studyId, oryUser)
  const registery = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  const finishTitle = protocol?.studyUiConfig.finishContent.title ?? 'Finished'
  const finishContent = protocol?.studyUiConfig.finishContent.content ?? 'Thank you for completing the study'
  if ((params.studyId == 'paprka')) {
    showFinishBanner = await paprkaEmails(params.studyId, oryUser, status)
  }
  return (
    <main>
      <TaskPanel armtStatuses={status ?? undefined} />
      {showFinishBanner && <FinishBanner title={finishTitle} content={finishContent} />}
    </main>
  )
}