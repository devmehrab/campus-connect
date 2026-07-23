import { Card, CardContent } from "@/components/ui/card";
import {
  getUserProfileAction,
  getUserPostsAction,
} from "@/actions/user.actions";
import { CardMain as PostCard, IPost } from "@/components/post-card/card-main";
import { Mail, GraduationCap, Terminal, Calendar } from "lucide-react";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { AvatarUpload } from "@/components/profile/avatar-upload";

export default async function ProfilePage() {
  const [profileRes, postsRes] = await Promise.all([
    getUserProfileAction(),
    getUserPostsAction(),
  ]);

  const user = profileRes.success ? profileRes.data : null;
  const posts: IPost[] = postsRes.success ? postsRes.data : [];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Terminal size={48} className="text-muted-foreground" />
        <h2 className="text-xl font-mono text-muted-foreground">
          Error 404: User Identity Not Found
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full pb-12">
      <Card className="bg-card border-border shadow-sm overflow-hidden p-0">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-primary/40 to-primary/10 w-full border-b border-border/50 relative" />

        <CardContent className="pt-0 relative px-4 sm:px-6 pb-6">
          <div className="flex justify-between items-start">
            <div className="relative rounded-full -mt-16 sm:-mt-16 z-10 mb-4">
              <AvatarUpload user={user} />
            </div>

            <div className="pt-3 sm:pt-4">
              <EditProfileModal user={user} />
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-bold font-mono tracking-tight text-foreground">
                @{user.username}
              </h1>
            </div>

            {user.name && (
              <p className="text-muted-foreground font-sans text-base">
                {user.name}
              </p>
            )}

            {user.bio && (
              <p className="text-[15px] text-foreground font-sans mt-3 whitespace-pre-wrap">
                {user.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-4 pt-3 text-sm font-sans">
              <div className="hover:underline cursor-pointer flex items-center">
                <span className="font-bold text-foreground mr-1.5">
                  {user.following?.length || 0}
                </span>
                <span className="text-muted-foreground">Following</span>
              </div>
              <div className="hover:underline cursor-pointer flex items-center">
                <span className="font-bold text-foreground mr-1.5">
                  {user.followers?.length || 0}
                </span>
                <span className="text-muted-foreground">Followers</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-border/50">
            {user.email && (
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-mono">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            )}

            <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-mono">
              <GraduationCap size={16} className="text-primary flex-shrink-0" />
              <span className="truncate">
                {user.universityId || "No ID"}
                {user.batch ? ` • Batch ${user.batch}` : ""} • {user.role}
              </span>
            </div>

            {user.createdAt && (
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-mono sm:col-span-2">
                <Calendar size={16} className="text-primary flex-shrink-0" />
                <span>
                  Joined{" "}
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-bold font-mono tracking-tight text-foreground flex items-center gap-2 px-2 sm:px-0">
          <Terminal size={20} className="text-primary" />
          Post History
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/50 rounded-lg mx-2 sm:mx-0 bg-card/50">
            <p className="text-muted-foreground font-mono text-sm">
              No posts yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
