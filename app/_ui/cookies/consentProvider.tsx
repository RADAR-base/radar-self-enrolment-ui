"use client";

import { useEffect } from "react";
import { grantConsent, denyConsent } from "./GAConsent";

interface ConsentProviderProps { initialGranted: boolean };

export default function ConsentProvider({ initialGranted }: ConsentProviderProps) {
  useEffect(() => {
    if (initialGranted) {
      grantConsent();
    } else {
      denyConsent();
    }
  }, [initialGranted]);

  return null;
}