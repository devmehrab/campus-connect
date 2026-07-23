"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  Bell,
  Terminal,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth.actions";
import { getNotificationsAction } from "@/actions/notification.actions";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Feed", href: "/feed", icon: Home },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Messages", href: "/messages", icon: MessageCircle },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await getNotificationsAction(1, 1);

        const count =
          res?.meta?.unreadCount ?? res?.data?.meta?.unreadCount ?? 0;
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to fetch unread notifications", error);
      }
    };

    fetchUnreadCount();
  }, [pathname]);

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-full py-6 px-4">
      <div className="flex items-center gap-2 px-2 mb-8 text-primary">
        <Terminal size={28} />
        <span className="text-xl font-bold font-mono tracking-tighter text-foreground">
          Campus_Net
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <span
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors font-mono w-full",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <item.icon size={20} />
                <span>{item.name}</span>

                {item.name === "Notifications" && unreadCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-mono"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
