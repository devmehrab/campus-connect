"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { usePDF } from "@react-pdf/renderer";
import { Loader2 } from "lucide-react";

// Pulls the PDF worker from unpkg so Next.js doesn't crash on build
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Bypassing the strict TypeScript check with 'any' to stop the usePDF hook from crashing the compiler
export default function PDFPreviewWrapper({ template }: { template: any }) {
  // Generates the PDF blob url in memory without an iframe
  const [instance, updateInstance] = usePDF({ document: template });
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Measure the container width so the PDF canvas perfectly scales on mobile
  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById("pdf-preview-container");
      if (container) {
        setContainerWidth(container.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Force generation update when user types in the form
  useEffect(() => {
    updateInstance(template);
  }, [template, updateInstance]);

  if (instance.loading) {
    return (
      <div className="flex h-full min-h-[60vh] w-full items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Generating Preview...
      </div>
    );
  }

  if (instance.error) {
    return (
      <div className="flex h-full min-h-[60vh] w-full items-center justify-center text-destructive">
        Failed to generate PDF.
      </div>
    );
  }

  return (
    <div
      id="pdf-preview-container"
      className="flex w-full justify-center overflow-hidden bg-white"
    >
      {instance.url && (
        <Document
          file={instance.url}
          loading={
            <div className="flex p-10 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }
          className="w-full flex justify-center"
        >
          <Page
            pageNumber={1}
            // Scales the canvas to exactly fit the container width
            width={containerWidth ? containerWidth : undefined}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-sm"
          />
        </Document>
      )}
    </div>
  );
}
