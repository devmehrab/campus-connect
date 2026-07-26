"use client";

import renderContentWithLinks from "@/components/shared/render-links";

export function PostContent({ content }: { content: string }) {
  return (
    <p className="text-foreground text-[17px] leading-relaxed whitespace-pre-wrap break-words [word-break:break-word] min-w-0">
      {renderContentWithLinks(content)}
    </p>
  );
}
