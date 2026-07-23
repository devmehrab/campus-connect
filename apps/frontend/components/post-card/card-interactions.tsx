"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Heart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { likePostAction } from "@/actions/post.actions";
import { CommentSection } from "../feed/comment-section";

interface InteractionsProps {
  postId: string;
  initialLikeCount: number;
  initialCommentCount: number;
  hasLiked?: boolean;
}

export function CardInteractions({
  postId,
  initialLikeCount,
  initialCommentCount,
  hasLiked,
}: InteractionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showComments, setShowComments] = useState(false);

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      await likePostAction(postId);
    });
  };

  return (
    <>
      <CardFooter className="flex gap-6 border-t border-border/50 pt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isPending}
          className={cn(
            "gap-2 font-mono transition-all",
            isPending && "opacity-50 cursor-not-allowed",
            hasLiked
              ? "text-primary hover:text-primary hover:bg-primary/10"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary",
          )}
        >
          <Heart
            size={18}
            className={cn(
              isPending && "animate-pulse",
              hasLiked && "fill-primary text-primary",
            )}
          />
          {initialLikeCount} <span className="hidden sm:inline">Likes</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowComments(!showComments);
          }}
          className={cn(
            "gap-2 font-mono transition-all",
            showComments
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-primary hover:bg-primary/10",
          )}
        >
          <MessageSquare size={18} />
          {initialCommentCount}{" "}
          <span className="hidden sm:inline">Comments</span>
        </Button>
      </CardFooter>
      {showComments && <CommentSection postId={postId} />}
    </>
  );
}
