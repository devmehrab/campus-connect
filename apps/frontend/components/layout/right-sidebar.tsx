import Link from "next/link";
import { getAllUsersAction } from "@/actions/user.actions";
import { getCurrentUserId } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export async function RightSidebar() {
  const currentUserId = await getCurrentUserId();

  const res = await getAllUsersAction();

  const users = res?.success
    ? res.data.filter(
        (user: any) => user._id !== currentUserId && user.id !== currentUserId,
      )
    : [];

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="font-semibold text-lg mb-4 px-2">Community members</h2>

      <ScrollArea className="flex-1 -mx-2 px-2">
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground px-2">No users found.</p>
        ) : (
          <div className="space-y-3">
            {users.map((user: any) => (
              <div
                key={user._id || user.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-foreground/10 border border-transparent transition-all"
              >
                <Link
                  href={`/profile/${user._id || user.id}`}
                  className="flex-1"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-foreground/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-slate-500 font-medium text-sm">
                          {user.username?.charAt(0).toUpperCase() || "U"}
                        </span>
                      )}
                    </div>

                    <div className="truncate">
                      <p className="font-medium text-sm truncate">
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
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
