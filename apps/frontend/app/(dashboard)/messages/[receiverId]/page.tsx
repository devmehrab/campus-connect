import ChatWindow from "@/components/chat/chat-window";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/services/auth.service";
import { getReceiverProfileAction } from "@/actions/user.actions";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ receiverId: string }>;
}) {
  const resolvedParams = await params;
  const receiverId = resolvedParams.receiverId;

  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    redirect("/login");
  }

  const userRes = await getReceiverProfileAction(receiverId);

  const receiverName = userRes?.success
    ? userRes.data.username
    : "Unknown User";
  const receiverAvatar = userRes?.success
    ? userRes.data.profilePicture
    : undefined;

  return (
    <div className="h-full w-full">
      <ChatWindow
        currentUserId={currentUserId}
        receiverId={receiverId}
        receiverName={receiverName}
        receiverAvatar={receiverAvatar}
      />
    </div>
  );
}
