"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deletePostAction } from "@/actions/post.actions";
import { toast } from "sonner";

export function CardDeleteAction({ postId }: { postId: string }) {
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    startDeleteTransition(async () => {
      const res = await deletePostAction(postId);
      if (!res.success) {
        toast.error(res.error || "Failed to delete post.");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDeletePost}
      disabled={isDeleting}
      className="absolute right-4 top-4 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
    >
      {isDeleting ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Trash2 size={14} />
      )}
    </Button>
  );
}
