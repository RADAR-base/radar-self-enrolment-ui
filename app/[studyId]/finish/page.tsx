"use server"
import { Box, Button, Container, Typography } from '@mui/material';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { ArmtDefinitionRepository, getDefinition } from '@/app/_lib/armt/repository/repository';
import { ArmtContent } from '@/app/_ui/components/form/pageContent';
import { RadarCard } from '@/app/_ui/components/base/card';
import {whoAmI} from '@/app/_lib/auth/ory/kratos';
import Grid from '@mui/material/Grid2';
import { MarkdownContainer } from '@/app/_ui/components/base/markdown';
import NextButton from '@/app/_ui/components/base/nextButton';
import { RadarDeviceCard } from '@/app/_ui/components/portal/deviceCard';

export default async function Page({ params }: { params: { studyId: string, taskId: string} }) {
  const registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  const projectId = protocol.studyId
  return (
    <main>
       <Box sx={{ flexGrow: 1, margin: 2}} 
      display="flex"
      justifyContent="center"
      alignItems="center">
      <Container maxWidth="lg" disableGutters>
      <Grid container spacing={2} gridAutoColumns={'3lf'} gridAutoFlow={"column"}>
        <Grid size={12}>
          <RadarCard>
            <Box display={'flex'} flexDirection={'column'}
                textAlign={'left'} alignContent={'flex-start'}
                alignItems={'flex-start'}
                padding={3}
                gap={1}>
              <Typography variant="h2">Thank you</Typography>
              <Typography variant="subtitle1">You have successfully joined the {protocol.name} research study.</Typography>
              <Typography variant="body1">{"\nThanks to your contribution, our research will help millions of people living with knee osteoarthritis who will undergo knee replacement surgeries in the future.\n\nThe results of the study will be published at the end of 2026. You can receive regular updates and be the first to hear the results by subscribing to our newsletter"}</Typography>
              <Box display='flex' flexDirection='row' justifyContent='flex-start' width={'100%'} paddingTop={2}>
                <NextButton href={`/${projectId}/portal`}  variant='contained'>Back</NextButton>
              </Box>
            </Box>
          </RadarCard>
        </Grid>
      </Grid>
      </Container>
      </Box>
    </main>
  )}