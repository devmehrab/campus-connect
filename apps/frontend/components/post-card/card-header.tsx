import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader } from "@/components/ui/card";
import { CardActions } from "./card-delete";
import { IPost } from "./card-main";

function formatTimeAgo(dateString: string | Date | undefined): string {
  if (!dateString) return "Just now";

  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} mo${months > 1 ? "s" : ""} ago`;
  const years = Math.round(months / 12);
  return `${years} yr${years > 1 ? "s" : ""} ago`;
}

export function CardHeaderView({ post }: { post: IPost }) {
  const username = post.author?.username || "Unknown";
  const initials = username.substring(0, 2).toUpperCase();
  const avatarSrc = post.author?.profilePicture;

  return (
    <CardHeader className="flex flex-row items-center gap-4 pb-3 relative">
      <Link
        href={`/profile/${post.author?._id}`}
        className="flex items-center gap-3"
      >
        <Avatar className="h-10 w-10 rounded-full">
          <AvatarImage src={avatarSrc} className="object-cover" />
          <AvatarFallback className="bg-background text-primary font-mono rounded-full">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-bold text-foreground font-mono tracking-tight">
            @{username}
          </span>
          <span
            suppressHydrationWarning
            className="text-xs text-muted-foreground font-mono"
          >
            {formatTimeAgo(post.createdAt)}
          </span>
        </div>
      </Link>

      {post.isAuthor && (
        <CardActions postId={post._id} initialContent={post.content} />
      )}
    </CardHeader>
  );
}
