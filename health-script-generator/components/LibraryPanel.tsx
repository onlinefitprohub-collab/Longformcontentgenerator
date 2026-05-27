"use client";

import { useState, useMemo, useEffect, type ReactNode } from "react";
import { SessionData } from "@/types";
import { STAGES } from "@/lib/stages";
import {
  parseVideosFromText,
  parseScriptSegments,
} from "@/lib/parseVideoContent";
import type { ParsedVideo, ParsedSubsection } from "@/lib/parseVideoContent";

// ── Inline markdown helpers (self-contained copy for LibraryPanel) ────────────

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

function HeadingTag({ level, className, children }: { level: number; className: string; children: ReactNode }) {
  switch (level) {
    case 1: return <h1 className={className}>{children}</h1>;
    case 2: return <h2 className={className}>{children}</h2>;
    case 3: return <h3 className={className}>{children}</h3>;
    default: return <h4 className={className}>{children}</h4>;
  }
}

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
        <HeadingTag key={bk++} level={level} className={cls}>
          {parseInline(hm[2])}
        </HeadingTag>
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

// ── Editor cue card ───────────────────────────────────────────────────────────

function EditCueCard({ timing, content }: { timing?: string; content: string }) {
  const typeMatch = content.match(/^([A-Z][A-Z /&-]{1,30}):\s*/);
  const cueType = typeMatch ? typeMatch[1] : "EDITOR CUE";
  const body = typeMatch ? content.slice(typeMatch[0].length) : content;

  return (
    <div className="border border-dashed border-amber-300 bg-amber-50 rounded-lg px-3 py-2.5 my-2 flex gap-2.5">
      {/* Scissors icon */}
      <svg className="flex-shrink-0 w-3.5 h-3.5 text-amber-400 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
        <path d="M3.5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm9 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM5.06 5.43l5.38 3.19.07.88-5.45 3.23-.19-.98.81-3.24-.62-2.98.19-.1z"/>
      </svg>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <span className="text-[9px] font-bold tracking-widest text-amber-600 uppercase">{cueType}</span>
          {timing && (
            <span className="bg-amber-500 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded leading-none">
              {timing}
            </span>
          )}
        </div>
        <p className="text-xs text-amber-900 leading-snug">{body}</p>
      </div>
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

// ── Editing content renderer — visually structured for editor handoff ─────────

function renderEditingContent(text: string): ReactNode {
  const lines = text.split("\n");
  const elements: ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (trimmed === "") { i++; continue; }

    // ── ALL-CAPS bold section header: **ASSETS TO SOURCE (Stock Footage)** ──
    const allCapsBold = trimmed.match(/^\*\*([A-Z][A-Z\s\-()/:&,]+)\*\*\s*:?\s*$/);
    if (allCapsBold) {
      elements.push(
        <div key={k++} className="flex items-center gap-2 mt-6 mb-2 pt-5 border-t border-gray-200">
          <div className="w-1 h-3.5 bg-teal-500 rounded-full flex-shrink-0" />
          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">{allCapsBold[1]}</span>
        </div>
      );
      i++; continue;
    }

    // ── Section with timestamp: **Hook section (0:00–1:00):** ──
    const sectionTime = trimmed.match(/^\*\*(.+?)\s*\((\d+:\d+[–\-]\d+:\d+)\)\s*:?\*\*\s*:?\s*$/);
    if (sectionTime) {
      elements.push(
        <div key={k++} className="flex items-center gap-2 mt-4 mb-1">
          <span className="text-xs font-semibold text-gray-700">{sectionTime[1]}</span>
          <span className="bg-gray-100 text-gray-500 text-[10px] font-mono px-1.5 py-0.5 rounded">{sectionTime[2]}</span>
        </div>
      );
      i++; continue;
    }

    // ── Bold label only: **Step title** or **Step title:** ──
    const boldLabel = trimmed.match(/^\*\*([^*]+)\*\*\s*:?\s*$/);
    if (boldLabel) {
      elements.push(
        <p key={k++} className="text-xs font-semibold text-gray-600 mt-3 mb-1">{boldLabel[1]}</p>
      );
      i++; continue;
    }

    // ── GRAPHIC REQUIRED / GRAPHIC TO BUILD callout ──
    if (/^GRAPHIC (REQUIRED|TO BUILD)/i.test(trimmed)) {
      const body = trimmed.replace(/^GRAPHIC (REQUIRED|TO BUILD)\s*[—\-]\s*/i, "");
      elements.push(
        <div key={k++} className="bg-violet-50 border border-violet-200 rounded-lg px-3 py-2.5 my-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <svg className="w-3 h-3 text-violet-500 flex-shrink-0" viewBox="0 0 12 12" fill="currentColor">
              <path d="M1 1h4v4H1zM7 1h4v4H7zM1 7h4v4H1zM7 7h4v4H7z" opacity=".4"/>
              <path d="M2 2h2v2H2zM8 2h2v2H8zM2 8h2v2H2zM8 8h2v2H8z"/>
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-widest text-violet-600">Graphic to Build</span>
          </div>
          <p className="text-xs text-violet-900 leading-snug">{parseInline(body)}</p>
        </div>
      );
      i++; continue;
    }

    // ── Checklist items: ☐ item text ──
    if (/^[☐☑□✓]/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[☐☑□✓]/.test(lines[i].trim())) {
        items.push(lines[i].trim().slice(1).trim());
        i++;
      }
      elements.push(
        <div key={k++} className="my-2 space-y-2">
          {items.map((item, j) => (
            <div key={j} className="flex items-start gap-2.5 bg-gray-50 rounded-lg px-3 py-2">
              <div className="flex-shrink-0 w-4 h-4 border-2 border-gray-300 rounded-sm mt-0.5 bg-white" />
              <span className="text-xs text-gray-700 leading-snug">{parseInline(item)}</span>
            </div>
          ))}
        </div>
      );
      continue;
    }

    // ── Numbered steps: (1) or 1. ──
    const numStep = trimmed.match(/^(?:\((\d+)\)|(\d+)\.)\s+(.+)/);
    if (numStep) {
      const items: Array<{ n: string; body: string }> = [
        { n: numStep[1] ?? numStep[2], body: numStep[3] },
      ];
      i++;
      while (i < lines.length) {
        const nm = lines[i].trim().match(/^(?:\((\d+)\)|(\d+)\.)\s+(.+)/);
        if (nm) { items.push({ n: nm[1] ?? nm[2], body: nm[3] }); i++; }
        else break;
      }
      elements.push(
        <div key={k++} className="my-2 space-y-2">
          {items.map((item, j) => (
            <div key={j} className="flex items-start gap-2.5">
              <span className="flex-shrink-0 w-5 h-5 bg-gray-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center mt-0.5 leading-none">
                {item.n}
              </span>
              <span className="text-xs text-gray-700 leading-snug">{parseInline(item.body)}</span>
            </div>
          ))}
        </div>
      );
      continue;
    }

    // ── Info prefix callouts: Timing: / Pacing: / Camera note: etc ──
    const infoPrefix = trimmed.match(/^(Timing|Pacing|Camera note|Camera|Note|Search|Platform|Music note|Framing)\s*:\s*/i);
    if (infoPrefix) {
      const body = trimmed.slice(infoPrefix[0].length);
      elements.push(
        <div key={k++} className="flex items-start gap-2 bg-sky-50 border border-sky-100 rounded-lg px-3 py-2 my-1.5">
          <span className="text-[9px] font-bold uppercase tracking-widest text-sky-500 mt-0.5 flex-shrink-0 w-14 leading-tight">{infoPrefix[1]}</span>
          <p className="text-xs text-sky-800 leading-snug">{parseInline(body)}</p>
        </div>
      );
      i++; continue;
    }

    // ── Em-dash list items: — Label: content  or  — plain item ──
    if (/^—\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^—\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().slice(2).trim());
        i++;
      }
      elements.push(
        <div key={k++} className="my-2 space-y-1.5">
          {items.map((item, j) => {
            // "Label: rest of content" → render label as a badge
            const lm = item.match(/^([^:]{1,50}):\s+(.+)/);
            if (lm) {
              return (
                <div key={j} className="flex items-start gap-2.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                  <span className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wide text-gray-400 mt-0.5 w-20 leading-tight">{lm[1]}</span>
                  <span className="text-xs text-gray-700 leading-snug">{parseInline(lm[2])}</span>
                </div>
              );
            }
            return (
              <div key={j} className="flex items-start gap-2 px-1">
                <span className="flex-shrink-0 text-gray-300 text-sm leading-none mt-0.5">—</span>
                <span className="text-xs text-gray-700 leading-snug">{parseInline(item)}</span>
              </div>
            );
          })}
        </div>
      );
      continue;
    }

    // ── Hyphen bullet list: - item ──
    if (/^-\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^-\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <div key={k++} className="my-1.5 space-y-1">
          {items.map((item, j) => (
            <div key={j} className="flex items-start gap-2 text-xs text-gray-700 leading-snug">
              <span className="flex-shrink-0 w-1 h-1 rounded-full bg-gray-400 mt-1.5" />
              <span>{parseInline(item)}</span>
            </div>
          ))}
        </div>
      );
      continue;
    }

    // ── Regular paragraph ──
    elements.push(
      <p key={k++} className="text-xs text-gray-700 leading-relaxed">{parseInline(raw)}</p>
    );
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

