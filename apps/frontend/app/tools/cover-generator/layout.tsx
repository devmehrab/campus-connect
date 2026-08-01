import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cover Page Generator",
  description:
    "Assignment and lab report cover pages generator for BUP CSE students.",
};

export default function CoverGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
