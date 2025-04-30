import { Button, Typography, Link, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { getOverrides, MuiMarkdown } from 'mui-markdown'
import Image from 'next/image'
import HoverPopover from './hoverPopover'
import NextLink from 'next/link'

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
          props: {
            'fullWidth': false
          }
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
            target: '_blank',
            component: NextLink
          }
        },
        table: {
          component: Table
        },
        tHead: {
          component: TableHead
        },
        tr: {
          component: TableRow
        },
        td: {
          component: TableCell
        },
        tbody: {
          component: TableBody
        },
      }}
      {...props}>
      {children}
    </MuiMarkdown>)
}