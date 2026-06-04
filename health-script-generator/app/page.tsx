"use client";

import { useState, useEffect } from "react";
import { SessionData, Message } from "@/types";
import { WELCOME_MESSAGE } from "@/lib/prompt";
import {
  parseStageFromText,
  detectVideoTitlesPresent,
  detectScriptPresent,
  detectEditingDirectionsPresent,
} from "@/lib/parseStage";
import StageProgress from "@/components/StageProgress";
import ChatWindow from "@/components/ChatWindow";
import InputBar from "@/components/InputBar";
import ExportPanel from "@/components/ExportPanel";
import LibraryPanel from "@/components/LibraryPanel";
import { parseVideosFromText } from "@/lib/parseVideoContent";

const SESSION_KEY = "hsg_session";

// ── Helpers ───────────────────────────────────────────────────────────────────

function createFreshSession(): SessionData {
  const now = Date.now();
  return {
    startedAt: now,
    messages: [
      {
        role: "assistant",
        content: WELCOME_MESSAGE,
        stageId: 0,
        timestamp: now,
      },
    ],
    currentStageIdx: 0,
  };
}

function saveSession(session: SessionData) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Quota exceeded or private browsing — fail silently
  }
}

function sessionHasExportContent(session: SessionData): boolean {
  return session.messages.some(
    (m) =>
      m.role === "assistant" &&
      !m.isError &&
      (detectVideoTitlesPresent(m.content) || detectScriptPresent(m.content))
  );
}

function countVideosInSession(session: SessionData): number {
  const seen = new Set<number>();
  for (const msg of session.messages) {
    if (msg.role !== "assistant" || msg.isError) continue;
    const parsed = parseVideosFromText(msg.content);
    if (parsed) parsed.forEach((v) => seen.add(v.number));
  }
  if (session.videoTitles) {
    session.videoTitles.forEach((vt) => seen.add(vt.number));
  }
  return seen.size;
}

function computeShowGenerateScripts(messages: Message[]): boolean {
  const asMsgs = messages.filter((m) => m.role === "assistant" && !m.isError);
  const hasDirections = asMsgs.some((m) => detectEditingDirectionsPresent(m.content));
  const hasScripts = asMsgs.some((m) => detectScriptPresent(m.content));
  return hasDirections && !hasScripts;
}

// ── Loading screen ────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#F5F3EF]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
          style={{ background: "linear-gradient(135deg, #10B981 0%, #0891B2 100%)" }}>
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="1.5" width="12" height="15" rx="2"/>
            <line x1="6.5" y1="6" x2="11.5" y2="6"/>
            <line x1="6.5" y1="9" x2="11.5" y2="9"/>
            <line x1="6.5" y1="12" x2="9.5" y2="12"/>
          </svg>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-[#10B981] rounded-full animate-spin" />
          <p className="text-xs text-gray-400 mt-1">Loading…</p>
        </div>
      </div>
    </div>
  );
}

// ── Resume modal ──────────────────────────────────────────────────────────────

interface ResumeModalProps {
  pending: SessionData;
  onResume: () => void;
  onStartFresh: () => void;
}

