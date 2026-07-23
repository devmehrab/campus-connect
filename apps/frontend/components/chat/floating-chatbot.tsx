"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { askAssistantAction } from "@/actions/assistant.actions";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Campus Bot. Need help with your routine or the academic calendar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isLoading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await askAssistantAction(userMsg);

      if (response?.success === false) {
        throw new Error(
          response.error ||
            response.message ||
            "Failed to reach the assistant.",
        );
      }

      const payload = response.data || response;
      const aiText =
        payload.reply ||
        (typeof payload === "string"
          ? payload
          : "I received an empty response.");

      setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error.message || "Sorry, I couldn't reach the server.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. Floating Button - Sits above MobileNav (bottom-20) on mobile, bottom-8 on PC */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="fixed z-50 h-14 w-14 bottom-20 md:bottom-8 right-4 md:right-8 rounded-full shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* 2. Chat Window - Fills screen minus MobileNav on mobile, floating card on PC */}
      {isOpen && (
        <Card className="fixed z-50 flex flex-col shadow-2xl border-border bg-card overflow-hidden transition-all duration-300 ease-in-out w-full h-[calc(100dvh-4rem)] bottom-16 right-0 rounded-none sm:w-[380px] sm:h-[550px] sm:bottom-8 sm:right-8 sm:rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b p-4 bg-primary text-primary-foreground sm:rounded-t-2xl shrink-0">
            <div className="font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Campus Bot
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:text-primary hover:bg-background rounded-full transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden bg-background/50">
            <ScrollArea className="h-full p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-sm break-words whitespace-pre-wrap shadow-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-card border border-border rounded-tl-sm text-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border max-w-[80%] rounded-2xl rounded-tl-sm p-3 text-sm animate-pulse text-muted-foreground flex gap-1 items-center shadow-sm">
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-75" />
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-3 border-t border-border bg-card shrink-0 sm:rounded-b-2xl">
            <form
              onSubmit={sendMessage}
              className="flex w-full items-center space-x-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your routine..."
                className="flex-1 bg-secondary border-none focus-visible:ring-1 focus-visible:ring-primary rounded-full px-4"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full shrink-0"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
