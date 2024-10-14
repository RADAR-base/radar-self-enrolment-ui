import { Box, Container } from "@mui/material";
import { StudyProtocolRepository } from "@/app/_lib/study/repository/repository";
import { LocalProtocolRepository } from "@/app/_lib/study/repository/local";
import { RadarCard } from "@/app/_ui/components/base/card";
import { Block } from "@/app/_ui/components/blocks/block";
import Image from 'next/image'
import { LoremIpsum } from "@/app/_ui/debug/lorem";




export default async function Page({ params }: { params: { studyId: string } }) {
  var registery: StudyProtocolRepository = new LocalProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
    return (
        <main>
          <Box sx={{ flexGrow: 1}} 
                display="flex"
                justifyContent={{"sm": "left", "md": "center"}}
                alignItems={{"sm": "left", "md": "center"}}
                flexDirection="column"
                maxWidth={"100%"}
                gap={{xs: 0, sm: 2}}
                padding={{xs: 0, sm: 2}}
                >
               <Block
                  blockType="hero"
                  title="Hero Block"
                  subtitle="Subtitle"
                  heroImage={{src: "/study/paprka/resources/hero.png", altText: "PAPRkA hero image"}}
                  cta={{text: 'Join Study', 'href': 'paprka/enrol'}}
                  cta2={{text: 'Action 2', 'href': ''}}
                />
                <Block
                  blockType="video"
                  video={{
                    src: '/file_example_MP4_480_1_5MG.mp4',
                    type: 'video/mp4',
                    width: '100%',
                    params: {'controls': 'true', 'muted': 'true', 'autoPlay': 'true'}
                  }}
                  noCard
                  blockPadding={0}
                />
                <Block 
                  blockType="markdown" 
                  title="Markdown Block" 
                  subtitle="Subtitle"
                  content={`**hello** worfdsfdsfdsffssfsfsfsdfdld\n- one\n- two\n\n\n <br /><button variant="contained" href="https://google.com">Google</button>`}
                />
                <Block 
                  blockType="text"
                  title="Text Block" 
                  subtitle="Subtitle" 
                  content={LoremIpsum}
                />
          </Box>
        </main>
  )}