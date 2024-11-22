"use client";
import { useEffect } from "react";


export default function Page({ params }: { params: { studyId: string } }) {
    useEffect(() => {
        document.title = params.studyId ?? "Unknown Study";
    })
    return (
        <main>
            Verify page
        </main>
)}