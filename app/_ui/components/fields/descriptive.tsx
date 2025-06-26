import { Box, FormControl, Typography } from "@mui/material";
import { IDescriptiveItem } from "@/app/_lib/armt/definition/field.interfaces";
import { MarkdownContainer } from "@/app/_ui/components/base/markdown";

interface ArmtDescriptiveFieldProps extends IDescriptiveItem {
  disabled?: boolean,
  key?: string,
  color? : 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning'
}

export function ArmtDescriptiveField({title, content}: ArmtDescriptiveFieldProps) {
  return (
    <FormControl>
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"} gap={1}>
        {title && <Typography variant="h4">{title}</Typography>}
        <MarkdownContainer>{content}</MarkdownContainer>       
      </Box>
    </FormControl>
  )
}