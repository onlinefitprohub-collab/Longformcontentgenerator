"use client";

import type { ReactNode } from "react";
import { Message } from "@/types";
import { STAGES } from "@/lib/stages";

// ── Inline markdown: ***bold italic***, **bold**, *italic*, `code` ───────────
function parseInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let k = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));

    if (match[1] !== undefined) {
      parts.push(<strong key={k++}><em>{match[1]}</em></strong>);
    } else if (match[2] !== undefined) {
      parts.push(<strong key={k++}>{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      parts.push(<em key={k++}>{match[3]}</em>);
    } else if (match[4] !== undefined) {
      parts.push(
        <code key={k++} className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
          {match[4]}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

// ── Block-level heading helper (avoids dynamic tag variable) ─────────────────
function Heading({
  level,
  className,
  children,
}: {
  level: number;
  className: string;
  children: ReactNode;
}) {
  switch (level) {
    case 1: return <h1 className={className}>{children}</h1>;
    case 2: return <h2 className={className}>{children}</h2>;
    case 3: return <h3 className={className}>{children}</h3>;
    default: return <h4 className={className}>{children}</h4>;
  }
}

// ── Block markdown renderer ──────────────────────────────────────────────────
function renderMarkdown(text: string): ReactNode {
  const lines = text.split("\n");
  const elements: ReactNode[] = [];
  let i = 0;
  let bk = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      elements.push(<hr key={bk++} className="my-3 border-gray-200" />);
      i++;
      continue;
    }

    // Heading
    const hm = trimmed.match(/^(#{1,4})\s(.+)/);
    if (hm) {
      const level = hm[1].length;
      const cls = [
        "text-base font-bold mt-3 mb-1 text-[#1A1714]",
        "text-sm font-bold mt-2 mb-1 text-[#1A1714]",
        "text-sm font-semibold mt-2 mb-0.5 text-[#1A1714]",
        "text-xs font-semibold mt-1 text-[#1A1714]",
      ][level - 1];
      elements.push(
        <Heading key={bk++} level={level} className={cls}>
          {parseInline(hm[2])}
        </Heading>
      );
      i++;
      continue;
    }

    // Unordered list — collect consecutive items
    if (/^[-*]\s/.test(trimmed)) {
      const items: ReactNode[] = [];
      let lk = 0;
      while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
        items.push(<li key={lk++}>{parseInline(lines[i].trim().slice(2))}</li>);
        i++;
      }
      elements.push(
        <ul key={bk++} className="list-disc list-outside pl-4 my-1.5 space-y-0.5 text-sm">
          {items}
        </ul>
      );
      continue;
    }

    // Ordered list — collect consecutive items
    if (/^\d+\.\s/.test(trimmed)) {
      const items: ReactNode[] = [];
      let lk = 0;
      const startNum = parseInt(trimmed.match(/^(\d+)\./)?.[1] ?? "1", 10);
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(
          <li key={lk++}>{parseInline(lines[i].trim().replace(/^\d+\.\s/, ""))}</li>
        );
        i++;
      }
      elements.push(
        <ol key={bk++} start={startNum} className="list-decimal list-outside pl-4 my-1.5 space-y-0.5 text-sm">
          {items}
        </ol>
      );
      continue;
    }

    // Blank line → spacing
    if (trimmed === "") {
      elements.push(<div key={bk++} className="h-2" />);
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={bk++} className="text-sm leading-relaxed">
        {parseInline(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

// ── Component ────────────────────────────────────────────────────────────────
interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const stage = STAGES.find((s) => s.id === message.stageId) ?? STAGES[0];

  // Error state
  if (message.isError) {
    return (
      <div className="mx-auto max-w-3xl w-full px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-red-600 text-sm">{message.content}</p>
        </div>
      </div>
    );
  }

  // User message — dark pill, right-aligned
  if (message.role === "user") {
    return (
      <div className="flex justify-end px-4">
        <div className="max-w-[75%] bg-[#1A1714] text-white rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  // Assistant message — white card, left-aligned, stage tag
  return (
    <div className="flex flex-col items-start px-4 max-w-3xl mx-auto w-full">
      {/* Stage tag */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 border"
        style={{
          color: stage.accent,
          borderColor: `${stage.accent}40`,
          backgroundColor: `${stage.accent}12`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: stage.accent }}
        />
        {stage.label} · {stage.title}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 px-5 py-4 w-full text-[#1A1714]">
        {renderMarkdown(message.content)}
      </div>
    </div>
  );
}
