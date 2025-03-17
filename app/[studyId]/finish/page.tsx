"use server"
import { Box, Container, Typography } from '@mui/material';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { RadarCard } from '@/app/_ui/components/base/card';
import Grid from '@mui/material/Grid2';
import { MarkdownContainer } from '@/app/_ui/components/base/markdown';
import NextButton from '@/app/_ui/components/base/nextButton';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { studyId: string, taskId: string} }) {
  const registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  if (protocol == undefined) { notFound() }
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
              <Typography variant="h2">{protocol.studyUiConfig.finishContent.title}</Typography>
              <MarkdownContainer>{protocol.studyUiConfig.finishContent.content}</MarkdownContainer>              
              <Box display='flex' flexDirection='row' justifyContent='flex-start' width={'100%'} paddingTop={2}>
                <NextButton href={`/${protocol.studyId}/portal`} variant='contained'>Back</NextButton>
              </Box>
            </Box>
          </RadarCard>
        </Grid>
      </Grid>
      </Container>
      </Box>
    </main>
  )}