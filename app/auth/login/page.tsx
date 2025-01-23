"use client"
import { withBasePath } from '@/app/_lib/util/links';
import Login from '@/app/_ui/auth/login';
import { Box, Card } from "@mui/material";
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect_to') ?? withBasePath('/')
  return (
  <Card>
    <Box m={4}>
      <Login redirectTo={redirectTo} />
    </Box>
  </Card>
)
}
