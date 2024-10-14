"use client";
import Login from '@/app/_ui/auth/login';
import { Card } from "@mui/material";
import { useSearchParams } from 'next/navigation'

export default function Page() {
    const params = useSearchParams()
    const loginChallenge = params.get('login_challenge') ?? undefined
    return <Card><Login loginChallenge={loginChallenge} /></Card>
}