// ── Theme colours (cycle through stage accents) ───────────────────────────────

const THEME_COLORS = STAGES.map((s) => s.accent);

function themeColor(idx: number): string {
  return THEME_COLORS[idx % THEME_COLORS.length];
}

// ── Status helpers ────────────────────────────────────────────────────────────

type VideoStatus = "scripted" | "outlined" | "pending";

function getStatus(video: ParsedVideo): VideoStatus {
  if (video.hasScript) return "scripted";
  if (video.subsections.length > 0) return "outlined";
  return "pending";
}

function StatusDot({ status }: { status: VideoStatus }) {
  const cls =
    status === "scripted"
      ? "bg-emerald-500"
      : status === "outlined"
      ? "bg-amber-400"
      : "bg-gray-300";
  return <span className={`flex-shrink-0 w-2 h-2 rounded-full ${cls}`} />;
}

function StatusBadge({ status }: { status: VideoStatus }) {
  if (status === "scripted")
    return (
      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
        Scripted
      </span>
    );
  if (status === "outlined")
    return (
      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
        Outlined
      </span>
    );
  return (
    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
      Pending
    </span>
  );
}

// ── Tab helpers ───────────────────────────────────────────────────────────────

const DETAIL_TABS = ["Script", "Editing", "Brief", "Notes"] as const;
type DetailTab = (typeof DETAIL_TABS)[number];

