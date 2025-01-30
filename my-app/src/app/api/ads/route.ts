import { NextResponse } from 'next/server';

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      let isActive = true;

      const interval = setInterval(() => {
        if (isActive) {
          try {
            controller.enqueue('data: switch\n\n');
          } catch (error) {
            isActive = false;
            clearInterval(interval);
          }
        }
      }, 8000);

      return () => {
        isActive = false;
        clearInterval(interval);
      };
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
