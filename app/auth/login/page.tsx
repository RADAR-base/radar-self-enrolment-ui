"use client"
import { withBasePath } from '@/app/_lib/util/links';
import Login from '@/app/_ui/auth/login';
import { Card } from "@mui/material";
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect_to') ?? withBasePath('/')

    return <Card>
              <Login redirectTo={redirectTo} />
            </Card>
}