const SCRIPT_LABELS = new Set(["TELEPROMPTER SCRIPT", "TELEPROMPTER"]);
const EDITING_LABELS = new Set(["EDITING DIRECTIONS", "EDITING NOTES", "SECTION EDITING NOTES"]);
const BRIEF_LABELS = new Set([
  "SUGGESTED LONG-FORM STRUCTURE",
  "STRUCTURE",
  "SUGGESTED STRUCTURE",
  "LONG-FORM STRUCTURE",
  "PUBLISHING NOTES",
  "RETENTION NOTES",
]);
const META_LABELS = new Set([
  "THEME",
  "THEME / KNOWLEDGE PILLAR",
  "AUDIENCE PROBLEM ADDRESSED",
  "ONE-LINE VIDEO DESCRIPTION",
  "CORE STORY OR CASE STUDY TO USE",
  "PRIMARY VIEWER TAKEAWAY",
  "VIDEO NUMBER",
  "TITLE",
]);

function isScriptSubsection(label: string) {
  const u = label.toUpperCase();
  return SCRIPT_LABELS.has(u) || /layer\s*1/i.test(label);
}

function isEditingSubsection(label: string) {
  const u = label.toUpperCase();
  return EDITING_LABELS.has(u) || /layer\s*2/i.test(label);
}

