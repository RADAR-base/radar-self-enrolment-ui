"use client"
import { withBasePath } from "@/app/_lib/util/links";
import React, { useMemo } from "react";


export type PdfViewerProps = {
fileUrl: string; // Absolute or same-origin relative URL to the PDF
viewerHash?: string; // Initial hash settings for PDF.js viewer: e.g. "zoom=page-fit" or "page=3&zoom=page-width" */
height?: string | number; // e.g. "100vh", 800
className?: string;
viewerPath?: string;
};


const PdfViewer: React.FC<PdfViewerProps> = ({
  fileUrl,
  viewerHash = "zoom=page-fit",
  height = "80vh",
  className,
  viewerPath = withBasePath("/pdfjs/web/viewer.html"),
}) => {
  // Build the viewer src (either CDN viewer or self-hosted viewer)
  const src = useMemo(() => {
    const encoded = encodeURIComponent(withBasePath(fileUrl));
    const hash = viewerHash ? `#${viewerHash}` : "";
    return `${viewerPath}?file=${encoded}${hash}`;
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