import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { getYesNoOnChangeHandler, YesNoButton, YesNoField } from "../components/fields/yesno";
import { LoremIpsum } from "../debug/lorem";
import { FormikValues, FormikProps } from "formik";

interface EnrolmentEligabilityProps {
  formik: FormikProps<any>
  title?: string
  description?: string
  items?: any
}

export function EnrolmentEligability(props: EnrolmentEligabilityProps) {
  const formik = props.formik
  const title = props.title ? props.title : 'Eligability'
  const description = props.description ? props.description : 'Description'
  const onChange = (event: any, value: boolean) => {
    console.log(event.target.id)
    formik.validateField(event.target.id).then(
      (o) => console.log(o)
    )
    return getYesNoOnChangeHandler(formik)(event, value)
  }
  return (
    <Stack spacing={2} alignItems="inherit">
      <Typography variant="h2" align="left">{title}</Typography>
      <h2> Hi </h2>
      <Typography variant="subtitle1" align="left" paddingBottom={2}>{description}</Typography>
        <YesNoField label={'Eligability criteria 1'}
                    description="description"
                    value={formik.values.eligability.criteria1}
                    onChange={onChange}
                    id='eligability.criteria1'/>
      {((formik.values.eligability.criteria1 != undefined) && <Divider />)}
      {((formik.values.eligability.criteria1 != undefined) && 
        <YesNoField label={'Eligability criteria 2'}
                    description={LoremIpsum.slice(0, 200)}
                    value={formik.values.eligability.criteria2}
                    onChange={getYesNoOnChangeHandler(formik)}
                    id='eligability.criteria2'
                    disabled={formik.values.eligability.criteria1 == undefined}
                    helperText={""}
                    />
      )}
      {((formik.values.eligability.criteria2 != undefined) && <Divider />)}
      {((formik.values.eligability.criteria2 != undefined) && 
        <YesNoField label={'Eligability criteria 2'}
                    description="description"
                    value={formik.values.eligability.criteria3} 
                    onChange={getYesNoOnChangeHandler(formik)}
                    id='eligability.criteria3'
                    disabled={formik.values.eligability.criteria2 == undefined}/>
      )}
    </Stack>
)}