function isBriefSubsection(label: string) {
  const u = label.toUpperCase();
  return BRIEF_LABELS.has(u);
}

function isMetaSubsection(label: string) {
  const u = label.toUpperCase();
  return META_LABELS.has(u);
}

function getTabSections(subsections: ParsedSubsection[], tab: DetailTab): ParsedSubsection[] {
  switch (tab) {
    case "Script":
      return subsections.filter((s) => isScriptSubsection(s.label));
    case "Editing":
      return subsections.filter((s) => isEditingSubsection(s.label));
    case "Brief":
      return subsections.filter((s) => isBriefSubsection(s.label));
    case "Notes":
      return subsections.filter(
        (s) =>
          !isScriptSubsection(s.label) &&
          !isEditingSubsection(s.label) &&
          !isBriefSubsection(s.label) &&
          !isMetaSubsection(s.label)
      );
  }
}

// ── Data extraction ───────────────────────────────────────────────────────────

function mergeVideoSubsections(existing: ParsedVideo, incoming: ParsedVideo): ParsedVideo {
  if (incoming.hasScript && !existing.hasScript) {
    // incoming has the script — keep its script/editing sections, add brief sections from existing
    const nonScriptFromExisting = existing.subsections.filter(
      (s) => !isScriptSubsection(s.label) && !isEditingSubsection(s.label)
    );
    const existingLabels = new Set(incoming.subsections.map((s) => s.label.toUpperCase()));
    const toAdd = nonScriptFromExisting.filter((s) => !existingLabels.has(s.label.toUpperCase()));
    return { ...incoming, subsections: [...incoming.subsections, ...toAdd] };
  }
  if (existing.hasScript && !incoming.hasScript) {
    // existing has the script — add any new brief/structure labels from incoming
    const existingLabels = new Set(existing.subsections.map((s) => s.label.toUpperCase()));
    const toAdd = incoming.subsections.filter((s) => !existingLabels.has(s.label.toUpperCase()));
    return { ...existing, subsections: [...existing.subsections, ...toAdd] };
  }
  // Both have or both lack a script — prefer whichever is richer
  return incoming.subsections.length >= existing.subsections.length ? incoming : existing;
}

function extractVideos(session: SessionData): ParsedVideo[] {
  const byNumber = new Map<number, ParsedVideo>();

  // Walk all assistant messages; merge subsections rather than replace
  for (const msg of session.messages) {
    if (msg.role !== "assistant" || msg.isError) continue;
    const parsed = parseVideosFromText(msg.content);
    if (!parsed) continue;
    for (const v of parsed) {
      const existing = byNumber.get(v.number);
      byNumber.set(v.number, existing ? mergeVideoSubsections(existing, v) : v);
    }
  }

  // Also add any from session.videoTitles not yet in messages
  if (session.videoTitles) {
    for (const vt of session.videoTitles) {
      if (!byNumber.has(vt.number)) {
        byNumber.set(vt.number, {
          number: vt.number,
          title: vt.title,
          subsections: [],
          hasScript: false,
        });
      }
    }
  }

  return Array.from(byNumber.values()).sort((a, b) => a.number - b.number);
}

// ── Group videos by loose theme buckets (every 8) ────────────────────────────

interface VideoGroup {
  label: string;
  colorIdx: number;
  videos: ParsedVideo[];
}

