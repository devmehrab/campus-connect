import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/services/auth.service";
import {
  getNotificationsAction,
  markAllAsReadAction,
} from "@/actions/notification.actions";
import { Button } from "@/components/ui/button";
import NotificationItem from "@/components/notifications/notification-item";
import { Bell } from "lucide-react";

export default async function NotificationsPage() {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    redirect("/login");
  }

  const res = await getNotificationsAction();
  const notifications = res?.success ? res.data : [];
  const unreadCount = res?.success ? res.meta.unreadCount : 0;

  return (
    <div className="max-w-3xl mx-auto w-full h-full ">
      <div className="flex items-center justify-between mb-6 px-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-primary font-medium mt-1">
              You have {unreadCount} unread notifications
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <form action={markAllAsReadAction}>
            <Button type="submit" variant="outline" size="sm" className="h-9">
              Mark all as read
            </Button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center text-muted-foreground py-20 bg-card border border-border shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">
              <Bell />
            </span>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            You're all caught up
          </h2>
          <p className="text-sm">No new notifications right now.</p>
        </div>
      ) : (
        <div className="bg-card border border-border overflow-hidden shadow-sm">
          {notifications.map((notif: any, index: number) => {
            const isLastItem = index === notifications.length - 1;

            return (
              <NotificationItem
                key={notif._id}
                notif={notif}
                isLastItem={isLastItem}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
