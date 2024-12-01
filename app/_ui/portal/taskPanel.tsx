"use client"
import { Box, Button, Container, Typography } from "@mui/material"
import { RadarTaskCard, RadarTaskCardProps } from '@/app/_ui/components/portal/taskCard';
import Grid from '@mui/material/Grid2';
import { ArmtProtocol, StudyProtocol } from "@/app/_lib/study/protocol";
import { ArmtStatus } from "@/app/api/study/[studyId]/tasks/status/route";
import { withBasePath } from "@/app/_lib/util/links";
import { useEffect } from "react";
import React from "react";
import { RadarCard } from "../components/base/card";
import { CircularProgressWithLabel } from "../components/base/circularProgress";
import { MarkdownContainer } from "../components/base/markdown";


async function fetchTaskStatus(studyId: string) {
  let resp = await fetch(withBasePath('/api/study/' + studyId + '/tasks/status'))
  let status = await resp.json()
  return status as {[key: string]: ArmtStatus}
}

interface TaskPanel {
  // studyId: string
  // armtProtocols: ArmtProtocol[]
  protocol: StudyProtocol
}

export function TaskPanel(props: TaskPanel) {

  const [armtStatuses, setArmtStatuses] = React.useState<{[key: string]: ArmtStatus} | undefined>(undefined)

  const studyId = props.protocol.studyId
  const armtProtocols = props.protocol.protocols

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
    <Box sx={{ flexGrow: 1, margin: 2}} 
      display="flex"
      justifyContent="center"
      alignItems="center">
      <Container maxWidth="lg" disableGutters>
      <Grid container spacing={2} gridAutoColumns={'3lf'} gridAutoFlow={"column"}>
        <Grid size={12}>
          <RadarCard>
            <Box display={'flex'}
                justifyContent={'space-between'}
                textAlign={'left'} alignContent={'center'}
                alignItems={'Center'}
                padding={2}>
              <Box display='flex' flexDirection='column'>
                <Typography variant="h2">{props.protocol.studyUiConfig.portal.title}</Typography>
                <MarkdownContainer>
                  {props.protocol.studyUiConfig.portal.content}
                </MarkdownContainer>
              </Box>
              <Box display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'}>
                <CircularProgressWithLabel thickness={2} size={80} variant='determinate' value={(numRequiredTasksComplete/numRequiredTasks) * 100}>
                  <Typography variant='subtitle2'>{numRequiredTasksComplete} / {numRequiredTasks}</Typography>
                </CircularProgressWithLabel>
                <Button variant="contained">Finish</Button>
              </Box>
            </Box>
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