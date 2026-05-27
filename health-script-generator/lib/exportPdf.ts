import PDFDocument from "pdfkit";
import { SessionData, VideoTitle } from "@/types";

const FONT_REGULAR = "Helvetica";
const FONT_BOLD = "Helvetica-Bold";
const PAGE_WIDTH = 612; // LETTER
const PAGE_HEIGHT = 792;
const MARGIN = 72; // 1 inch
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2; // 468

// ── Root cause note ──────────────────────────────────────────────────────────
// The pageAdded event approach causes infinite recursion:
//   addPage() → pageAdded → doc.text(footer at y=752) → pdfkit checks
//   y > maxY() (752 > 720) → addPage() → pageAdded → …
// Fix: bufferPages:true + post-processing pass (switchToPage + temp zero
// the bottom margin so placing footer text at y=752 does not trigger another
// auto-page-break).

export function exportPdf(session: SessionData): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      autoFirstPage: false,
      bufferPages: true,   // keep all pages in memory for post-processing
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const dateStr = new Date(session.startedAt).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Track which section title belongs to which buffered page index
    const pageTitles: string[] = [];

    function addPage(title: string) {
      doc.addPage();
      pageTitles.push(title);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    function hr() {
      doc
        .moveTo(MARGIN, doc.y)
        .lineTo(MARGIN + CONTENT_WIDTH, doc.y)
        .strokeColor("#E5E7EB")
        .lineWidth(0.5)
        .stroke()
        .moveDown(0.5);
    }

    function shadedBlock(text: string) {
      if (!text.trim()) return;
      const PAD = 10;
      const startY = doc.y;
      const estH = doc.heightOfString(text, { width: CONTENT_WIDTH - PAD * 2 });
      const remaining = PAGE_HEIGHT - MARGIN - doc.y;
      const boxH = Math.min(estH + PAD * 2, remaining - 5);

      if (boxH > PAD) {
        doc
          .rect(MARGIN, startY, CONTENT_WIDTH, boxH)
          .fillColor("#F9FAFB")
          .fill();
      }

      doc
        .font(FONT_REGULAR)
        .fontSize(10)
        .fillColor("#374151")
        .text(text, MARGIN + PAD, startY + PAD, {
          width: CONTENT_WIDTH - PAD * 2,
          lineGap: 2,
        });
    }

    // ── Cover page ───────────────────────────────────────────────────────────
    addPage(""); // empty title = no header on cover

    doc
      .font(FONT_BOLD)
      .fontSize(30)
      .fillColor("#111827")
      .text("Health Practitioner Content Library", MARGIN, PAGE_HEIGHT / 3, {
        width: CONTENT_WIDTH,
        align: "center",
      });

    if (session.practitionerName) {
      doc
        .moveDown(1.5)
        .font(FONT_BOLD)
        .fontSize(18)
        .fillColor("#374151")
        .text(session.practitionerName, { width: CONTENT_WIDTH, align: "center" });
    }

    if (session.platform) {
      doc
        .moveDown(0.6)
        .font(FONT_REGULAR)
        .fontSize(13)
        .fillColor("#6B7280")
        .text(`Platform: ${session.platform}`, {
          width: CONTENT_WIDTH,
          align: "center",
        });
    }

    doc
      .moveDown(0.6)
      .font(FONT_REGULAR)
      .fontSize(11)
      .fillColor("#9CA3AF")
      .text(`Generated: ${dateStr}`, { width: CONTENT_WIDTH, align: "center" });

    // ── Table of contents (52 video titles) ──────────────────────────────────
    if (session.videoTitles && session.videoTitles.length > 0) {
      addPage("Table of Contents");

      doc
        .font(FONT_BOLD)
        .fontSize(22)
        .fillColor("#111827")
        .text("52 Video Titles")
        .moveDown(0.8);

      const byTheme = new Map<string, VideoTitle[]>();
      for (const vt of session.videoTitles) {
        const arr = byTheme.get(vt.theme) ?? [];
        arr.push(vt);
        byTheme.set(vt.theme, arr);
      }

      for (const [theme, titles] of Array.from(byTheme.entries())) {
        doc
          .font(FONT_BOLD)
          .fontSize(13)
          .fillColor("#2563EB")
          .text(theme)
          .moveDown(0.3);

        for (const vt of titles) {
          doc
            .font(FONT_BOLD)
            .fontSize(11)
            .fillColor("#111827")
            .text(`${vt.number}.  ${vt.title}`);

          doc
            .font(FONT_REGULAR)
            .fontSize(10)
            .fillColor("#6B7280")
            .text(`     ${vt.description}`)
            .moveDown(0.2);
        }
        doc.moveDown(0.5);
      }
    }

    // ── Individual script sections ────────────────────────────────────────────
    if (session.scripts && session.scripts.length > 0) {
      for (const script of session.scripts) {
        const scriptLabel = `Video ${script.number}: ${script.title}`;
        addPage(scriptLabel);

        doc
          .font(FONT_BOLD)
          .fontSize(20)
          .fillColor("#111827")
          .text(scriptLabel)
          .moveDown(0.5);

        hr();

        doc
          .font(FONT_BOLD)
          .fontSize(13)
          .fillColor("#111827")
          .text("Teleprompter Script")
          .moveDown(0.4);

        doc
          .font(FONT_REGULAR)
          .fontSize(11)
          .fillColor("#1F2937")
          .text(script.teleprompterScript, { lineGap: 3 })
          .moveDown(1.2);

        doc
          .font(FONT_BOLD)
          .fontSize(13)
          .fillColor("#111827")
          .text("Editing Directions")
          .moveDown(0.4);

        shadedBlock(script.editingDirections);
        doc.moveDown(1.2);

        doc
          .font(FONT_BOLD)
          .fontSize(13)
          .fillColor("#111827")
          .text("Retention Notes")
          .moveDown(0.4);

        doc
          .font(FONT_REGULAR)
          .fontSize(11)
          .fillColor("#1F2937")
          .text(script.retentionNotes, { lineGap: 2 })
          .moveDown(1.2);

        doc
          .font(FONT_BOLD)
          .fontSize(13)
          .fillColor("#111827")
          .text("Publishing Notes")
          .moveDown(0.4);

        doc
          .font(FONT_REGULAR)
          .fontSize(11)
          .fillColor("#1F2937")
          .text(script.publishingNotes, { lineGap: 2 });
      }
    }

    // ── Post-processing: add headers and footers to every buffered page ───────
    // pdfkit auto-page-break fires when y > page.maxY() = height - margins.bottom.
    // Temporarily zero the bottom margin so placing text at y=PAGE_HEIGHT-40
    // (= 752, below the normal maxY of 720) does NOT trigger another addPage().
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);

      // Silence auto-page-break for margin-area rendering
      const origBottom = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;

      const title = pageTitles[i] ?? "";

      // Header (skip on cover page)
      if (title) {
        doc
          .font(FONT_REGULAR)
          .fontSize(8)
          .fillColor("#AAAAAA")
          .text(title, MARGIN, 24, {
            width: CONTENT_WIDTH,
            lineBreak: false,
            ellipsis: true,
          });

        doc
          .moveTo(MARGIN, 36)
          .lineTo(MARGIN + CONTENT_WIDTH, 36)
          .strokeColor("#E5E7EB")
          .lineWidth(0.5)
          .stroke();
      }

      // Page number centred in the bottom margin area
      doc
        .font(FONT_REGULAR)
        .fontSize(8)
        .fillColor("#AAAAAA")
        .text(String(i + 1), MARGIN, PAGE_HEIGHT - 40, {
          width: CONTENT_WIDTH,
          align: "center",
          lineBreak: false,
        });

      // Footer separator line
      doc
        .moveTo(MARGIN, PAGE_HEIGHT - origBottom + 8)
        .lineTo(MARGIN + CONTENT_WIDTH, PAGE_HEIGHT - origBottom + 8)
        .strokeColor("#E5E7EB")
        .lineWidth(0.5)
        .stroke();

      // Restore bottom margin
      doc.page.margins.bottom = origBottom;
    }

    doc.flushPages();
    doc.end();
  });
}
