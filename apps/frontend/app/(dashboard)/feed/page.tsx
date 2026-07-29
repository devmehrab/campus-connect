import { CreatePost } from "@/components/feed/create-post";
import { CardMain as PostCard, IPost } from "@/components/post-card/card-main";
import { fetcher } from "@/lib/fetcher";
import { getUserProfileAction } from "@/actions/user.actions";

export default async function FeedPage() {
  const profilePromise = getUserProfileAction();
  const feedPromise = fetcher("/posts/feed?page=1&limit=20", {
    next: {
      revalidate: 30,
    },
  }) as Promise<{ success: boolean; data?: IPost[] }>;

  const [profileRes, feedResult] = await Promise.all([
    profilePromise,
    feedPromise,
  ]);

  const user = profileRes.success ? profileRes.data : null;
  let posts: IPost[] =
    feedResult.success && feedResult.data ? feedResult.data : [];

  return (
    <div className="space-y-6 w-full pb-12">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-bold font-mono text-primary">feed</h1>
      </div>

      <CreatePost user={user} />

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground font-mono border border-border/50 rounded-lg border-dashed">
            No processes running. Be the first to execute a post.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post?._id} post={post} />)
        )}
      </div>
    </div>
  );
}
