"use client"
import { withBasePath } from "@/app/_lib/util/links";
import React, { useMemo } from "react";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://raw.githubusercontent.com",
];

function getAllowedOrigins(extraOrigins: string[] = []): string[] {
  const fromEnv = (process.env.NEXT_PUBLIC_PDF_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...fromEnv, ...extraOrigins])];
}

export type PdfViewerProps = {
  fileUrl: string; // Same-origin path or absolute http(s) URL to the PDF
  allowedOrigins?: string[]; // Additional allowed file origins beyond same-origin
  viewerHash?: string; // Initial hash settings for PDF.js viewer: e.g. "zoom=page-fit" or "page=3&zoom=page-width"
  height?: string | number; // e.g. "100vh", 800
  className?: string;
  viewerPath?: string;
};

const PdfViewer: React.FC<PdfViewerProps> = ({
  fileUrl,
  allowedOrigins = [],
  viewerHash = "zoom=page-width",
  height = "80vh",
  className,
  viewerPath = withBasePath("/pdfjs/web/viewer.html"),
}) => {
  const src = useMemo(() => {
    const encodedFile = encodeURIComponent(withBasePath(fileUrl));
    const encodedAllowedOrigins = encodeURIComponent(
      getAllowedOrigins(allowedOrigins).join(",")
    );
    const hash = viewerHash ? `#${viewerHash}` : "";
    return `${viewerPath}?file=${encodedFile}&allowedOrigins=${encodedAllowedOrigins}${hash}`;
  }, [fileUrl, allowedOrigins, viewerHash, viewerPath]);


  return (
    <iframe
      title="PDF viewer"
      src={src}
      style={{ border: 0, width: "100%", height }}
      className={className}
      allow="clipboard-write"
    />
  );
};


export default PdfViewer;