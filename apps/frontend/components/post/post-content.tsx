"use client";

import renderContentWithLinks from "@/components/shared/render-links";

export function PostContent({ content }: { content: string }) {
  return (
    <p className="text-foreground text-[17px] leading-relaxed whitespace-pre-wrap">
      {renderContentWithLinks(content)}
    </p>
  );
}
