import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { chat_id, user_id } = await request.json();

    if (!chat_id || !user_id) {
      return NextResponse.json({ error: "Provide chat_id and user_id" }, { status: 400 });
    }

    const db = await getDb();

    await db.run(
      `UPDATE chats 
       SET user_id1 = CASE WHEN user_id1 = ? THEN NULL ELSE user_id1 END,
           user_id2 = CASE WHEN user_id2 = ? THEN NULL ELSE user_id2 END
       WHERE id = ?`,
      [user_id, user_id, chat_id]
    );

    const updatedChat = await db.get('SELECT * FROM chats WHERE id = ?', chat_id);
    return NextResponse.json(updatedChat, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
