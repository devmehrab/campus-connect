import { Sidebar } from "@/components/layout/sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { SocketProvider } from "@/providers/SocketProvider";
import { getCurrentUserId } from "@/services/auth.service";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Suspense, lazy } from "react";

const FloatingChatbot = lazy(() =>
  import("@/components/chat/floating-chatbot").then((mod) => ({
    default: mod.FloatingChatbot,
  })),
);

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUserId = await getCurrentUserId();

  return (
    <SocketProvider userId={currentUserId}>
      <div className="flex min-h-screen bg-background">
        <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 z-50 border-r border-border bg-card">
          <Sidebar />
        </aside>

        <main className="flex-1 md:pl-64 xl:pr-72">
          <div className="max-w-3xl mx-auto w-full p-4 md:p-8">{children}</div>
        </main>

        <aside className="hidden xl:flex w-72 flex-col fixed inset-y-0 right-0 z-50 border-l border-border bg-card">
          <RightSidebar />
        </aside>

        <Suspense fallback={null}>
          <FloatingChatbot />
        </Suspense>

        <MobileNav />
      </div>
    </SocketProvider>
  );
}
