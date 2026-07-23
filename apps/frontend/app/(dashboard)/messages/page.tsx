import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/services/auth.service";
import { getConversationsAction } from "@/actions/message.actions";
import { getAllUsersAction } from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default async function InboxPage() {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    redirect("/login");
  }

  const [convRes, usersRes] = await Promise.all([
    getConversationsAction(),
    getAllUsersAction(),
  ]);

  const conversations = convRes?.success ? convRes.data : [];
  const allUsers = usersRes?.success ? usersRes.data : [];

  const activeChatUserIds = new Set(
    conversations.flatMap((conv: any) =>
      conv.participants
        .filter((p: any) => p._id !== currentUserId)
        .map((p: any) => p._id),
    ),
  );

  const availableClassmates = allUsers.filter(
    (user: any) =>
      user._id !== currentUserId &&
      user.id !== currentUserId &&
      !activeChatUserIds.has(user._id || user.id),
  );

  return (
    <div className="max-w-3xl mx-auto w-full h-full pb-20 md:pb-6">
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-6 px-2">
        Messages
      </h1>

      {conversations.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 bg-card border border-border shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">
              <MessageCircle />
            </span>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            No messages yet
          </h2>
          <p className="text-sm">Start chatting from the list below!</p>
        </div>
      ) : (
        <div className="bg-card border border-border overflow-hidden shadow-sm sm:rounded-xl">
          {conversations.map((conv: any, index: number) => {
            const otherUser = conv.participants.find(
              (p: any) => p._id !== currentUserId,
            );

            if (!otherUser) return null;

            const lastMessage = conv.lastMessage;
            const isUnread =
              lastMessage &&
              lastMessage.sender !== currentUserId &&
              !lastMessage.isRead;
            const isLastItem = index === conversations.length - 1;

            return (
              <Link
                href={`/messages/${otherUser._id}`}
                key={conv._id}
                className={`flex items-center gap-4 p-4 hover:bg-secondary/60 transition-colors cursor-pointer group ${
                  !isLastItem ? "border-b border-border/40" : ""
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {otherUser.profilePicture ? (
                      <img
                        src={otherUser.profilePicture}
                        alt={otherUser.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground font-semibold text-lg uppercase">
                        {otherUser.username.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3
                      className={`truncate text-[16px] ${isUnread ? "font-bold text-foreground" : "font-medium text-foreground/90"}`}
                    >
                      {otherUser.username}
                    </h3>

                    {lastMessage && (
                      <span
                        className={`text-xs ml-2 flex-shrink-0 ${isUnread ? "text-primary font-semibold" : "text-muted-foreground"}`}
                      >
                        {new Date(lastMessage.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <p
                      className={`text-[14px] truncate ${isUnread ? "text-foreground font-medium" : "text-muted-foreground"}`}
                    >
                      {lastMessage
                        ? `${lastMessage.sender === currentUserId ? "You: " : ""}${lastMessage.text.slice(0, 20)}${lastMessage.text.length > 20 ? "..." : ""}`
                        : "Start a conversation..."}
                    </p>

                    {isUnread && (
                      <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {availableClassmates.length > 0 && (
        <div className="mt-10 mb-6">
          <h2 className="text-lg font-bold text-foreground tracking-tight mb-4 px-2">
            Other members
          </h2>
          <div className="bg-card border border-border overflow-hidden shadow-sm">
            {availableClassmates.map((user: any, index: number) => {
              const isLastItem = index === availableClassmates.length - 1;
              return (
                <div
                  key={user._id || user.id}
                  className={`flex items-center justify-between p-4 hover:bg-secondary/60 transition-colors ${
                    !isLastItem ? "border-b border-border/40" : ""
                  }`}
                >
                  <Link
                    href={`/profile/${user._id || user.id}`}
                    className="flex items-center gap-3 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-muted-foreground font-medium text-sm">
                            {user.username?.charAt(0).toUpperCase() || "U"}
                          </span>
                        )}
                      </div>

                      <div className="truncate">
                        <p className="font-medium text-[15px] text-foreground truncate">
                          {user.username}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link href={`/messages/${user._id || user.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-full"
                    >
                      Chat
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
