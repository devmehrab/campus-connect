"use client";

import { useState, useEffect, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getCommentsAction,
  addCommentAction,
  deleteCommentAction,
} from "@/actions/post.actions";
import { Loader2, Send, Trash2 } from "lucide-react";
import renderContentWithLinks from "../shared/render-links";
import { toast } from "sonner";

interface IComment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  createdAt: string;
  isAuthor?: boolean;
}

export function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchComments = async () => {
      const res = await getCommentsAction(postId);
      if (res.success) {
        setComments(res.data || []);
      }
      setIsLoading(false);
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentText = newComment;
    setNewComment("");

    startTransition(async () => {
      const res = await addCommentAction(postId, commentText);
      if (res.success && res.data) {
        setComments((prev) => [...prev, res.data]);
      }
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingId(commentId);

    const res = await deleteCommentAction(commentId);
    if (res.success) {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } else {
      toast.error(res.error || "Failed to delete comment.");
    }

    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4 border-t border-border/50">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  return (
    <div className="border-t border-border/50 bg-background/50 p-4 space-y-4">
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {comments.length === 0 ? (
          <p className="text-xs text-muted-foreground font-mono text-center">
            No comments yet. Initialize the discussion.
          </p>
        ) : (
          comments.map((comment) => {
            const avatarSrc = comment.author.profilePicture;

            return (
              <div key={comment._id} className="flex gap-3 group">
                <Avatar className="h-8 w-8 border border-primary/20 rounded-md">
                  <AvatarImage src={avatarSrc} className="object-cover" />
                  <AvatarFallback className="bg-background text-primary font-mono text-xs rounded-md">
                    {comment.author.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted/30 p-2.5 rounded-md border border-border/50 relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold font-mono text-foreground">
                      @{comment.author.username}
                    </span>

                    {comment.isAuthor && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        disabled={deletingId === comment._id}
                        className="text-danger hover:text-destructive transition-colors disabled:opacity-50"
                      >
                        {deletingId === comment._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-foreground/90 font-sans">
                    {renderContentWithLinks(comment.content)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isPending}
          className="font-sans bg-card border-border h-9"
        />
        <Button
          type="submit"
          size="sm"
          disabled={isPending || newComment.trim() === ""}
          className="h-9 px-3"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </Button>
      </form>
    </div>
  );
}
