"use client";

import { useRouter } from "next/navigation";
import { markSingleAsReadAction } from "@/actions/notification.actions";
import { useTransition } from "react";

export default function NotificationItem({
  notif,
  isLastItem,
}: {
  notif: any;
  isLastItem: boolean;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const sender = notif.sender;

  const getNotificationText = (type: string) => {
    switch (type) {
      case "LIKE":
        return "liked your post";
      case "COMMENT":
        return "commented on your post";
      case "FOLLOW":
        return "started following you";
      default:
        return "interacted with you";
    }
  };

  const handleClick = () => {
    if (!notif.isRead) {
      startTransition(() => {
        markSingleAsReadAction(notif._id);
      });
    }

    if (notif.post?._id) {
      router.push(`/posts/${notif.post._id}`);
    } else if (sender?._id) {
      router.push(`/profile/${sender._id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 transition-colors cursor-pointer ${
        !notif.isRead ? "bg-primary/5" : "hover:bg-secondary/40"
      } ${!isLastItem ? "border-b border-border/40" : ""}`}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center border border-border/50">
        {sender?.profilePicture ? (
          <img
            src={sender.profilePicture}
            alt={sender?.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-muted-foreground font-semibold text-base sm:text-lg uppercase">
            {sender?.username?.charAt(0) || "?"}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 pt-0 sm:pt-1">
        <p className="text-[14px] sm:text-[15px] text-foreground leading-snug break-words">
          <span className="font-semibold text-foreground mr-1">
            {sender?.username}
          </span>
          <span className="text-muted-foreground">
            {getNotificationText(notif.type)}
          </span>
        </p>

        {notif.post && (
          <p className="text-xs sm:text-sm text-muted-foreground/80 mt-1 truncate">
            "{notif.post.content.slice(0, 20)}"
          </p>
        )}

        <span className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2 block font-medium">
          {new Date(notif.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      </div>

      {!notif.isRead && (
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-primary rounded-full flex-shrink-0 mt-1.5 sm:mt-2" />
      )}
    </div>
  );
}
