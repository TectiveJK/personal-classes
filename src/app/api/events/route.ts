import { subscribe } from "@/lib/realtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();
  let unsubscribe = () => {};
  let ping: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = () => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "bookings" })}\n\n`)
          );
        } catch {
          unsubscribe();
        }
      };
      send();
      unsubscribe = subscribe(send);
      ping = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          if (ping) clearInterval(ping);
        }
      }, 15000);
    },
    cancel() {
      if (ping) clearInterval(ping);
      unsubscribe();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
