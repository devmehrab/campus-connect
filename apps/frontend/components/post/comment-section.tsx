"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  addCommentAction,
  deleteCommentAction,
  updateCommentAction,
} from "@/actions/comment.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import renderContentWithLinks from "../shared/render-links";
import { toast } from "sonner";
import { Trash2, Edit, Loader2 } from "lucide-react";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  author?: {
    _id: string;
    username: string;
    name?: string;
    profilePicture?: string;
    id?: string;
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

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isUpdating, startUpdateTransition] = useTransition();

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

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    setDeletingId(commentId);
    const res = await deleteCommentAction(commentId);

    if (res.success) {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } else {
      toast.error(res.error || "Failed to delete comment.");
    }
    setDeletingId(null);
  };

  const startEditing = (comment: Comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = (commentId: string) => {
    if (!editContent.trim()) return;

    startUpdateTransition(async () => {
      const res = await updateCommentAction(commentId, editContent);

      if (res.success) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId ? { ...c, content: editContent } : c,
          ),
        );
        setEditingId(null);
        toast.success("Comment updated");
      } else {
        toast.error(res.error || "Failed to update comment.");
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

            const isAuthor =
              currentUserId === author?._id || currentUserId === author?.id;

            const isEditing = editingId === comment._id;

            return (
              <div
                key={comment._id}
                className="flex gap-3 text-sm items-start border-b border-border/20 pb-3 last:border-0 last:pb-0 group"
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
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
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

                    {isAuthor && !isEditing && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditing(comment)}
                          disabled={deletingId === comment._id}
                          className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                          title="Edit Comment"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          disabled={deletingId === comment._id}
                          className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                          title="Delete Comment"
                        >
                          {deletingId === comment._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="mt-2 space-y-2">
                      <Input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        disabled={isUpdating}
                        autoFocus
                        className="h-8 text-sm bg-background"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(null)}
                          disabled={isUpdating}
                          className="h-7 px-3 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleUpdateComment(comment._id)}
                          disabled={isUpdating || editContent.trim() === ""}
                          className="h-7 px-3 text-xs"
                        >
                          {isUpdating ? (
                            <Loader2 size={12} className="animate-spin mr-1" />
                          ) : null}
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground leading-relaxed break-words">
                      {renderContentWithLinks(comment.content)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
