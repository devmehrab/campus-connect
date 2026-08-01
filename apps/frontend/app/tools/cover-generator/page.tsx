"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { FileText, FlaskConical, Download } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import AssignmentForm from "@/components/tools/cover-generator/forms/AssignmentForm";
import LabReportForm from "@/components/tools/cover-generator/forms/LabReportForm";
import AssignmentCover from "@/components/tools/cover-generator/templates/AssignmentCover";
import LabReportCover from "@/components/tools/cover-generator/templates/LabReportCover";

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

const PDFPreviewWrapper = dynamic(
  () => import("@/components/tools/cover-generator/PDFPreviewWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[60vh] w-full items-center justify-center text-muted-foreground">
        Loading Preview Engine...
      </div>
    ),
  },
);

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
      <div className="min-h-[60vh] w-full border rounded-md overflow-hidden bg-white">
        <PDFPreviewWrapper template={template} />
      </div>
    </div>
  );
}

export default function CoverGeneratorPage() {
  const [activeMode, setActiveMode] = useState<"assignment" | "lab-report">(
    "assignment",
  );

  const [assignmentData, setAssignmentData] = useState({});
  const [labReportData, setLabReportData] = useState({});

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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="bg-card text-card-foreground border-border h-fit">
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
              <LabReportForm data={labReportData} onChange={setLabReportData} />
            )}
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border flex flex-col p-6 bg-muted/30 h-fit">
          <PreviewSection
            template={currentTemplate}
            fileName={currentFileName}
          />
        </Card>
      </div>
    </div>
  );
}
