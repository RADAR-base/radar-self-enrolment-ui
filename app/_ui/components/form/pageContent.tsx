"use client"
import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from 'next/navigation'
import { ArmtForm } from "@/app/_ui/components/form/form";
import { ArmtDefinition } from "@/app/_lib/armt/definition/definition.types";
import { schemaFromDefinition } from "@/app/_lib/armt/validation/parser";
import { RadarRedcapDefinition } from "@/app/_lib/armt/definition/redcap.types";
import fromRedcapDefinition from "@/app/_lib/armt/definition/fromRedcapDefinition";
import { withBasePath } from "@/app/_lib/util/links";
import { sendGAEvent } from "@next/third-parties/google";
import React, { useEffect, useState } from "react";
import { InView } from 'react-intersection-observer';
import { TaskConfirmDialog } from "./confirmDialog";

function ControlButtons(props: {
  submitDisabled: boolean
  onSubmit: () => void
}) {
const router = useRouter()
return (
  <InView threshold={[1]}>
    {({ inView, ref, entry }) => (
      <Box 
      ref={ref}
      width={"100%"}
      position={'sticky'}
      bottom={-1}
      zIndex={1000}>
        <Divider />
        <Box
          paddingTop={4}
          paddingBottom={4}
          display={"flex"}
          alignItems={'center'}
          sx={{ 
            justifyContent: 'space-between', 
            background: 'white'
          }}
          >
            <Button variant="contained" onClick={() => router.back()}>Back</Button>
            { (entry?.intersectionRatio ?? 1) < 1 ? "Scroll down" : "" }
            <Button variant="contained" onClick={props.onSubmit} disabled={props.submitDisabled}>Submit</Button>
        </Box>
      </Box>
    )}
  </InView>
  )
}

interface ArmtContentProps {
  studyId: string
  taskId: string
  redcapDef: RadarRedcapDefinition
}

export function ArmtContent({redcapDef, studyId, taskId}: ArmtContentProps) {
  const armtDef: ArmtDefinition = fromRedcapDefinition(redcapDef)
  const schema = schemaFromDefinition(armtDef)
  const router = useRouter()
  const [submitDialogOpen, setSubmitDialogOpen] = useState<boolean>(false);
  const [backDialogOpen, setBackDialogOpen] = useState<boolean>(false);

  const formik = useFormik({
    validateOnChange: true,
    validateOnMount: true,
    validateOnBlur: false,
    initialValues: {},
    validationSchema: schema,
    onSubmit: async (values) => {
      let resp = await fetch(
        withBasePath('/api/study/' + studyId + '/tasks/' + taskId),
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(values)
        }
      )
      if (resp.ok) {
        sendGAEvent('event', 'study_task', {
          'study_id': studyId,
          'task_id': taskId,
          'task_status': 'submitted'
        })
        router.push('/' + studyId + '/portal')
        router.refresh()
      } else {
        sendGAEvent('event', 'study_task', {
          'study_id': studyId,
          'task_id': taskId,
          'task_status': 'submit_failed'
        })
        formik.setSubmitting(false)
      }
    }
  })

  useEffect(() => {
    sendGAEvent('event', 'study_task', {
      'study_id': studyId,
      'task_id': taskId,
      'task_status': 'start'
    })

    if (history.state) {
      formik.setValues({...formik.values, ...history.state['task_answers']})
    }

    return () => {
      // window.removeEventListener('popstate', onPopState);
      // window.removeEventListener('beforeunload', handleBeforeUnload);

    };
  }, [])

  const setValue = (field: string, value: any, shouldValidate?: boolean) => {
    formik.setFieldValue(field, value, shouldValidate)
    if (history) {
      var task_answers = {...history.state['task_answers'], [field]: value}
      history.replaceState({...history.state, 'task_answers': task_answers}, '')
    }
  }

  return (
    <React.Fragment>
      <Container sx={{
        paddingRight: 4,
        paddingLeft: 4,
        paddingTop: 3
      }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack gap={4} margin={"auto"}>
            <ArmtForm definition={armtDef} values={formik.values} setFieldValue={setValue} errors={formik.errors}></ArmtForm>
            <ControlButtons 
              onSubmit={() => {setSubmitDialogOpen(true)}}
              submitDisabled={(!formik.isValid) || formik.isSubmitting} 
            />
          </Stack>
        </form>
      </Container>
      <TaskConfirmDialog 
        title={"Are you sure you want to complete this task?"}
        onConfirm={() => {
          setSubmitDialogOpen(false)
          formik.submitForm()
        }} 
        onReject={() => {
          setSubmitDialogOpen(false)
        }}
        open={submitDialogOpen}
      >
        <React.Fragment>
          <Typography>
            Are you sure you want to send in your answers as they are?
          </Typography>
          <Typography>
            Once submitted, you will not be able to change them.
          </Typography>
        </React.Fragment>
      </TaskConfirmDialog>
    </React.Fragment>
  )
}
