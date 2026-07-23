"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleFollowAction } from "@/actions/user.actions";
import { Loader2, UserPlus, UserMinus } from "lucide-react";
import { toast } from "sonner";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean;
}

export function FollowButton({
  targetUserId,
  initialIsFollowing,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const previousState = isFollowing;
    setIsFollowing(!isFollowing);

    startTransition(async () => {
      const res = await toggleFollowAction(targetUserId);

      if (!res.success) {
        setIsFollowing(previousState);

        toast.error(res.error || "Failed to update follow status");
      }
    });
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={handleToggle}
      disabled={isPending}
      className="gap-2 rounded-full font-semibold"
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isFollowing ? (
        <UserMinus size={16} />
      ) : (
        <UserPlus size={16} />
      )}
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
