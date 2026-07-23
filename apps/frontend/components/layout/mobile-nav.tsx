"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Bell, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNotificationsAction } from "@/actions/notification.actions";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Feed", href: "/feed", icon: Home },
  { name: "Messages", href: "/messages", icon: MessageCircle },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

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

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border pb-safe transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className="relative">
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />

                {item.name === "Notifications" && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-xl font-bold text-destructive">
                    •
                  </span>
                )}
              </div>

              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
