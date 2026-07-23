"use client";

import { useEffect, useState, useRef } from "react";
import { useSocket } from "@/providers/SocketProvider";
import {
  getMessagesAction,
  sendMessageAction,
} from "@/actions/message.actions";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import renderContentWithLinks from "../shared/render-links";
import Link from "next/link";

interface ChatWindowProps {
  currentUserId: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
}

export default function ChatWindow({
  currentUserId,
  receiverId,
  receiverName,
  receiverAvatar,
}: ChatWindowProps) {
  const socket = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await getMessagesAction(receiverId);
      if (res?.success) {
        setMessages(res.data);
      }
    };
    fetchHistory();
  }, [receiverId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: any) => {
      if (
        newMessage.sender === receiverId ||
        newMessage.receiver === receiverId
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("receive-message", handleNewMessage);
    return () => {
      socket.off("receive-message", handleNewMessage);
    };
  }, [socket, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    const messageText = text;
    setText("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const res = await sendMessageAction(receiverId, messageText);

    if (res?.success) {
      setMessages((prev) => [...prev, res.data]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border border-border bg-card w-full shadow-lg">
      <div className="p-4 border-b border-border bg-secondary/50 flex items-center">
        <Link href={`/profile/${receiverId}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold overflow-hidden shrink-0">
              {receiverAvatar ? (
                <img
                  src={receiverAvatar}
                  alt={receiverName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{receiverName?.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div>
              <h2 className="font-semibold text-lg text-foreground leading-tight">
                @{receiverName}
              </h2>
            </div>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 h-full p-4 bg-background/50">
        <div className="space-y-4">
          {messages.map((msg, index) => {
            const isMe = msg.sender === currentUserId;
            return (
              <div
                key={index}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 text-sm break-all ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-sm"
                      : "bg-secondary text-secondary-foreground rounded-tr-xl rounded-br-xl rounded-bl-xl rounded-tl-sm border border-border"
                  }`}
                >
                  {renderContentWithLinks(msg.text)}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSend}
        className="p-4 border-t border-border bg-card flex gap-3 items-center"
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={`Message...`}
          rows={1}
          className="flex-1 bg-secondary border-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[44px] max-h-[150px] resize-none py-3 px-4 rounded-md overflow-y-auto w-full scrollbar-thin text-sm leading-relaxed outline-0 border-0"
        />
        <Button
          type="submit"
          className="h-11 px-6 font-semibold"
          disabled={!text.trim()}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
