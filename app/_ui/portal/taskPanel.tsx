"use client"
import { Box, Button, Container, Modal, Typography } from "@mui/material"
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
import { useRouter } from "next/navigation";


function FinishModal(props: {disabled: boolean, allComplete: boolean}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const router = useRouter()
  const finishStudy = () => {
    router.push('/')
  }
  return (
    <div>
      <Button onClick={props.allComplete ? finishStudy : handleOpen} disabled={props.disabled} variant='contained'>Finish</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: 400,
          maxWidth: 600,
          bgcolor: 'background.paper',
          borderRadius: 2,
          // border: '2px solid #000',
          boxShadow: 24,
          p: 4}}>
          <Typography id="modal-modal-title" variant="h2" component="h2">
            Study complete
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {"There are still optional tasks available.\nIf you would like to complete them, please press 'Back' and click on the cards still marked with 'Todo'. If not, please press 'Finish' to end the study."}
          </Typography>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} paddingTop={2}> 
            <Button onClick={handleClose} variant="contained">Back</Button>
            <Button onClick={finishStudy} variant="contained">Finish</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}


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
                <FinishModal disabled={numRequiredTasksComplete < numRequiredTasks} allComplete={numTasksComplete == numTasks}></FinishModal>
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