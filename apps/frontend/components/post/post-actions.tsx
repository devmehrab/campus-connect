"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Edit } from "lucide-react";
import { deletePostAction, updatePostAction } from "@/actions/post.actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface PostActionsProps {
  postId: string;
  initialContent: string;
}

export function PostActions({ postId, initialContent }: PostActionsProps) {
  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isUpdating, startUpdateTransition] = useTransition();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [content, setContent] = useState(initialContent);

  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    startDeleteTransition(async () => {
      const res = await deletePostAction(postId);
      if (!res.success) {
        toast.error(res.error || "Failed to delete post.");
      } else {
        toast.success("Post deleted successfully.");
        router.push("/feed"); // Redirect to feed after deleting from the single post page
      }
    });
  };

  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startUpdateTransition(async () => {
      const formData = new FormData();
      formData.append("content", content);

      const res = await updatePostAction(postId, formData);

      if (!res.success) {
        toast.error(res.error || "Failed to update post.");
      } else {
        toast.success("Post updated successfully.");
        setIsDialogOpen(false);
      }
    });
  };

  return (
    <div className="flex items-center gap-1">
      {/* Edit Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsDialogOpen(true)}
        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
      >
        <Edit size={16} />
      </Button>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdatePost} className="space-y-4 mt-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[120px] resize-none"
              disabled={isUpdating}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDeletePost}
        disabled={isDeleting}
        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        {isDeleting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Trash2 size={16} />
        )}
      </Button>
    </div>
  );
}
