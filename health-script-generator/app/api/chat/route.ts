import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { Message } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[]; stageIdx: number } = await req.json();

    const anthropicMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
