"use server"
import { TaskPanel } from '@/app/_ui/portal/taskPanel';
import { ArmtStatus } from '@/app/api/study/[studyId]/tasks/status/route';
import { allTaskStatus } from '@/app/_lib/study/tasks/status';
import { whoAmI } from '@/app/_lib/auth/ory/kratos';
import { getStudyStatus, setStudyStatus } from '@/app/_lib/study/status';
import { paprkaEmailOnEnrol, paprkaEmailOnFinish } from '@/app/_lib/email/paprka';
import { FinishBanner } from '@/app/_ui/components/portal/finishBanner';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { OrySession } from '@/app/_lib/auth/ory/types';
import { redirect } from 'next/navigation';

async function getOryUser() {
  const resp = await whoAmI()
  if (resp.status == 200) {
    const oryUser = (await resp.json()) as OrySession
    return oryUser
  }
}

async function fetchTaskStatus(studyId: string, oryUser: any): Promise<{[key: string]: ArmtStatus} | undefined> {
  if (oryUser) {
    return (await allTaskStatus(studyId, oryUser.identity.id)) ?? undefined
  }
}

async function fetchStudyStatus(studyId: string, oryUser?: OrySession) {
  if (oryUser) {
    return await getStudyStatus(studyId, oryUser.identity.id)
  }
}

async function paprkaEmails(studyId: string, oryUser: any, status?: {[key:string]: ArmtStatus} | null) {
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
  const params = await props.params;
  console.log("[PortalPage] render:start", { studyId: params.studyId });

  try {
    let showFinishBanner = false;
    const oryUser = await getOryUser()
    if (oryUser == undefined) {
      console.log("[PortalPage] no Ory user, redirecting to login", {
        studyId: params.studyId,
      });
      redirect(`/${params.studyId}/login`)
    }
    const status = await fetchTaskStatus(params.studyId, oryUser)
    const registery = new StudyProtocolRepository()
    const protocol = await registery.getStudyProtocol(params.studyId)
    console.log("[PortalPage] protocol result", {
      studyId: params.studyId,
      hasProtocol: !!protocol,
      protocolStudyId: protocol?.studyId,
      protocolName: protocol?.name,
    });
    const finishTitle = protocol?.studyUiConfig.finishContent?.title ?? 'Finished'
    const finishContent = protocol?.studyUiConfig.finishContent?.content ?? 'Thank you for completing the study'
    if ((params.studyId == 'paprka')) {
      showFinishBanner = await paprkaEmails(params.studyId, oryUser, status)
    }
    return (
      <main>
        <TaskPanel armtStatuses={status} />
        {showFinishBanner && <FinishBanner title={finishTitle} content={finishContent} />}
      </main>
    )
  } catch (err) {
    console.error("[PortalPage] render:error", {
      studyId: params.studyId,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw err;
  }
}