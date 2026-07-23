import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CardHeaderView } from "./card-header";
import { CardContentView } from "./card-content";
import { CardInteractions } from "./card-interactions";

export interface IPost {
  _id: string;
  author: {
    _id: string;
    username: string;
    name?: string;
    profilePicture?: string;
  };
  content: string;
  images?: string[];
  likes: any[];
  comments?: any[];
  commentsCount?: number;
  createdAt?: string;
  hasLiked?: boolean;
  isAuthor?: boolean;
}

export function CardMain({ post }: { post: IPost }) {
  const likeCount = Array.isArray(post.likes)
    ? post.likes.length
    : post.likes || 0;
  const commentCount =
    post.commentsCount ??
    (Array.isArray(post.comments) ? post.comments.length : 0);
  return (
    <Card
      className={cn(
        "w-full min-w-0 overflow-hidden",
        "border-border shadow-none bg-card hover:border-primary/50 transition-all duration-200",
      )}
    >
      <CardHeaderView post={post} />

      <CardContentView post={post} />

      <CardInteractions
        postId={post._id}
        initialLikeCount={likeCount}
        initialCommentCount={commentCount}
        hasLiked={post.hasLiked}
      />
    </Card>
  );
}
