import {
  AlignmentType,
  Document,
  Footer,
  HeadingLevel,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { SessionData, VideoTitle } from "@/types";
import { STAGES } from "@/lib/stages";

type DocChild = Paragraph | Table;

function textToParagraphs(text: string, size = 22): Paragraph[] {
  return text.split("\n").map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line.length > 0 ? line : " ", size })],
        spacing: { after: 100 },
      })
  );
}

function shadedBox(content: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.SOLID, fill: "F3F4F6", color: "auto" },
            margins: { top: 150, bottom: 150, left: 200, right: 200 },
            children: textToParagraphs(content, 20),
          }),
        ],
      }),
    ],
  });
}

export async function exportDocx(session: SessionData): Promise<Buffer> {
  const date = new Date(session.startedAt).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun("Page "),
          new TextRun({ children: [PageNumber.CURRENT] }),
          new TextRun(" of "),
          new TextRun({ children: [PageNumber.TOTAL_PAGES] }),
        ],
      }),
    ],
  });

  const children: DocChild[] = [];

  // --- Cover page ---
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.TITLE,
      children: [
        new TextRun({
          text: "Health Practitioner Content Library",
          bold: true,
          size: 56,
        }),
      ],
      spacing: { before: 2880, after: 400 },
    })
  );

  if (session.practitionerName) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: session.practitionerName, size: 36, bold: true }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  if (session.platform) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: `Platform: ${session.platform}`, size: 28 }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: `Generated: ${date}`, size: 24, color: "666666" }),
      ],
      spacing: { after: 400 },
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // --- Stage Q&A sections ---
  for (const stage of STAGES) {
    const stageMessages = session.messages.filter(
      (m) => m.stageId === stage.id && !m.isError
    );
    if (stageMessages.length === 0) continue;

    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({ text: `${stage.label} — ${stage.title}`, bold: true }),
        ],
        spacing: { after: 200 },
      })
    );

    for (const msg of stageMessages) {
      const label = msg.role === "assistant" ? "Interviewer" : "Practitioner";
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${label}:`, bold: true, size: 22 })],
          spacing: { before: 240, after: 80 },
        }),
        ...textToParagraphs(msg.content)
      );
    }

    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // --- 52 Video Titles ---
  if (session.videoTitles && session.videoTitles.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "52 Video Titles", bold: true })],
        spacing: { after: 300 },
      })
    );

    const byTheme = new Map<string, VideoTitle[]>();
    for (const vt of session.videoTitles) {
      const group = byTheme.get(vt.theme) ?? [];
      group.push(vt);
      byTheme.set(vt.theme, group);
    }

    for (const [theme, titles] of Array.from(byTheme.entries())) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: theme })],
          spacing: { before: 300, after: 150 },
        })
      );
      for (const vt of titles) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${vt.number}. `, bold: true, size: 22 }),
              new TextRun({ text: vt.title, bold: true, size: 22 }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: vt.description, size: 20, color: "555555" }),
            ],
            spacing: { after: 120 },
          })
        );
      }
    }

    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // --- Individual script sections ---
  if (session.scripts && session.scripts.length > 0) {
    for (const script of session.scripts) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [
            new TextRun({ text: `Video ${script.number}: ${script.title}` }),
          ],
          spacing: { after: 300 },
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Teleprompter Script" })],
          spacing: { after: 200 },
        }),
        ...textToParagraphs(script.teleprompterScript),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Editing Directions" })],
          spacing: { before: 400, after: 200 },
        }),
        shadedBox(script.editingDirections),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Retention Notes" })],
          spacing: { before: 400, after: 200 },
        }),
        ...textToParagraphs(script.retentionNotes),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Publishing Notes" })],
          spacing: { before: 400, after: 200 },
        }),
        ...textToParagraphs(script.publishingNotes),

        new Paragraph({ children: [new PageBreak()] })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        footers: { default: footer },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc) as Promise<Buffer>;
}
