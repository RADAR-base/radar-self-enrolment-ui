import { Button, Typography, Link } from '@mui/material'
import { getOverrides, MuiMarkdown } from 'mui-markdown'

interface MarkdownContainerProps {
  children?: string
}

export function MarkdownContainer({children, ...props }: MarkdownContainerProps) {
  return (
    <MuiMarkdown 
      overrides={{
        ...getOverrides({}),
        img: {
          component: 'img',
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
            rel: 'noreferrer'
          }
        }
      }}
      {...props}>
      {children}
    </MuiMarkdown>)
}