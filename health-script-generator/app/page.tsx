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
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#10B981] rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading…</p>
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
        <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-[#10B981]"
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

  async function handleLoadDemo() {
    if (
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
        <header className="bg-white shadow-sm flex-shrink-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-[#1A1714] leading-tight truncate">
                Health Content Interview
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                52 Long-Form Video Scripts
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleLoadDemo}
                className="text-xs text-[#3B82F6] hover:text-[#2563EB] font-medium transition-colors px-2.5 py-1.5 rounded-lg hover:bg-blue-50"
              >
                Load Demo
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Start a new session? Your current progress will be cleared."
                    )
                  ) {
                    handleStartFresh();
                  }
                }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-50"
              >
                New session
              </button>
            </div>
          </div>
          <StageProgress currentStageIdx={session.currentStageIdx} />
        </header>

        {/* ── Chat area — fills remaining height, scrolls internally ──── */}
        <main className="flex-1 min-h-0">
          <ChatWindow messages={session.messages} loading={isLoading} />
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

      </div>
    </>
  );
}
