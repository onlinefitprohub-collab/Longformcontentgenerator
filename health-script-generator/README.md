# Health Script Generator

An AI-powered interview tool that conducts a structured, multi-stage conversation with a health practitioner and uses their expertise to generate a library of **52 long-form educational video scripts** — complete with teleprompter scripts, editing directions, retention notes, and publishing guides.

---

## What it does

The app works in **8 interview stages** (Stage 0–7):

| Stage | Topic |
|-------|-------|
| 0 | Context & Platform Brief |
| 1 | Practitioner Background |
| 2 | Transformation Stories |
| 3 | Knowledge Pillars |
| 4 | Audience & Questions |
| 5 | Contrarian Views |
| 6 | Protocols & Frameworks |
| 7 | Script Topic Mapping & Full Script Generation |

Claude conducts the interview, asking follow-up questions at each stage before advancing. After Stage 6, it produces 52 video title concepts grouped by theme, waits for approval, then generates full scripts with teleprompter text and editor-ready directions.

Sessions are saved to `localStorage` automatically and can be resumed across page reloads.

---

## Requirements

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

---

## Installation

```bash
cd health-script-generator
npm install
```

---

## API key setup

Copy the example env file and add your key:

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and replace the placeholder:

```
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
```

Your key is never exposed to the browser — all Claude calls happen server-side in the API route.

---

## Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How to use

1. **Answer Stage 0** — tell the AI which platform you're targeting, your video length range, audience stage, and primary goal.
2. **Work through Stages 1–6** — the AI will ask follow-up questions. Answer in as much detail as you can; richer answers produce better scripts.
3. **Stage 7** — the AI produces 52 video title concepts. Review and approve them in chat.
4. **Script generation** — the AI writes full scripts one at a time (teleprompter layer + editing directions layer).
5. **Export** — once scripts start appearing, an Export panel appears at the bottom. You can download:
   - **JSON** — full session state (can be re-imported later)
   - **Word Doc (.docx)** — formatted document with cover page, Q&A transcript, video titles, and scripts
   - **PDF** — same content as a print-ready PDF

---

## Project structure

```
app/
  page.tsx                  # Main interview page
  layout.tsx                # Root layout
  api/
    chat/route.ts           # Streaming Claude API proxy
    export/
      docx/route.ts         # Word document export endpoint
      pdf/route.ts          # PDF export endpoint

components/
  StageProgress.tsx         # Stage pill bar + progress bar
  ChatWindow.tsx            # Scrollable message list + typing indicator
  MessageBubble.tsx         # Individual message (markdown renderer)
  InputBar.tsx              # Auto-expanding textarea + send button
  ExportPanel.tsx           # Export buttons (JSON / DOCX / PDF)

lib/
  prompt.ts                 # System prompt + welcome message
  stages.ts                 # Stage definitions (id, label, title, accent colour)
  parseStage.ts             # Stage completion detection helpers
  exportDocx.ts             # Word document generation (docx library)
  exportPdf.ts              # PDF generation (pdfkit)

types/
  index.ts                  # Shared TypeScript types
```

---

## Tech stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Anthropic Claude** (`claude-sonnet-4-20250514`, streaming)
- **docx** — Word document generation
- **pdfkit** — PDF generation
