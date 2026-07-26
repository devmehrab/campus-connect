import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserId } from "@/services/auth.service";
import { getPostByIdAction } from "@/actions/post.actions";
import { getCommentsAction } from "@/actions/comment.actions";
import { Button } from "@/components/ui/button";
import { PostInteractions } from "@/components/post/post-interactions";
import { CommentSection } from "@/components/post/comment-section";
import { PostContent } from "@/components/post/post-content";
import { PostActions } from "@/components/post/post-actions"; // <-- Import the new component

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const resolvedParams = await params;
  const postId = resolvedParams.postId;

  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    redirect("/login");
  }

  const [postRes, commentsRes] = await Promise.all([
    getPostByIdAction(postId),
    getCommentsAction(postId),
  ]);

  const post = postRes?.success ? postRes.data : null;
  const initialComments = commentsRes?.success ? commentsRes.data : [];

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto w-full p-10 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Post not found
        </h1>
        <p className="text-muted-foreground mb-6">
          This post may have been deleted, or the link is incorrect.
        </p>
        <Link href="/feed">
          <Button variant="default">Back to Feed</Button>
        </Link>
      </div>
    );
  }

  const author = post.author || post.user;

  // Check if the current user is the author of this post
  const isAuthor =
    currentUserId === author?._id || currentUserId === author?.id;

  return (
    <div className="max-w-2xl mx-auto w-full h-full">
      <div className="mb-4">
        <Link
          href="/feed"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors w-fit"
        >
          <span>←</span> Back
        </Link>
      </div>

      <div className="bg-card border border-border p-5 shadow-sm">
        {/* Changed this to a flex container that justifies between the user info and the actions */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${author?._id}`}>
              <div className="w-12 h-12 rounded-full bg-muted border border-border/50 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
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

            <div>
              <Link
                href={`/profile/${author?._id}`}
                className="hover:underline"
              >
                <h2 className="font-semibold text-[17px] text-foreground leading-tight">
                  {author?.username || "Unknown User"}
                </h2>
              </Link>
              <p className="text-sm text-muted-foreground">
                {author?.name || ""}
              </p>
            </div>
          </div>

          {/* Render the Actions only if it's their post */}
          {isAuthor && (
            <PostActions postId={postId} initialContent={post.content} />
          )}
        </div>

        <div className="mb-6">
          <PostContent content={post.content} />

          {post.images && post.images.length > 0 && (
            <div className="mt-4 rounded-xl overflow-hidden border border-border">
              <img
                src={post.images[0]}
                alt="Post attachment"
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>

        <div className="text-sm text-muted-foreground border-b border-border/40 pb-4 mb-4">
          {new Date(post.createdAt).toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          })}{" "}
          ·{" "}
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>

        <PostInteractions
          postId={postId}
          initialLikes={post.likes || []}
          currentUserId={currentUserId}
          commentCount={initialComments.length}
        />
      </div>

      <CommentSection
        postId={postId}
        initialComments={initialComments}
        currentUserId={currentUserId}
      />
    </div>
  );
}
