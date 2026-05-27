"use client";

import { useState, useMemo, type ReactNode } from "react";
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

const DETAIL_TABS = ["Script", "Editing", "Structure", "Notes"] as const;
type DetailTab = (typeof DETAIL_TABS)[number];

const SCRIPT_LABELS = new Set(["TELEPROMPTER SCRIPT", "TELEPROMPTER"]);
const EDITING_LABELS = new Set(["EDITING DIRECTIONS", "EDITING NOTES", "SECTION EDITING NOTES"]);
const STRUCTURE_LABELS = new Set([
  "SUGGESTED LONG-FORM STRUCTURE",
  "STRUCTURE",
  "SUGGESTED STRUCTURE",
  "LONG-FORM STRUCTURE",
]);

function isScriptSubsection(label: string) {
  const u = label.toUpperCase();
  return SCRIPT_LABELS.has(u) || /layer\s*1/i.test(label);
}

function isEditingSubsection(label: string) {
  const u = label.toUpperCase();
  return EDITING_LABELS.has(u) || /layer\s*2/i.test(label);
}

function isStructureSubsection(label: string) {
  const u = label.toUpperCase();
  return STRUCTURE_LABELS.has(u);
}

function getTabSections(subsections: ParsedSubsection[], tab: DetailTab): ParsedSubsection[] {
  switch (tab) {
    case "Script":
      return subsections.filter((s) => isScriptSubsection(s.label));
    case "Editing":
      return subsections.filter((s) => isEditingSubsection(s.label));
    case "Structure":
      return subsections.filter((s) => isStructureSubsection(s.label));
    case "Notes":
      return subsections.filter(
        (s) =>
          !isScriptSubsection(s.label) &&
          !isEditingSubsection(s.label) &&
          !isStructureSubsection(s.label)
      );
  }
}

// ── Data extraction ───────────────────────────────────────────────────────────

function extractVideos(session: SessionData): ParsedVideo[] {
  const byNumber = new Map<number, ParsedVideo>();

  // Walk all assistant messages; later messages with scripts override earlier outlines
  for (const msg of session.messages) {
    if (msg.role !== "assistant" || msg.isError) continue;
    const parsed = parseVideosFromText(msg.content);
    if (!parsed) continue;
    for (const v of parsed) {
      const existing = byNumber.get(v.number);
      // Override if: no existing entry, OR new entry has a script, OR existing has no script
      if (!existing || v.hasScript || !existing.hasScript) {
        byNumber.set(v.number, v);
      }
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

function DetailPanel({ video, colorIdx }: { video: ParsedVideo; colorIdx: number }) {
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
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-sm text-gray-400">
              {activeTab === "Script" && !video.hasScript
                ? "Script not yet generated for this video."
                : `No ${activeTab.toLowerCase()} content available yet.`}
            </p>
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
                  : renderMarkdown(s.content)}
              </div>
            ))}
          </div>
        )}
      </div>
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
}

export default function LibraryPanel({ session }: LibraryPanelProps) {
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const allVideos = useMemo(() => extractVideos(session), [session]);

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
            <DetailPanel video={selectedVideo} colorIdx={selectedColorIdx} />
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
                Click any video in the sidebar to view its content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
