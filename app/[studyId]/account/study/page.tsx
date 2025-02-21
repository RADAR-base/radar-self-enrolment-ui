"use server"
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { Download } from '@mui/icons-material';
import { Box } from '@mui/material';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { studyId: string, taskId: string} }) {
  const registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  if (protocol == undefined) { notFound() }
  return (
    <main>
      <Box>
        <Download />
      </Box>
    </main>
  )
}