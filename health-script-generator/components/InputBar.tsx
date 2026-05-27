"use client";

import { useEffect, useRef } from "react";
import { STAGES } from "@/lib/stages";

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  currentStageIdx?: number;
}

export default function InputBar({
  value,
  onChange,
  onSend,
  disabled,
  currentStageIdx = 0,
}: InputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeStage = STAGES[Math.min(currentStageIdx, STAGES.length - 1)];
  const canSend = !disabled && value.trim().length > 0;

  // Auto-resize textarea, capped at 160 px
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter") return;
    // Desktop (pointer: fine) — Enter sends; Shift+Enter inserts newline
    // Mobile (pointer: coarse) — Enter always inserts newline; use send button
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (!isMobile && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend();
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white px-4 pt-3 pb-4">
      <div className="max-w-3xl mx-auto">
        <div
          className={`flex items-end gap-3 bg-[#F5F3EF] rounded-2xl px-4 py-3 border transition-colors duration-200 ${
            disabled
              ? "border-gray-200 opacity-75"
              : "border-gray-300 focus-within:border-gray-400"
          }`}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              disabled ? "Waiting for response…" : "Type your response…"
            }
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-[#1A1714] placeholder-gray-400 leading-relaxed overflow-y-auto"
            style={{ maxHeight: 160 }}
          />

          <button
            onClick={onSend}
            disabled={!canSend}
            aria-label="Send message"
            className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
              canSend
                ? "text-white shadow-sm active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            style={canSend ? { backgroundColor: activeStage.accent } : {}}
          >
            {/* Arrow-up send icon */}
            <svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 13V3M3 8l5-5 5 5" />
            </svg>
          </button>
        </div>

        <p className="mt-1.5 text-center text-xs text-gray-400 select-none">
          Tap ↑ to send
        </p>
      </div>
    </div>
  );
}
