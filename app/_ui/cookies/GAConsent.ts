// app/consent.ts (Client util)
"use client";

export function grantConsent() {
  if (typeof window === "undefined") {
    return;
  }
  window.gtag?.("consent", "update", {
    ad_storage: "denied",
    analytics_storage: "granted",
  });
}

export function denyConsent() {
  if (typeof window === "undefined") return;
  window.gtag?.("consent", "update", {
    ad_storage: "denied",
    analytics_storage: "denied",
  });
}

// Optional TS help
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}