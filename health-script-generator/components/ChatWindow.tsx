"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types";
import { STAGES } from "@/lib/stages";
import MessageBubble from "./MessageBubble";

function TypingIndicator({ accentColor }: { accentColor: string }) {
  return (
    <div className="flex items-start px-4 max-w-3xl mx-auto w-full">
      <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 px-5 py-4">
        <div className="flex items-center gap-1.5">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ backgroundColor: accentColor, animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
}

export default function ChatWindow({ messages, loading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Derive active stage from the last message
  const activeStageId = messages.length > 0
    ? messages[messages.length - 1].stageId
    : 0;
  const activeStage = STAGES.find((s) => s.id === activeStageId) ?? STAGES[0];

  // Scroll to bottom on new messages or when loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="h-full overflow-y-auto py-6 space-y-4 scroll-smooth">
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}

      {loading && <TypingIndicator accentColor={activeStage.accent} />}

      <div ref={bottomRef} className="h-px" />
    </div>
  );
}
