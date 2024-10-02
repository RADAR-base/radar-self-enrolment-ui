import { Stack, Typography } from "@mui/material";
import React from "react";
import { MarkdownContainer } from "../components/base/markdown";

const md = `## Hello World
### h3
#### h4
##### subtitle1
###### subtitle2

---

An example link [Duck Duck Go](https://duckduckgo.com).

![A wiki image](https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png)

A list:
- One
- Two
- Three

<br />
<button name="button" href="https://google.com" variant="contained" fullWidth>Click me</button>

<br /><br />
<iframe width="100%" height="500" src="http://www.youtube.com/embed/N4xV2RIlMi4?rel=0&amp;controls=0&amp;showinfo=0" frameborder="1"></iframe>
`


interface EnrolmentStudyInformationProps {
  title?: string
  content?: string
}

export function EnrolmentStudyInformation(props: EnrolmentStudyInformationProps) {
  const title = props.title ? props.title : 'Study Information'

  return (
    <Stack spacing={4} alignItems="inherit" textAlign={"left"}>
      <Typography variant="h2">{title}</Typography>
      <MarkdownContainer>{props.content}</MarkdownContainer>
    </Stack>
)}