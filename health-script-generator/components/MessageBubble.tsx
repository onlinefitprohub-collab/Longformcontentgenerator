"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Message } from "@/types";
import { STAGES } from "@/lib/stages";
import {
  parseVideosFromText,
  parseScriptSegments,
} from "@/lib/parseVideoContent";
import type { ParsedVideo, ParsedSubsection } from "@/lib/parseVideoContent";

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

    if (/^---+$/.test(trimmed)) {
      elements.push(<hr key={bk++} className="my-3 border-gray-200" />);
      i++;
      continue;
    }

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

    if (trimmed === "") {
      elements.push(<div key={bk++} className="h-2" />);
      i++;
      continue;
    }

    elements.push(
      <p key={bk++} className="text-sm leading-relaxed">
        {parseInline(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

// ── Video accordion ──────────────────────────────────────────────────────────

// Local alias for legacy VideoBlock shape (MessageBubble uses number as string in badge)
type VideoBlock = ParsedVideo & { numberStr: string };

function parseVideos(text: string): { preamble: string; videos: VideoBlock[] } | null {
  const lines = text.split("\n");
  const videoStarts: number[] = [];

  lines.forEach((line, idx) => {
    if (/^VIDEO\s+\d+[:\s]/i.test(line.trim())) {
      videoStarts.push(idx);
    }
  });

  if (videoStarts.length === 0) return null;

  const preamble = lines.slice(0, videoStarts[0]).join("\n").trim();

  const parsed = parseVideosFromText(text);
  if (!parsed) return null;

  const videos: VideoBlock[] = parsed.map((v) => ({
    ...v,
    numberStr: String(v.number),
  }));

  return { preamble, videos };
}

const MINOR_WORDS = new Set(["a", "an", "the", "and", "or", "of", "in", "to", "for"]);
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((w, i) => (i === 0 || !MINOR_WORDS.has(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`flex-shrink-0 w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function EditCueCard({ timing, content }: { timing?: string; content: string }) {
  return (
    <div className="bg-teal-50 border-l-4 border-teal-400 rounded-r-lg px-3 py-2 my-1.5 flex items-start gap-2">
      {timing && (
        <span className="flex-shrink-0 bg-teal-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5">
          {timing}
        </span>
      )}
      <span className="text-xs text-teal-800 leading-snug">{content}</span>
    </div>
  );
}

function renderScriptContent(content: string): ReactNode {
  const segments = parseScriptSegments(content);
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === "cue" ? (
          <EditCueCard key={i} timing={seg.timing} content={seg.content} />
        ) : (
          <div key={i}>{renderMarkdown(seg.content)}</div>
        )
      )}
    </>
  );
}

const SCRIPT_SECTION_LABELS = new Set([
  "TELEPROMPTER SCRIPT",
  "TELEPROMPTER",
]);

function isScriptSection(label: string): boolean {
  const upper = label.toUpperCase();
  return SCRIPT_SECTION_LABELS.has(upper) || /layer\s*1/i.test(label);
}

function SubsectionPanel({ section }: { section: ParsedSubsection }) {
  const [open, setOpen] = useState(false);
  const isScript = isScriptSection(section.label);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-xs font-semibold text-gray-500 tracking-wide">
          {toTitleCase(section.label)}
        </span>
        <ChevronDown open={open} />
      </button>
      {open && (
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          {isScript ? renderScriptContent(section.content) : renderMarkdown(section.content)}
        </div>
      )}
    </div>
  );
}

function VideoCard({ video, accent }: { video: VideoBlock; accent: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          {video.numberStr}
        </span>
        <span className="flex-1 text-sm font-semibold text-[#1A1714] leading-snug">
          {video.title}
        </span>
        <ChevronDown open={open} />
      </button>
      {open && video.subsections.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50 p-3 space-y-2">
          {video.subsections.map((s, i) => (
            <SubsectionPanel key={i} section={s} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const stage = STAGES.find((s) => s.id === message.stageId) ?? STAGES[0];
  const videoData =
    message.role === "assistant" && !message.isError
      ? parseVideos(message.content)
      : null;

  if (message.isError) {
    return (
      <div className="mx-auto max-w-3xl w-full px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-red-600 text-sm">{message.content}</p>
        </div>
      </div>
    );
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end px-4">
        <div className="max-w-[75%] bg-[#1A1714] text-white rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

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
        {videoData ? (
          <div className="space-y-2">
            {videoData.preamble && (
              <div className="mb-3">{renderMarkdown(videoData.preamble)}</div>
            )}
            {videoData.videos.map((video, i) => (
              <VideoCard key={i} video={video} accent={stage.accent} />
            ))}
          </div>
        ) : (
          renderMarkdown(message.content)
        )}
      </div>
    </div>
  );
}
