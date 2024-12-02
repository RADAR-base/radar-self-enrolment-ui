"use client"
import Button, { ButtonProps } from '@mui/material/Button';
import NextLink from 'next/link'

export default function NextButton(props: ButtonProps & {href: string}) {
  return (
    <NextLink href={props.href} passHref legacyBehavior>
      <Button {...props}>
          {props.children}
      </Button>
    </NextLink>
  )
}