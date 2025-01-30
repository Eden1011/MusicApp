import { NextRequest, NextResponse } from "next/server";
import { getDb, createChat, addUserToChat, deleteChat, Chat } from "../../../../lib/db";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Provide chat ID" }, { status: 400 });
    }

    const db = await getDb();
    const chat = await db.get<Chat>('SELECT * FROM chats WHERE id = ?', id);

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(): Promise<NextResponse> {
  try {
    const newChat = await createChat();
    return NextResponse.json(newChat, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const { chat_id, user_id } = await request.json();

    if (!chat_id || !user_id) {
      return NextResponse.json({ error: "Provide chat_id and user_id" }, { status: 400 });
    }

    const updatedChat = await addUserToChat(chat_id, user_id);
    return NextResponse.json(updatedChat, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Provide chat ID" }, { status: 400 });
    }

    await deleteChat(parseInt(id));
    return NextResponse.json({ message: "Chat deleted" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
