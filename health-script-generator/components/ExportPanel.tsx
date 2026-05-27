"use client";

import { useState } from "react";
import { SessionData } from "@/types";

interface ExportPanelProps {
  session: SessionData;
  showExport: boolean;
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 2v9M4 8l4 4 4-4M2 13h12" />
    </svg>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ExportPanel({ session, showExport }: ExportPanelProps) {
  const [loadingJson, setLoadingJson] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  if (!showExport) return null;

  function downloadJson() {
    setLoadingJson(true);
    try {
      const blob = new Blob([JSON.stringify(session, null, 2)], {
        type: "application/json",
      });
      triggerDownload(blob, "health-content-session.json");
    } finally {
      setLoadingJson(false);
    }
  }

  async function downloadDocx() {
    setLoadingDocx(true);
    try {
      const res = await fetch("/api/export/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session }),
      });
      if (!res.ok) throw new Error(`Export failed: ${res.status}`);
      triggerDownload(await res.blob(), "health-content-library.docx");
    } catch (err) {
      console.error("DOCX export failed:", err);
    } finally {
      setLoadingDocx(false);
    }
  }

  async function downloadPdf() {
    setLoadingPdf(true);
    try {
      const res = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session }),
      });
      if (!res.ok) throw new Error(`Export failed: ${res.status}`);
      triggerDownload(await res.blob(), "health-content-library.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setLoadingPdf(false);
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Export your session
        </p>
        <div className="flex flex-wrap gap-2">
          {/* JSON */}
          <button
            onClick={downloadJson}
            disabled={loadingJson}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F3EF] border border-gray-200 text-sm font-medium text-[#1A1714] hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loadingJson ? <Spinner /> : <DownloadIcon />}
            Export JSON
          </button>

          {/* Word Doc */}
          <button
            onClick={downloadDocx}
            disabled={loadingDocx}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loadingDocx ? <Spinner /> : <DownloadIcon />}
            Download Word Doc
          </button>

          {/* PDF */}
          <button
            onClick={downloadPdf}
            disabled={loadingPdf}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 text-sm font-medium text-orange-700 hover:bg-orange-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loadingPdf ? <Spinner /> : <DownloadIcon />}
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
