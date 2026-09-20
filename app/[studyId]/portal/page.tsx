"use server"
import { TaskPanel } from '@/app/_ui/portal/taskPanel';
import { ArmtStatus } from '@/app/api/study/[studyId]/tasks/status/route';
import { allTaskStatus } from '@/app/_lib/study/tasks/status';
import { whoAmI } from '@/app/_lib/auth/ory/kratos';
import { OrySession } from '@/app/_lib/auth/ory/types';
import { redirect } from 'next/navigation';
import { withBasePath } from '@/app/_lib/util/links';

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

export default async function Page(props: { params: Promise<{ studyId: string }> }) {
  const params = await props.params;
  console.log("[PortalPage] render:start", { studyId: params.studyId });

  try {
    const oryUser = await getOryUser()
    if (oryUser == undefined) {
      console.log("[PortalPage] no Ory user, redirecting to login", {
        studyId: params.studyId,
      });
      redirect(withBasePath(`/${params.studyId}/login`))
    }
    const status = await fetchTaskStatus(params.studyId, oryUser)
    return (
      <main>
        <TaskPanel armtStatuses={status} />
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