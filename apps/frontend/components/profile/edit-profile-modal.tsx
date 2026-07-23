"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit3, Loader2 } from "lucide-react";
import { updateProfileAction } from "@/actions/user.actions";
import { toast } from "sonner";

export function EditProfileModal({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    bio: user.bio || "",
    universityId: user.universityId || "",
    batch: user.batch || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const payload = {
        ...formData,
        batch: formData.batch ? Number(formData.batch) : undefined,
      };

      const res = await updateProfileAction(payload);
      if (res.success) {
        setIsOpen(false);
      } else {
        toast.error(res.error || "Failed to update profile.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "font-mono gap-2 shrink-0",
        )}
      >
        <Edit3 size={16} />
        Edit Profile
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-card border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-foreground">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground">
              Full Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isPending}
              className="bg-background border-border"
              placeholder="e.g. Hasibur Rahman"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground">
              Username
            </label>
            <Input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              disabled={isPending}
              className="bg-background border-border"
              placeholder="hasibur44"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground">
                University ID
              </label>
              <Input
                value={formData.universityId}
                onChange={(e) =>
                  setFormData({ ...formData, universityId: e.target.value })
                }
                disabled={isPending}
                className="bg-background border-border"
                placeholder="25524204044"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground">
                Year (1st/2nd/3rd/4th)
              </label>
              <Input
                type="number"
                value={formData.batch}
                onChange={(e) =>
                  setFormData({ ...formData, batch: e.target.value })
                }
                disabled={isPending}
                className="bg-background border-border"
                placeholder="e.g. 24"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground">
              Bio
            </label>
            <Input
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              disabled={isPending}
              className="bg-background border-border"
              placeholder="Write a short bio..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : null}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
