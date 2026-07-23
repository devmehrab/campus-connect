"use client";

import { useRef, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { uploadAvatarAction } from "@/actions/user.actions";
import { toast } from "sonner";

export function AvatarUpload({ user }: { user: any }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const initials = user.username
    ? user.username.substring(0, 2).toUpperCase()
    : "ME";

  const currentAvatar = user.profilePicture;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    startTransition(async () => {
      const res = await uploadAvatarAction(formData);
      if (!res.success) {
        toast.error(res.error || "Failed to upload avatar.");
      }
    });
  };

  return (
    <div
      className="relative rounded-full group cursor-pointer shrink-0"
      onClick={() => !isPending && inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <Avatar className="h-24 w-24 border-4 border-card rounded-full bg-background transition-opacity group-hover:opacity-80">
        <AvatarImage
          src={currentAvatar}
          className="object-cover rounded-full"
        />
        <AvatarFallback className="text-2xl font-mono text-primary rounded-full">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        {isPending ? (
          <Loader2 className="animate-spin text-white" size={24} />
        ) : (
          <Camera className="text-white" size={24} />
        )}
      </div>
    </div>
  );
}