function ResumeModal({ pending, onResume, onStartFresh }: ResumeModalProps) {
  const msgCount = pending.messages.length;
  const savedDate = new Date(pending.startedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
          style={{ background: "linear-gradient(135deg, #10B981 0%, #0891B2 100%)" }}>
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
        </div>

        <h2 className="text-lg font-bold text-[#1A1714] mb-1">
          Resume your session?
        </h2>
        <p className="text-sm text-gray-500 mb-1">
          You have a previous interview started on{" "}
          <span className="font-medium text-gray-700">{savedDate}</span>.
        </p>
        <p className="text-sm text-gray-400 mb-6">
          {msgCount} message{msgCount !== 1 ? "s" : ""} ·{" "}
          Stage {pending.currentStageIdx} of 7
          {pending.practitionerName
            ? ` · ${pending.practitionerName}`
            : ""}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onStartFresh}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            Start Fresh
          </button>
          <button
            onClick={onResume}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#10B981] text-white text-sm font-medium hover:bg-[#059669] active:scale-[0.98] transition-all"
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [pendingSession, setPendingSession] = useState<SessionData | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showGenerateScripts, setShowGenerateScripts] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<"interview" | "library">("interview");

  // ── localStorage init ──────────────────────────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as SessionData;
        // Only offer resume if the session has user messages (i.e. real progress)
        const hasProgress = parsed.messages.some((m) => m.role === "user");
        if (hasProgress) {
          setPendingSession(parsed);
          setShowResumeModal(true);
          setInitialized(true);
          return;
        }
      } catch {
        // Corrupt data — fall through to fresh
      }
    }
    const fresh = createFreshSession();
    setSession(fresh);
    saveSession(fresh);
    setInitialized(true);
  }, []);

  // ── Session actions ────────────────────────────────────────────────────────

  function handleResume() {
    if (!pendingSession) return;
    setSession(pendingSession);
    setShowExport(sessionHasExportContent(pendingSession));
    setShowGenerateScripts(computeShowGenerateScripts(pendingSession.messages));
    if (countVideosInSession(pendingSession) > 0) setActiveTab("library");
    setShowResumeModal(false);
    setPendingSession(null);
  }

  function handleStartFresh() {
    const fresh = createFreshSession();
    setSession(fresh);
    saveSession(fresh);
    setShowExport(false);
    setShowGenerateScripts(false);
    setInputValue("");
    setShowResumeModal(false);
    setPendingSession(null);
  }

  // ── Message submission with streaming ────────────────────────────────────

  async function sendMessage(text: string) {
    if (!session || !text.trim() || isLoading) return;

    const stageId = session.currentStageIdx;
    const now = Date.now();

    const userMsg: Message = {
      role: "user",
      content: text.trim(),
      stageId,
      timestamp: now,
    };

    // Placeholder for the streaming assistant reply
    const assistantMsg: Message = {
      role: "assistant",
      content: "",
      stageId,
      timestamp: now + 1,
    };

    // Snapshot base messages before this turn for final session construction
    const baseMessages = session.messages;

    setSession((prev) =>
      prev ? { ...prev, messages: [...prev.messages, userMsg, assistantMsg] } : prev
    );
    setIsLoading(true);

    try {
      // Anthropic API requires messages to start with a user turn.
      // The WELCOME_MESSAGE is an assistant-only opener — skip it for the API.
      const history = [...baseMessages, userMsg].filter((m) => !m.isError);
      const firstUserIdx = history.findIndex((m) => m.role === "user");
      const apiMessages = firstUserIdx >= 0 ? history.slice(firstUserIdx) : history;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, stageIdx: stageId }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "Unknown error");
        throw new Error(errText);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let content = "";

      // ── Stream tokens into the placeholder message ─────────────────────
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        content += decoder.decode(value, { stream: true });

        setSession((prev) => {
          if (!prev) return prev;
          const msgs = [...prev.messages];
          msgs[msgs.length - 1] = { ...assistantMsg, content };
          return { ...prev, messages: msgs };
        });
      }

      // ── Post-stream: stage advancement + export detection ──────────────
      const completedStage = parseStageFromText(content);
      const newStageIdx =
        completedStage !== null ? Math.min(completedStage + 1, 7) : stageId;

      if (detectVideoTitlesPresent(content) || detectScriptPresent(content)) {
        setShowExport(true);
      }

      const finalMessages = [
        ...baseMessages,
        userMsg,
        { ...assistantMsg, content },
      ];
      setShowGenerateScripts(computeShowGenerateScripts(finalMessages));

      const finalSession: SessionData = {
        ...session,
        currentStageIdx: newStageIdx,
        messages: finalMessages,
      };

      setSession(finalSession);
      saveSession(finalSession);
    } catch (err) {
      console.error("Chat error:", err);
      setSession((prev) => {
        if (!prev) return prev;
        const msgs = [...prev.messages];
        msgs[msgs.length - 1] = {
          ...assistantMsg,
          content:
            "Something went wrong. Please check your connection and try again.",
          isError: true,
        };
        return { ...prev, messages: msgs };
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSend() {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue("");
    await sendMessage(text);
  }

  async function handleGenerateScripts() {
    await sendMessage(
      "Please begin writing the full teleprompter scripts one by one, starting with Video 1."
    );
  }

  async function handleGenerateVideoScript(videoNum: number, title: string) {
    setActiveTab("interview");
    await sendMessage(
      `Please write the full teleprompter script for Video ${videoNum}: "${title}"`
    );
  }

  async function handleLoadDemo() {
    const hasProgress = session?.messages.some((m) => m.role === "user");
    if (
      hasProgress &&
      !window.confirm(
        "Load the example menopause specialist session? This will replace your current session."
      )
    )
      return;
    try {
      const res = await fetch("/demo-session.json");
      const demo = (await res.json()) as SessionData;
      setSession(demo);
      saveSession(demo);
      setShowExport(sessionHasExportContent(demo));
      setShowGenerateScripts(computeShowGenerateScripts(demo.messages));
      setInputValue("");
      if (countVideosInSession(demo) > 0) setActiveTab("library");
    } catch {
      alert("Failed to load demo. Please try again.");
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  // Show loading screen until localStorage check completes
  if (!initialized || (!session && !showResumeModal)) {
    return <LoadingScreen />;
  }

  // While the resume modal is deciding, show modal over a minimal bg
  if (showResumeModal && pendingSession && !session) {
    return (
      <div className="h-screen bg-[#F5F3EF]">
        <ResumeModal
          pending={pendingSession}
          onResume={handleResume}
          onStartFresh={handleStartFresh}
        />
      </div>
    );
  }

  if (!session) return <LoadingScreen />;

  const videoCount = countVideosInSession(session);
  const showLibraryTab = showExport || videoCount > 0;

  return (
    <>
      {/* Resume modal over the full layout (e.g. fast-path edge case) */}
      {showResumeModal && pendingSession && (
        <ResumeModal
          pending={pendingSession}
          onResume={handleResume}
          onStartFresh={handleStartFresh}
        />
      )}

      <div className="flex flex-col h-[100dvh] bg-[#F5F3EF]">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <header className="bg-white border-b border-gray-100 flex-shrink-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">

            {/* Brand */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: "linear-gradient(135deg, #10B981 0%, #0891B2 100%)" }}>
                <svg className="w-4.5 h-4.5" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="1.5" width="12" height="15" rx="2"/>
                  <line x1="6.5" y1="6" x2="11.5" y2="6"/>
                  <line x1="6.5" y1="9" x2="11.5" y2="9"/>
                  <line x1="6.5" y1="12" x2="9.5" y2="12"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-[#1A1714] leading-tight">
                  Fitness Script Generator
                </h1>
                <p className="text-[11px] text-gray-400 leading-tight mt-0.5">
                  AI interview · 52 long-form video scripts
                  {session.practitionerName && (
                    <span className="text-gray-600 font-medium"> · {session.practitionerName}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handleLoadDemo}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#3B82F6] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-100"
              >
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 1l1.5 3.5H11L8.5 6.5l1 3.5L6 8l-3.5 2 1-3.5L1 4.5h3.5z"/>
                </svg>
                Example
              </button>
              <div className="w-px h-4 bg-gray-200" />
              <button
                onClick={() => {
                  if (window.confirm("Start a new session? Your current progress will be cleared.")) {
                    handleStartFresh();
                  }
                }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-50"
              >
                New
              </button>
            </div>
          </div>

          <StageProgress currentStageIdx={session.currentStageIdx} />
        </header>

        {/* ── Tab bar ───────────────────────────────────────────────────── */}
        {showLibraryTab && (
          <div className="bg-white border-b border-gray-100 flex-shrink-0">
            <div className="max-w-3xl mx-auto px-4 flex gap-0">
              <button
                onClick={() => setActiveTab("interview")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === "interview"
                    ? "border-teal-500 text-teal-600 font-semibold"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h10M2 7h10M2 11h5"/>
                </svg>
                Interview
              </button>
              <button
                onClick={() => setActiveTab("library")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === "library"
                    ? "border-teal-500 text-teal-600 font-semibold"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1.5" y="2" width="4" height="10" rx="1"/>
                  <rect x="7" y="2" width="5.5" height="4.5" rx="1"/>
                  <rect x="7" y="7.5" width="5.5" height="4.5" rx="1"/>
                </svg>
                Video Library
                {videoCount > 0 && (
                  <span className="bg-teal-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {videoCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Library panel ─────────────────────────────────────────────── */}
        {activeTab === "library" ? (
          <div className="flex-1 min-h-0 flex flex-col">
            <LibraryPanel session={session} onGenerateScript={handleGenerateVideoScript} />
          </div>
        ) : (
          <>
        {/* ── Chat area — fills remaining height, scrolls internally ──── */}
        <main className="flex-1 min-h-0 flex flex-col">

          {/* Library shortcut banner — shown when videos are ready */}
          {videoCount > 0 && (
            <div className="flex-shrink-0 border-b border-teal-100 bg-teal-50 px-4 py-2">
              <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
                <p className="text-xs text-teal-700">
                  <span className="font-semibold">{videoCount} video{videoCount !== 1 ? "s" : ""} ready</span>
                  {" — view scripts, editing directions &amp; structure in the Library."}
                </p>
                <button
                  onClick={() => setActiveTab("library")}
                  className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-100 hover:bg-teal-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  Open Library
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6h8M6 2l4 4-4 4"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          <ChatWindow messages={session.messages} loading={isLoading} />

          {/* Example card — visible on fresh sessions before the first user reply */}
          {!session.messages.some((m) => m.role === "user") && !isLoading && (
            <div className="flex-shrink-0 px-4 pb-3">
              <div className="max-w-3xl mx-auto">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <div className="flex items-stretch">
                    {/* Colour bar */}
                    <div className="w-1 flex-shrink-0" style={{ background: "linear-gradient(180deg, #10B981 0%, #0891B2 100%)" }} />
                    <div className="flex-1 flex items-center justify-between gap-4 px-4 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="8" cy="8" r="6.5"/>
                            <path d="M6 8l1.5 1.5L10.5 6"/>
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1A1714]">
                            See a completed example first
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                            Load a full menopause specialist interview — 52 video titles, editing directions &amp; teleprompter scripts.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleLoadDemo}
                        className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 active:scale-95 whitespace-nowrap shadow-sm"
                        style={{ background: "linear-gradient(135deg, #10B981 0%, #0891B2 100%)" }}
                      >
                        Load Example
                        <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 7h10M8 3l4 4-4 4"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ── Bottom panel ──────────────────────────────────────────────── */}
        <div className="flex-shrink-0">

          {/* Generate scripts banner — appears after editing directions, before teleprompter scripts */}
          {showGenerateScripts && (
            <div className="border-t border-gray-200 bg-white px-4 py-3">
              <div className="max-w-3xl mx-auto flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#84CC1620" }}>
                  <svg className="w-4 h-4" style={{ color: "#65A30D" }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A1714]">
                    Step 1 complete — outlines &amp; editing directions ready
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Click to generate the full teleprompter scripts — the actual spoken words for each video.
                  </p>
                </div>
                <button
                  onClick={handleGenerateScripts}
                  disabled={isLoading}
                  className="flex-shrink-0 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 whitespace-nowrap"
                  style={{ backgroundColor: "#84CC16" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#65A30D"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#84CC16"; }}
                >
                  Generate Scripts →
                </button>
              </div>
            </div>
          )}

          <ExportPanel session={session} showExport={showExport} />
          <InputBar
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            disabled={isLoading}
            currentStageIdx={session.currentStageIdx}
          />
        </div>
          </>
        )}

      </div>
    </>
  );
}
