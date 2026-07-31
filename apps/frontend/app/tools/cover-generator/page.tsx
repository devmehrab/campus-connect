"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FileText, FlaskConical, Download, Eye } from "lucide-react";

// Shadcn UI components (Removed Tabs entirely)
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// The modular components
import AssignmentForm from "@/components/tools/cover-generator/forms/AssignmentForm";
import LabReportForm from "@/components/tools/cover-generator/forms/LabReportForm";
import PDFPreviewWrapper from "@/components/tools/cover-generator/PDFPreviewWrapper";
import AssignmentCover from "@/components/tools/cover-generator/templates/AssignmentCover";
import LabReportCover from "@/components/tools/cover-generator/templates/LabReportCover";

// Dynamically import PDFDownloadLink
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <Button disabled variant="outline" className="w-full sm:w-auto">
        <Download className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    ),
  },
);

// Custom hook fixed for Hydration
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

// Reusable component for the Preview and Download logic
function PreviewSection({
  template,
  fileName,
}: {
  template: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  fileName: string;
}) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Live Preview
        </h3>
        <PDFDownloadLink document={template} fileName={fileName}>
          {/* @ts-ignore */}
          {({ loading }) => (
            <Button disabled={loading} variant="default" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Download PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
      <PDFPreviewWrapper template={template} />
    </div>
  );
}

export default function CoverGeneratorPage() {
  // Simple React state to replace Shadcn Tabs
  const [activeMode, setActiveMode] = useState<"assignment" | "lab-report">(
    "assignment",
  );

  const [assignmentData, setAssignmentData] = useState({});
  const [labReportData, setLabReportData] = useState({});

  const isDesktop = useIsDesktop();

  // Show a quick skeleton while determining screen size (prevents mobile layout explosions)
  if (isDesktop === null) {
    return (
      <div className="container mx-auto max-w-7xl p-4 md:p-8 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded-md mb-4"></div>
        <div className="h-4 w-96 bg-muted rounded-md mb-8"></div>
        <div className="h-[600px] w-full bg-muted rounded-xl"></div>
      </div>
    );
  }

  // Determine which template and data to use based on the custom toggle
  const currentTemplate =
    activeMode === "assignment" ? (
      <AssignmentCover data={assignmentData} />
    ) : (
      <LabReportCover data={labReportData} />
    );

  const currentFileName =
    activeMode === "assignment"
      ? "Assignment_Cover_Page.pdf"
      : "Lab_Report_Cover_Page.pdf";

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Cover Page Generator
        </h1>
        <p className="text-muted-foreground">
          Fill in your details to instantly generate and download your cover
          page in PDF format.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Made by{" "}
          <a
            href="https://www.facebook.com/dev.mehrabhossain"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
          >
            Mehrab Hossain
          </a>
        </p>
      </div>

      {/* Custom Lightweight Toggle (Replaces Shadcn Tabs) */}
      <div className="flex w-full max-w-md p-1 bg-muted rounded-lg mb-8">
        <button
          onClick={() => setActiveMode("assignment")}
          className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
            activeMode === "assignment"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="mr-2 h-4 w-4" />
          Assignment
        </button>
        <button
          onClick={() => setActiveMode("lab-report")}
          className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
            activeMode === "lab-report"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FlaskConical className="mr-2 h-4 w-4" />
          Lab Report
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* LEFT SIDE: The Form */}
        <div className="flex flex-col gap-6">
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader>
              <CardTitle>
                {activeMode === "assignment"
                  ? "Assignment Details"
                  : "Lab Report Details"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your university details for the cover page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeMode === "assignment" ? (
                <AssignmentForm
                  data={assignmentData}
                  onChange={setAssignmentData}
                />
              ) : (
                <LabReportForm
                  data={labReportData}
                  onChange={setLabReportData}
                />
              )}
            </CardContent>
          </Card>

          {/* Mobile Only: Button to open Preview Sheet */}
          {!isDesktop && (
            <Sheet>
              <SheetTrigger
                className={buttonVariants({
                  size: "lg",
                  className: "w-full",
                })}
              >
                <Eye className="mr-2 h-5 w-5" />
                Preview & Download PDF
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-[90dvh] overflow-y-auto px-4 pb-8 sm:px-6"
              >
                <SheetHeader className="mb-4 text-left">
                  <SheetTitle>
                    {activeMode === "assignment"
                      ? "Assignment Preview"
                      : "Lab Report Preview"}
                  </SheetTitle>
                </SheetHeader>
                <PreviewSection
                  template={currentTemplate}
                  fileName={currentFileName}
                />
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* RIGHT SIDE (Desktop Only): Inline Preview Card */}
        {isDesktop && (
          <Card className="bg-card text-card-foreground border-border flex flex-col p-6 bg-muted/30 h-fit">
            <PreviewSection
              template={currentTemplate}
              fileName={currentFileName}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
