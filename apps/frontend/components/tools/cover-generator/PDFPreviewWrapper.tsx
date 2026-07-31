"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted/20 text-muted-foreground text-sm">
        Generating PDF preview...
      </div>
    ),
  },
);

interface PDFPreviewWrapperProps {
  template: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

export default function PDFPreviewWrapper({
  template,
}: PDFPreviewWrapperProps) {
  // Extra safety net: Ensure we only render the viewer after the component has mounted on the client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-[700px] w-full animate-pulse rounded-md bg-muted/50 border border-border flex items-center justify-center">
        <span className="text-muted-foreground">Loading preview engine...</span>
      </div>
    );
  }

  return (
    <div className="h-[700px] w-full overflow-hidden rounded-md border border-border shadow-sm bg-white">
      <DynamicPDFViewer
        showToolbar={true}
        style={{ width: "100%", height: "100%", border: "none" }}
      >
        {template}
      </DynamicPDFViewer>
    </div>
  );
}
