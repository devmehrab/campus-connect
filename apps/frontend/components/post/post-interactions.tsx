"use client";

import { useState, useTransition } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { likePostAction } from "@/actions/post.actions";
import { cn } from "@/lib/utils";

interface PostInteractionsProps {
  postId: string;
  initialLikes: string[];
  currentUserId: string;
  commentCount: number;
}

export function PostInteractions({
  postId,
  initialLikes = [],
  currentUserId,
  commentCount,
}: PostInteractionsProps) {
  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [isPending, startTransition] = useTransition();

  const isLiked = likes.includes(currentUserId);

  const handleLike = () => {
    if (isPending) return;

    const updatedLikes = isLiked
      ? likes.filter((id) => id !== currentUserId)
      : [...likes, currentUserId];

    setLikes(updatedLikes);

    startTransition(async () => {
      const res = await likePostAction(postId);
      if (!res.success) {
        setLikes(initialLikes);
      }
    });
  };

  return (
    <div className="flex gap-6 text-sm text-muted-foreground font-medium border-b border-border/40 pb-4 mb-4 select-none">
      <button
        onClick={handleLike}
        disabled={isPending}
        className={cn(
          "flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-70",
          isLiked ? "text-primary hover:text-primary/90" : "hover:text-primary",
        )}
      >
        <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        <span>{likes.length} Likes</span>
      </button>

      <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
        <MessageCircle size={18} />
        <span>{commentCount} Comments</span>
      </div>
    </div>
  );
}
