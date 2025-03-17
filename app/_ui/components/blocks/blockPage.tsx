import { Box, GlobalStyles } from "@mui/material"
import { Block, IBlock } from "./block"
import React from "react"

interface BlockPageProps {
  blockParams: IBlock[]
}

export function BlockPage({ blockParams: items }: BlockPageProps): React.ReactNode {
  return  (
    <React.Fragment>      
      {/* <GlobalStyles styles={{
        body: { backgroundColor: "white"},
      }} /> */}
      <Box 
            display="flex"
            justifyContent={{"sm": "left", "md": "center"}}
            alignItems={{"sm": "left", "md": "center"}}
            flexDirection="column"
            maxWidth={"100%"}
            gap={0} // {{xs: 0, sm: 0}}
            padding={0} // {{xs: 0, sm: 0}}
            >
        {items.map((item, i) => <Block {...item} key={i}/>)}
        <Box display='flex' sx={{background: 'white', height: '100%'}}></Box>
      </Box>
    </React.Fragment>
  )
}