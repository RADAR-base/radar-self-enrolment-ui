import { withBasePath } from "@/app/_lib/util/links";
import { Container, Paper, Stack, Button, Typography, Box, Link, Divider } from "@mui/material";

export type FooterItem = {
  text: string,
  href?: string
}

export type FooterColumn = {
  title: string;
  items: FooterItem[];
}

export interface FooterProps {
  columns: FooterColumn[];
  copyrightText: string;
}

export function Footer(props: FooterProps) {
  return (
    <Container
      maxWidth={false}
      disableGutters={true}
      sx={{        
        marginTop: 'auto',
        width: '100%'
      }}
    >
      <Divider style={{width: '100%'}}/>
      <Box sx={{
        bgcolor:' white',
        width: 1
      }}>
      <Box sx={{
        padding: 2,
        gap: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 'lg',
        margin: 'auto'
      }}>
        <Box sx={{
          gap: 2,
          width: '100%',
          justifyContent: 'space-evenly',
          display: 'flex',
          flexDirection: {'xs': 'column', 'sm': 'row'},
          alignItems: 'center'
        }}>
          {props.columns.map(
            (col, i) => (
              <Stack key={i} sx={{gap: 1}} flex={1} paddingLeft={2} paddingRight={2} alignItems={{xs: "center", sm: "start"}}>
                <Typography variant="h3">{col.title}</Typography>
                  {col.items?.map(
                    (item, j) => (
                      <Link
                        href={item.href && withBasePath(item.href)}
                        underline='none'
                        key={j}
                      >
                        <Typography variant='body1'>{item.text}</Typography>
                      </Link>
                    )
                  )}
              </Stack>
            )
          )}
        </Box>
        {props.copyrightText && <Divider style={{width: '100%', maxWidth: 'lg'}}/>}
        {props.copyrightText && <Typography variant='subtitle1'>{props.copyrightText}</Typography>}
      </Box></Box>
    </Container>
  )
}