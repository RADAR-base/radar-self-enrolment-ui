import { Box } from "@mui/material"
import { Block, IBlock } from "./block"

interface BlockPageProps {
  blockParams: IBlock[]
}

export function BlockPage({ blockParams: items }: BlockPageProps): React.ReactNode {
  return  (
    <Box sx={{ flexGrow: 1}}
          display="flex"
          justifyContent={{"sm": "left", "md": "center"}}
          alignItems={{"sm": "left", "md": "center"}}
          flexDirection="column"
          maxWidth={"100%"}
          gap={{xs: 0, sm: 2}}
          padding={{xs: 0, sm: 2}}>
      {items.map((item, i) => <Block {...item} key={i}/>)}
    </Box>
  )
}