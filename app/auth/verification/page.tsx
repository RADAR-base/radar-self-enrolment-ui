"use client";
import { useEffect } from "react";


export default function Page({ params }: { params: { studyId: string } }) {
    useEffect(() => {
        document.title = params.studyId ?? "Unknown Study";
    })
    console.log("Loaded")
    return (
        <main>
            Verify page
        </main>
)}