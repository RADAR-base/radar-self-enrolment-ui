import { Button, Typography, Link } from '@mui/material'
import { getOverrides, MuiMarkdown } from 'mui-markdown'
import Image from 'next/image'
import HoverPopover from './hoverPopover'

interface MarkdownContainerProps {
  children?: string
}



export function MarkdownContainer({children, ...props }: MarkdownContainerProps) {
  return (
    <MuiMarkdown 
      overrides={{
        ...getOverrides({}),
        HoverPopover: {
          component: HoverPopover
        },
        Image: {
          component: Image,
          props: {
            style: {
              'maxWidth': '100%'
            }
          }
        },
        img: {
          props: {
            style: {
              'maxWidth': '100%'
            }
          }
        },
        button: {
          component: Button,
        },
        h5: {
          component: Typography,
          props: {
            variant: 'subtitle1'
          }
        },
        h6: {
          component: Typography,
          props: {
            variant: 'subtitle2'
          }
        },
        a: {
          component: Link,
          props: {
            underline: 'always',
            rel: 'noreferrer',
            target: '_blank'
          }
        },
      }}
      {...props}>
      {children}
    </MuiMarkdown>)
}