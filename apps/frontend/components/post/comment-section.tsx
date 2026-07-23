"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { addCommentAction } from "@/actions/post.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import renderContentWithLinks from "../shared/render-links";
import { toast } from "sonner";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  author?: {
    _id: string;
    username: string;
    name?: string;
    profilePicture?: string;
  };
  user?: any;
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
  currentUserId: string;
}

export function CommentSection({
  postId,
  initialComments = [],
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isPending) return;

    const commentText = newComment.trim();
    setNewComment("");

    startTransition(async () => {
      const res = await addCommentAction(postId, commentText);
      if (res.success && res.data) {
        setComments((prev) => [res.data, ...prev]);
      } else {
        toast.error(res.error || "Failed to add comment.");
      }
    });
  };

  return (
    <div className="mt-6 bg-card border border-border p-5 shadow-sm">
      <h3 className="font-semibold text-foreground mb-4">Comments</h3>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isPending}
          className="bg-background border-border"
        />
        <Button type="submit" disabled={isPending || !newComment.trim()}>
          {isPending ? "Posting..." : "Comment"}
        </Button>
      </form>

      {comments.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-6">
          No comments yet. Be the first to break the silence!
        </p>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {comments.map((comment) => {
            const author = comment.author || comment.user;
            return (
              <div
                key={comment._id}
                className="flex gap-3 text-sm items-start border-b border-border/20 pb-3 last:border-0 last:pb-0"
              >
                <Link href={`/profile/${author?._id}`} className="shrink-0">
                  <div className="w-8 h-8 rounded-full bg-muted border border-border/50 flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity">
                    {author?.profilePicture ? (
                      <img
                        src={author.profilePicture}
                        alt={author?.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-slate-500 font-medium text-sm">
                        {author?.username?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </Link>
                <div className="flex-1 bg-secondary/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <Link
                      href={`/profile/${author?._id}`}
                      className="font-semibold text-foreground hover:underline"
                    >
                      {author?.username || "Unknown User"}
                    </Link>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <p className="text-foreground leading-relaxed break-words">
                    {renderContentWithLinks(comment.content)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
