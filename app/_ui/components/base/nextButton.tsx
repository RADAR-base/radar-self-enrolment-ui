"use client"
import { withBasePath } from '@/app/_lib/util/links';
import Button, { ButtonProps } from '@mui/material/Button';
import NextLink from 'next/link'

export default function NextButton(props: ButtonProps & {href: string}) {
  return (
    // Next's Link legacyBehaviour is deprecated and causes an error, but the behaviour is not possible without it
    // It does currently work (Next 15.3). See https://github.com/vercel/next.js/discussions/67987
    // <NextLink href={props.href} passHref legacyBehavior>
      <Button {...props} href={withBasePath(props.href)}>
          {props.children}
      </Button>
    // </NextLink>
  )
}