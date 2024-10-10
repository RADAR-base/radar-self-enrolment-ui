import { Box, Container } from "@mui/material";
import { StudyProtocolRepository } from "@/app/_lib/study/repository/repository";
import { LocalProtocolRepository } from "@/app/_lib/study/repository/local";
import { RadarCard } from "@/app/_ui/components/base/card";
import { Block } from "@/app/_ui/components/blocks/block";
import Image from 'next/image'

export default async function Page({ params }: { params: { studyId: string } }) {
  var registery: StudyProtocolRepository = new LocalProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
    return (
        <main>
          <Box sx={{ flexGrow: 1, marginTop: {xs: 0, sm: 0}}} 
                display="flex"
                justifyContent={{"sm": "left", "md": "center"}}
                alignItems={{"sm": "left", "md": "center"}}
                flexDirection="column"
                >
                <Block 
                  blockType="markdown" title="Test Block" subtitle="Test Subtitle"
                  content={`#### hello worfdsfdsfdsffssdffdsfdfsfsfsdfdld\n- one\n- two\n\n\n <br /><button variant="contained" href="https://google.com">Google</button>`}
                />
                <Block 
                  blockType="markdown"
                  title="Test Block" 
                  subtitle="Test Subtitle" 
                  content={`#### hello world\n- one\n- two`}
                  noCard
                  blockBackground="white"
                />
          </Box>
        </main>
  )}