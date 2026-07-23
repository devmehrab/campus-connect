"use client";

import { useRouter } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import renderContentWithLinks from "../shared/render-links";
import { IPost } from "./card-main";

export function CardContentView({ post }: { post: IPost }) {
  const router = useRouter();

  return (
    <CardContent
      onClick={() => router.push(`/posts/${post._id}`)}
      className="pb-4 space-y-3 w-full min-w-0 cursor-pointer"
    >
      <p className="text-foreground/90 text-[15px] leading-relaxed font-sans whitespace-pre-wrap break-words [word-break:break-word] min-w-0">
        {renderContentWithLinks(post.content)}
      </p>

      {post.images && post.images.length > 0 && (
        <div
          className={cn(
            "grid gap-2 overflow-hidden rounded-xl border border-border/50",
            post.images.length === 1 ? "grid-cols-1" : "grid-cols-2",
          )}
        >
          {post.images.map((img, idx) => (
            <div
              key={idx}
              className={cn(
                "relative bg-muted overflow-hidden group",
                post.images!.length === 3 && idx === 0
                  ? "col-span-2 aspect-video"
                  : "aspect-square",
                post.images!.length === 1 ? "aspect-video" : "",
              )}
            >
              <img
                src={img}
                alt={`Post attachment ${idx + 1}`}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}
    </CardContent>
  );
}
