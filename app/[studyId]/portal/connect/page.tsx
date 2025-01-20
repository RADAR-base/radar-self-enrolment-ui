"use server"
import { Box, Container } from '@mui/material';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { ArmtDefinitionRepository, getDefinition } from '@/app/_lib/armt/repository/repository';
import { DevicesPanel } from '@/app/_ui/portal/devicesPanel';


export default async function Page({ params }: { params: { studyId: string} }) {
  const registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  const armtRepo = new ArmtDefinitionRepository(protocol)
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            style={{marginLeft: "min(4, calc(100vw - 100%))"}}
            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
          <DevicesPanel protocol={protocol}></DevicesPanel>
        </Container>
      </Box>
    </main>
  )}