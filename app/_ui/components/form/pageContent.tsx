"use client"
import { Box, Button, Container, Divider, Stack } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from 'next/navigation'
import { ArmtForm } from "@/app/_ui/components/form/form";
import { ArmtDefinition } from "@/app/_lib/armt/definition/definition.types";
import { schemaFromDefinition } from "@/app/_lib/armt/validation/parser";
import { RadarRedcapDefinition } from "@/app/_lib/armt/definition/redcap.types";
import fromRedcapDefinition from "@/app/_lib/armt/definition/fromRedcapDefinition";

interface ArmtContentProps {
  redcapDef: RadarRedcapDefinition
}

export function ArmtContent({redcapDef}: ArmtContentProps) {
  const armtDef: ArmtDefinition = fromRedcapDefinition(redcapDef)
  const schema = schemaFromDefinition(armtDef)
  const router = useRouter()
  const formik = useFormik({
    validateOnChange: true,
    validateOnMount: true,
    validateOnBlur: true,
    initialValues: {},
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values)
    },
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
          <Button variant="contained" type={"submit"} disabled={!formik.isValid}>Submit</Button>
      </Box>
    </Box>
  )
  return (
    <Container sx={{
      paddingRight: 4,
      paddingLeft: 4,
      paddingTop: 4
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
