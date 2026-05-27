// ── Types ─────────────────────────────────────────────────────────────────────

export interface ParsedSubsection {
  label: string;
  content: string;
}

export interface ParsedVideo {
  number: number;
  title: string;
  subsections: ParsedSubsection[];
  hasScript: boolean;
}

export interface ScriptSegment {
  type: "spoken" | "cue";
  content: string;
  timing?: string;
}

// ── parseSubsections ──────────────────────────────────────────────────────────

export function parseSubsections(body: string): ParsedSubsection[] {
  const lines = body.split("\n");
  const starts: Array<{ label: string; idx: number }> = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 100) return;

    // Match ALL-CAPS label followed by colon, e.g. "EDITING DIRECTIONS:"
    const allCapsMatch = trimmed.match(/^([A-Z][A-Z\s/\-]+[A-Z])\s*:/);
    // Match "Layer N — Description" patterns for teleprompter/editing notes
    const layerMatch = trimmed.match(/^(Layer\s+\d+\s*[—–-].{3,50})/i);

    if (allCapsMatch) {
      starts.push({ label: allCapsMatch[1].trim(), idx });
    } else if (layerMatch) {
      starts.push({ label: layerMatch[1].trim(), idx });
    }
  });

  if (starts.length === 0) {
    return body.trim() ? [{ label: "Content", content: body }] : [];
  }

  return starts.map(({ label, idx }, i) => {
    const nextIdx = i + 1 < starts.length ? starts[i + 1].idx : lines.length;
    const content = lines.slice(idx + 1, nextIdx).join("\n").trim();
    return { label, content };
  });
}

// ── parseScriptSegments ───────────────────────────────────────────────────────

const EDIT_CUE_RE = /^\[EDIT:\s*([0-9:]+)\]\s*(.+)/;

export function parseScriptSegments(scriptText: string): ScriptSegment[] {
  const lines = scriptText.split("\n");
  const segments: ScriptSegment[] = [];
  let spokenBuffer: string[] = [];

  function flushSpoken() {
    const text = spokenBuffer.join("\n").trim();
    if (text) {
      segments.push({ type: "spoken", content: text });
    }
    spokenBuffer = [];
  }

  for (const line of lines) {
    const match = line.trim().match(EDIT_CUE_RE);
    if (match) {
      flushSpoken();
      segments.push({ type: "cue", timing: match[1], content: match[2].trim() });
    } else {
      spokenBuffer.push(line);
    }
  }

  flushSpoken();
  return segments;
}

// ── parseVideosFromText ───────────────────────────────────────────────────────

export function parseVideosFromText(text: string): ParsedVideo[] | null {
  const lines = text.split("\n");
  const videoStarts: number[] = [];

  lines.forEach((line, idx) => {
    if (/^VIDEO\s+\d+[:\s]/i.test(line.trim())) {
      videoStarts.push(idx);
    }
  });

  if (videoStarts.length === 0) return null;

  const videos: ParsedVideo[] = videoStarts.map((startIdx, i) => {
    const endIdx = i + 1 < videoStarts.length ? videoStarts[i + 1] : lines.length;
    const headerLine = lines[startIdx].trim();

    const numMatch = headerLine.match(/VIDEO\s+(\d+)/i);
    const number = parseInt(numMatch?.[1] ?? String(i + 1), 10);

    const bodyLines = lines.slice(startIdx + 1, endIdx);
    const body = bodyLines.join("\n").trim();

    // Title may be inline on the VIDEO N: line or on a TITLE: line below
    let title = headerLine
      .replace(/^VIDEO\s+\d+\s*:?\s*/i, "")
      .trim()
      .replace(/^\*+|\*+$/g, "")
      .trim();
    if (!title) {
      const titleMatch = body.match(/^TITLE:\s*(.+)/im);
      title = titleMatch?.[1]?.trim().replace(/^\*+|\*+$/g, "").trim() ?? `Video ${number}`;
    }

    const subsections = parseSubsections(body);

    // Determine if this video has a full teleprompter script
    const hasScript =
      body.includes("TELEPROMPTER SCRIPT") ||
      body.includes("Teleprompter Script") ||
      /Layer\s+1\s*[—–-]/i.test(body);

    return { number, title, subsections, hasScript };
  });

  return videos;
}
