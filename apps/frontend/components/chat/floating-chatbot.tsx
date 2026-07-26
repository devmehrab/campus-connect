"use client";

import { useState, useRef, useEffect } from "react";
import { askAssistant } from "@/actions/assistant.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { X, MessageSquare } from "lucide-react";

type Message = { role: "user" | "ai"; content: string };

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };

    // Optimistically update UI
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send the current question AND the previous messages (excluding the one we just added)
      const data = await askAssistant(userMessage.content, messages);

      const aiMessage: Message = { role: "ai", content: data.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed right-4 z-50 bottom-24 md:bottom-8">
      {isOpen ? (
        <Card className="flex flex-col shadow-xl w-[calc(100vw-2rem)] sm:w-96 h-[65vh] max-h-[500px] sm:h-[500px]">
          <CardHeader className="flex flex-row justify-between items-center p-4 border-b">
            <CardTitle className="text-lg">Campus Connect AI</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Ask me anything about the documents!
                </p>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[85%] text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p>{msg.content}</p>
                    ) : (
                      <div className="prose-sm">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => (
                              <p
                                className="mb-2 last:mb-0 leading-relaxed"
                                {...props}
                              />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul
                                className="list-disc pl-4 mb-2 space-y-1"
                                {...props}
                              />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol
                                className="list-decimal pl-4 mb-2 space-y-1"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="leading-relaxed" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-semibold" {...props} />
                            ),
                            a: ({ node, ...props }) => (
                              <a
                                className="text-blue-500 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-3 py-2 bg-muted text-sm animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                Send
              </Button>
            </form>
          </div>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
