"use server"
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { TaskPanel } from '@/app/_ui/portal/taskPanel';

export default async function Page({ params }: { params: { studyId: string } }) {
  var registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  return (
    <main>
      <TaskPanel protocol={protocol}/>
    </main>
  )}