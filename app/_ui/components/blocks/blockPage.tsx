import { Box } from "@mui/material"
import { Block, IBlock } from "./block"

interface BlockPageProps {
  blockParams: IBlock[]
}

export function BlockPage({ blockParams: items }: BlockPageProps): React.ReactNode {
  return  (
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
    </Box>
  )
}