import { exportPdf } from "@/lib/exportPdf";
import { SessionData } from "@/types";

export async function POST(req: Request) {
  try {
    const { session }: { session: SessionData } = await req.json();
    const buffer = await exportPdf(session);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="health-content-library.pdf"',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
