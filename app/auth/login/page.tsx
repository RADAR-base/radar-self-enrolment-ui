"use client";
import Login from '@/app/_ui/auth/login';
import { Card } from "@mui/material";
import { useSearchParams } from 'next/navigation'

export default function Page() {
    return <Card><Login /></Card>
}
