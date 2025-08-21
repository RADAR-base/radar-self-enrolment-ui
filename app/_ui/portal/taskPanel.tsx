"use client"
import { Box, Button, Container, Modal, Typography } from "@mui/material"
import { RadarTaskCard, RadarTaskCardProps } from '@/app/_ui/components/portal/taskCard';
import Grid from '@mui/material/Grid2';
import { ArmtProtocol, StudyProtocol } from "@/app/_lib/study/protocol";
import { ArmtStatus } from "@/app/api/study/[studyId]/tasks/status/route";
import { withBasePath } from "@/app/_lib/util/links";
import { useContext, useEffect } from "react";
import React from "react";
import { RadarCard } from "../components/base/card";
import { CircularProgressWithLabel } from "../components/base/circularProgress";
import { MarkdownContainer } from "../components/base/markdown";
import { useRouter } from "next/navigation";
import { ProtocolContext } from "@/app/_lib/study/protocol/provider.client";

async function fetchTaskStatus(studyId: string) {
  let resp = await fetch(withBasePath('/api/study/' + studyId + '/tasks/status'))
  let status = await resp.json()
  return status as {[key: string]: ArmtStatus}
}

interface TaskPanel {
  armtStatuses?: {[key: string]: ArmtStatus}
}

export function TaskPanel(props: TaskPanel) {
  const [armtStatuses, setArmtStatuses] = React.useState<{[key: string]: ArmtStatus} | undefined>(props.armtStatuses)
  const protocol = useContext(ProtocolContext);
  const studyId = protocol.studyId
  const armtProtocols = protocol.protocols

  useEffect(() => {
    if (armtStatuses == undefined) {
      fetchTaskStatus(studyId).then(
        (data) => setArmtStatuses(data)
      )
    }
  }, [armtStatuses])

  let numTasksComplete = 0
  let numRequiredTasksComplete = 0

  const items = armtProtocols.map(
    (item) => {
      let status = 'disabled'
      if (armtStatuses != undefined) {
        status = armtStatuses[item.id].due ? 'todo': 'done'
        numTasksComplete += + (!armtStatuses[item.id].due)
        numRequiredTasksComplete += +!(armtStatuses[item.id].due || item.metadata.optional)
      }
      return <RadarTaskCard armtProtocol={item} status={status as RadarTaskCardProps["status"]} />
  })

  const numTasks = armtProtocols.length
  const numRequiredTasks = armtProtocols.filter((x) => (x.metadata.optional != true)).length

  return (
    <Box 
      flexGrow={1}
      m={{xs: 0, sm: 2}}
      mt={{xs: 2, sm: 2}}
      mb={{xs: 2, sm: 2}}
      display="flex"
      justifyContent="center"
      alignItems="center">
      <Container maxWidth="lg" disableGutters>
      <Grid container spacing={2} gridAutoColumns={'3lf'} gridAutoFlow={"column"}>
        <Grid size={12}>
          <RadarCard>
            <Grid container padding={3} rowGap={2} >
              <Grid size={{xs: 12, sm: 10}} textAlign={'left'}>
                <Typography variant="h2" pr={2}>{protocol.studyUiConfig.portal.title}</Typography>
                <MarkdownContainer>
                  {protocol.studyUiConfig.portal.content}
                </MarkdownContainer>
              </Grid>
              <Grid size={{xs: 12, sm: 2}}  justifyItems={'flex-end'}>
                <Box display={'flex'} gap={2} alignItems={'center'} 
                    flexDirection={'column'} margin={'auto'} justifyContent={'center'}
                    height={'100%'}
                    >
                  <CircularProgressWithLabel thickness={2} size={80} variant='determinate' value={(numRequiredTasksComplete/numRequiredTasks) * 100}>
                    <Typography variant='subtitle2' textOverflow={'clip'}>{numRequiredTasksComplete} / {numRequiredTasks}</Typography>
                  </CircularProgressWithLabel>
                </Box>
              </Grid>
              <Grid size={12} textAlign={'left'}>               

              </Grid>
            </Grid>
          </RadarCard>
        </Grid>
        {items.map((card, i) => (
          <Grid size={{xs: 12, sm: 6, md: 4}} key={'task.'+i}>
            {card}
          </Grid>
        ))}
      </Grid>
      </Container>
    </Box>)
}