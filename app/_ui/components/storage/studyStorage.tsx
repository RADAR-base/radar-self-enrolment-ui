"use client";
import { useEffect } from "react";

export default function StudyStorage({ studyId }: { studyId: string }) {
  useEffect(() => {
    if (studyId) {
      localStorage.setItem("studyId", studyId);
    }
  }, [studyId]);

  return null; 
}
