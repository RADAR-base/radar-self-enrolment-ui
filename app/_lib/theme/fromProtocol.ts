import { createTheme, Theme } from "@mui/material";
import { StudyProtocol } from "../study/protocol";

export default async function themeFromProtocol(protocol: StudyProtocol): Promise<Theme> {
  return createTheme(protocol.studyUiConfig.materialTheme)  
}