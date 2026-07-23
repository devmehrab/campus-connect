"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, AlertCircle, ImageIcon, X } from "lucide-react";
import { createPostAction } from "@/actions/post.actions";

export function CreatePost({ user }: { user?: any }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const avatarSrc = user?.profilePicture;
  const initials = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : "ME";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && !imageFile) return;
    setError(null);

    const formData = new FormData();
    formData.append("content", content);

    if (imageFile) {
      formData.append("images", imageFile);
    }

    startTransition(async () => {
      const result = await createPostAction(formData);

      if (!result.success) {
        setError(result.error || "Failed to execute post.");
        return;
      }

      setContent("");
      removeImage();
    });
  };

  return (
    <div className="bg-card border border-border p-4 rounded-lg shadow-sm mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 rounded-md mt-1 hidden sm:block">
            <AvatarImage src={avatarSrc} className="object-cover" />
            <AvatarFallback className="bg-background rounded-md text-primary font-mono">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's compiling in your mind?"
              className="min-h-[80px] resize-none border-none shadow-none focus-visible:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground font-sans text-base p-2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPending}
              maxLength={500}
            />

            {imagePreview && (
              <div className="relative w-fit mt-2">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="max-h-60 rounded-md border border-border object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isPending}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:bg-destructive/90 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive font-mono">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="flex justify-between items-center border-t border-border/50 pt-3">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  disabled={isPending}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                >
                  <ImageIcon size={20} />
                </Button>

                <span
                  className={`text-xs font-mono hidden sm:inline-block ${
                    content.length >= 500
                      ? "text-destructive font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {content.length} / 500 chars
                </span>
              </div>

              <Button
                type="submit"
                suppressHydrationWarning
                disabled={
                  (!content.trim() && !imageFile) ||
                  content.length > 500 ||
                  isPending
                }
                className="font-mono bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isPending ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : (
                  <Send size={16} className="mr-2" />
                )}
                Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
