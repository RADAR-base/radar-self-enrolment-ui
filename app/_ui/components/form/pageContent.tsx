"use client"
import { Box, Button, Container, Divider, Stack } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from 'next/navigation'
import { ArmtForm } from "@/app/_ui/components/form/form";
import { ArmtDefinition } from "@/app/_lib/armt/definition/definition.types";
import { schemaFromDefinition } from "@/app/_lib/armt/validation/parser";
import { RadarRedcapDefinition } from "@/app/_lib/armt/definition/redcap.types";
import fromRedcapDefinition from "@/app/_lib/armt/definition/fromRedcapDefinition";
import { withBasePath } from "@/app/_lib/util/links";

interface ArmtContentProps {
  studyId: string
  taskId: string
  redcapDef: RadarRedcapDefinition
}

export function ArmtContent({redcapDef, studyId, taskId}: ArmtContentProps) {

  const armtDef: ArmtDefinition = fromRedcapDefinition(redcapDef)
  const schema = schemaFromDefinition(armtDef)
  const router = useRouter()
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
        router.push('/' + studyId + '/portal') 
      } else {
        formik.setSubmitting(false)
      }
    }
  })

  const ControlButtons = (
    <Box 
      width={"100%"}
      position={'sticky'}
      bottom={0}
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
          <Button variant="contained" onClick={router.back}>Back</Button>
          <Button variant="contained" type={"submit"} disabled={(!formik.isValid) || formik.isSubmitting}>Submit</Button>
      </Box>
    </Box>
  )
  return (
    <Container sx={{
      paddingRight: 4,
      paddingLeft: 4,
      paddingTop: 3
    }}>
      <form onSubmit={formik.handleSubmit}>
        <Stack gap={4} margin={"auto"}>
          <ArmtForm definition={armtDef} values={formik.values} setFieldValue={formik.setFieldValue} errors={formik.errors}></ArmtForm>
          {ControlButtons}
        </Stack>
      </form>
    </Container>
  )
}
