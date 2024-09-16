import { Stack, Typography } from "@mui/material";
import { StudyProtocolRepository } from "@/app/_lib/study/repository/repository";
import { LocalProtocolRepository } from "@/app/_lib/study/repository/local";
import { RadarCard } from "@/app/_ui/components/base/card";

export default async function Page({ params }: { params: { studyId: string } }) {
  var registery: StudyProtocolRepository = new LocalProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
    return (
        <main>
          <Stack 
            alignItems="center"
            padding={4} gap={4}
            maxWidth={'lg'}
            sx={{
              margin: 'auto'
            }}
          >
            <Typography variant="h2">Landing Page</Typography>
            <div>Study Name: {protocol.name}</div>
            <RadarCard>{JSON.stringify(protocol)}</RadarCard>
          </Stack>
        </main>
  )}