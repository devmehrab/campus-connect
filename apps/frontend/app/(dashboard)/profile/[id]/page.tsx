import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Mail, MapPin, Send } from "lucide-react";
import { getCurrentUserId } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { CardMain as PostCard } from "@/components/post-card/card-main";
import {
  getUserByIdAction,
  getSpecificUserPostsAction,
} from "@/actions/user.actions";
import { FollowButton } from "@/components/profile/follow-button";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const targetUserId = resolvedParams.id;

  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    redirect("/login");
  }

  const [userRes, postsRes] = await Promise.all([
    getUserByIdAction(targetUserId),
    getSpecificUserPostsAction(targetUserId),
  ]);

  const profileUser = (userRes as { data?: any } | null)?.data ?? null;
  const userPosts = postsRes?.data ?? [];

  const isOwnProfile = currentUserId === targetUserId;
  if (isOwnProfile) {
    redirect("/profile");
  }

  const initialIsFollowing =
    profileUser?.followers?.some(
      (id: any) => id === currentUserId || id?._id === currentUserId,
    ) || false;

  if (!profileUser) {
    return (
      <div className="max-w-2xl mx-auto w-full p-10 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">👤</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          User not found
        </h1>
        <p className="text-muted-foreground mb-6">
          This account may have been deleted or does not exist.
        </p>
        <Link href="/feed">
          <Button variant="default">Back to Feed</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full h-full pb-20 md:pb-6">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center gap-4">
        <Link
          href="/feed"
          className="p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-lg font-bold leading-tight">
            {profileUser.username}
          </h1>
          <p className="text-xs text-muted-foreground">
            {userPosts.length} posts
          </p>
        </div>
      </div>

      <div className="bg-card border-x border-b border-border mb-6 shadow-sm">
        <div className="h-32 sm:h-40 w-full bg-gradient-to-r from-primary/40 to-primary/10" />

        <div className="px-4 pb-4">
          <div className="flex justify-between items-start">
            <div className="relative -mt-12 sm:-mt-16 mb-4 border-4 border-card rounded-full bg-muted w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden">
              {profileUser.profilePicture ? (
                <img
                  src={profileUser.profilePicture}
                  alt={profileUser.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary text-4xl sm:text-5xl text-muted-foreground uppercase font-semibold">
                  {profileUser.username?.charAt(0) || "U"}
                </div>
              )}
            </div>

            <div className="pt-3">
              {isOwnProfile ? (
                <Button
                  variant="outline"
                  className="rounded-full font-semibold"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Link href={`/messages/${profileUser._id}`}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Mail size={18} />
                    </Button>
                  </Link>
                  <FollowButton
                    targetUserId={targetUserId}
                    initialIsFollowing={initialIsFollowing}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground">
              {profileUser.name || profileUser.username}
            </h2>
            <p className="text-muted-foreground mb-3">
              @{profileUser.username}
            </p>

            {profileUser.bio && (
              <p className="text-foreground text-[15px] mb-4 whitespace-pre-wrap">
                {profileUser.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground mb-4">
              {profileUser.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{profileUser.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>
                  Joined{" "}
                  {new Date(profileUser.createdAt).toLocaleDateString(
                    undefined,
                    {
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <div className="hover:underline cursor-pointer">
                <span className="font-semibold text-foreground mr-1">
                  {profileUser.following?.length || 0}
                </span>
                <span className="text-muted-foreground">Following</span>
              </div>
              <div className="hover:underline cursor-pointer">
                <span className="font-semibold text-foreground mr-1">
                  {profileUser.followers?.length || 0}
                </span>
                <span className="text-muted-foreground">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg px-4 sm:px-0">Posts</h3>
        {userPosts.length > 0 ? (
          userPosts.map((post: any) => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="text-center py-10 border border-border rounded-xl bg-card">
            <p className="text-muted-foreground">
              {isOwnProfile
                ? "You haven't posted anything yet."
                : `@${profileUser.username} hasn't posted anything yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
