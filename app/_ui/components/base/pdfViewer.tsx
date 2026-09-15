"use client"
import { resolveResourceUrl } from "@/app/_lib/util/resources";
import { withBasePath } from "@/app/_lib/util/links";
import React, { useMemo } from "react";

export type PdfViewerProps = {
  fileUrl: string; // GitHub raw URL, /study/{id}/resources/... path, or same-origin path
  allowedOrigins?: string[]; // Kept for backwards compatibility but no longer needed
  viewerHash?: string; // Initial hash settings for PDF.js viewer: e.g. "zoom=page-fit" or "page=3&zoom=page-width"
  height?: string | number; // e.g. "100vh", 800
  className?: string;
  viewerPath?: string;
};

const PdfViewer: React.FC<PdfViewerProps> = ({
  fileUrl,
  viewerHash = "zoom=page-width",
  height = "80vh",
  className,
  viewerPath = withBasePath("/pdfjs/web/viewer.html"),
}) => {
  const src = useMemo(() => {
    const resolvedUrl = resolveResourceUrl(fileUrl);
    const encodedFile = encodeURIComponent(resolvedUrl);
    const allowedOrigins = encodeURIComponent(window.location.origin);
    const hash = viewerHash ? `#${viewerHash}` : "";
    return `${viewerPath}?file=${encodedFile}&allowedorigins=${allowedOrigins}${hash}`;
  }, [fileUrl, viewerHash, viewerPath]);


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
