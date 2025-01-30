import { NextRequest, NextResponse } from "next/server";
import { addGenreToChat } from "../../../../../lib/db";

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const { chat_id, genre } = await request.json();

    if (!chat_id || !genre) {
      return NextResponse.json({ error: "Provide chat_id and genre" }, { status: 400 });
    }

    const updatedChat = await addGenreToChat(chat_id, genre);
    return NextResponse.json(updatedChat, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
