import { exportDocx } from "@/lib/exportDocx";
import { SessionData } from "@/types";

export async function POST(req: Request) {
  try {
    const { session }: { session: SessionData } = await req.json();
    const buffer = await exportDocx(session);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="health-content-library.docx"',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