function groupVideos(videos: ParsedVideo[]): VideoGroup[] {
  if (videos.length === 0) return [];
  const groups: VideoGroup[] = [];
  const size = 8;
  for (let i = 0; i < videos.length; i += size) {
    const chunk = videos.slice(i, i + size);
    const first = chunk[0].number;
    const last = chunk[chunk.length - 1].number;
    groups.push({
      label: `Videos ${first}–${last}`,
      colorIdx: Math.floor(i / size),
      videos: chunk,
    });
  }
  return groups;
}

// ── Detail panel ──────────────────────────────────────────────────────────────

interface DetailPanelProps {
  video: ParsedVideo;
  colorIdx: number;
  onGenerateScript?: (videoNum: number, title: string) => void;
}

function DetailPanel({ video, colorIdx, onGenerateScript }: DetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("Script");
  const status = getStatus(video);
  const accent = themeColor(colorIdx);
  const sections = getTabSections(video.subsections, activeTab);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <span
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white mt-0.5"
            style={{ backgroundColor: accent }}
          >
            {video.number}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-[#1A1714] leading-snug">{video.title}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <StatusBadge status={status} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mt-4 border-b border-gray-200">
          {DETAIL_TABS.map((tab) => {
            const isActive = tab === activeTab;
            const hasSections = getTabSections(video.subsections, tab).length > 0;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors ${
                  isActive
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                } ${!hasSections && !isActive ? "opacity-40" : ""}`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center gap-3">
            {activeTab === "Script" && !video.hasScript && onGenerateScript ? (
              <>
                <p className="text-sm text-gray-400">Script not yet generated for this video.</p>
                <button
                  onClick={() => onGenerateScript(video.number, video.title)}
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-teal-500 hover:bg-teal-600 px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M8 3l5 5-5 5"/>
                  </svg>
                  Generate Script for Video {video.number}
                </button>
              </>
            ) : activeTab === "Brief" ? (
              <p className="text-sm text-gray-400">
                Brief content is generated alongside the video outline (Stage 7).
              </p>
            ) : (
              <p className="text-sm text-gray-400">
                No {activeTab.toLowerCase()} content available yet.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((s, i) => (
              <div key={i}>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  {s.label}
                </p>
                {activeTab === "Script"
                  ? renderScriptContent(s.content)
                  : activeTab === "Editing"
                  ? renderEditingContent(s.content)
                  : renderMarkdown(s.content)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate script CTA for non-script tabs when script is missing */}
      {status !== "scripted" && activeTab !== "Script" && onGenerateScript && (
        <div className="flex-shrink-0 border-t border-gray-100 px-6 py-3 bg-gray-50">
          <button
            onClick={() => onGenerateScript(video.number, video.title)}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-teal-600 hover:text-teal-700 hover:bg-teal-50 border border-teal-200 hover:border-teal-300 px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7h10M7 2l5 5-5 5"/>
            </svg>
            Generate Script for Video {video.number}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Mobile back button ────────────────────────────────────────────────────────

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 px-4 py-3 border-b border-gray-100 w-full bg-white"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2L4 7l5 5" />
      </svg>
      Back to list
    </button>
  );
}

// ── LibraryPanel ──────────────────────────────────────────────────────────────

interface LibraryPanelProps {
  session: SessionData;
  onGenerateScript?: (videoNum: number, title: string) => void;
}

export default function LibraryPanel({ session, onGenerateScript }: LibraryPanelProps) {
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const allVideos = useMemo(() => extractVideos(session), [session]);

  // Auto-select first scripted video (or first video) when panel first mounts
  useEffect(() => {
    if (allVideos.length === 0) return;
    const firstScripted = allVideos.find((v) => v.hasScript);
    setSelectedNum((prev) => prev ?? (firstScripted ?? allVideos[0]).number);
  }, [allVideos]);

  const filtered = useMemo(() => {
    if (!search.trim()) return allVideos;
    const q = search.toLowerCase();
    return allVideos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        String(v.number).includes(q)
    );
  }, [allVideos, search]);

  const groups = useMemo(() => groupVideos(filtered), [filtered]);

  const selectedVideo = useMemo(
    () => allVideos.find((v) => v.number === selectedNum) ?? null,
    [allVideos, selectedNum]
  );

  // Find color index for selected video
  const selectedColorIdx = useMemo(() => {
    if (!selectedVideo) return 0;
    const allGroups = groupVideos(allVideos);
    for (let gi = 0; gi < allGroups.length; gi++) {
      if (allGroups[gi].videos.some((v) => v.number === selectedVideo.number)) {
        return allGroups[gi].colorIdx;
      }
    }
    return 0;
  }, [allVideos, selectedVideo]);

  function toggleGroup(label: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  if (allVideos.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-sm text-center bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7h18M3 12h18M3 17h10" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">No videos yet</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Videos will appear here as they&apos;re generated during your interview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex">
      {/* ── Left sidebar ────────────────────────────────────────────────── */}
      {/* On mobile: hide when a video is selected */}
      <aside
        className={`flex-shrink-0 bg-white border-r border-gray-100 flex flex-col ${
          selectedNum !== null ? "hidden md:flex" : "flex"
        } w-full md:w-[280px]`}
      >
        {/* Search */}
        <div className="flex-shrink-0 px-3 pt-3 pb-2 border-b border-gray-100">
          <div className="relative">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="7" cy="7" r="5" />
              <path d="M11 11l3 3" />
            </svg>
            <input
              type="text"
              placeholder="Search videos…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent placeholder-gray-400"
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 pl-0.5">
            {allVideos.length} video{allVideos.length !== 1 ? "s" : ""}
            {search && ` · ${filtered.length} match${filtered.length !== 1 ? "es" : ""}`}
          </p>
        </div>

        {/* Video list */}
        <div className="flex-1 overflow-y-auto py-2">
          {groups.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-6">No results</p>
          )}
          {groups.map((group) => {
            const collapsed = collapsedGroups.has(group.label);
            const accent = themeColor(group.colorIdx);
            return (
              <div key={group.label} className="mb-1">
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 flex-1">
                    {group.label}
                  </span>
                  <svg
                    className={`w-3 h-3 text-gray-300 transition-transform ${collapsed ? "-rotate-90" : ""}`}
                    viewBox="0 0 12 12"
                    fill="currentColor"
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Items */}
                {!collapsed &&
                  group.videos.map((video) => {
                    const isActive = video.number === selectedNum;
                    const status = getStatus(video);
                    return (
                      <button
                        key={video.number}
                        onClick={() => setSelectedNum(video.number)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors border-l-2 ${
                          isActive
                            ? "bg-teal-50 border-l-teal-500"
                            : "border-l-transparent hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                          style={{ backgroundColor: accent }}
                        >
                          {video.number}
                        </span>
                        <span
                          className={`flex-1 text-xs leading-snug truncate ${
                            isActive ? "font-semibold text-[#1A1714]" : "text-gray-600"
                          }`}
                        >
                          {video.title}
                        </span>
                        <StatusDot status={status} />
                      </button>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── Right detail panel ───────────────────────────────────────────── */}
      <div
        className={`flex-1 min-w-0 flex flex-col bg-[#F5F3EF] ${
          selectedNum !== null ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedVideo ? (
          <div className="flex flex-col h-full bg-white">
            {/* Mobile back */}
            <div className="md:hidden flex-shrink-0">
              <BackButton onClick={() => setSelectedNum(null)} />
            </div>
            <DetailPanel video={selectedVideo} colorIdx={selectedColorIdx} onGenerateScript={onGenerateScript} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h12M4 10h12M4 14h8" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-500">Select a video</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Pick any video from the sidebar to view its script, editing directions, and structure.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
