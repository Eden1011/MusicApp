import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";

export async function GET(): Promise<NextResponse> {
  try {
    const db = await getDb();
    const chats = await db.all(
      `SELECT c.*, 
        a1.name as user1_name, 
        a2.name as user2_name
      FROM chats c
      LEFT JOIN accounts a1 ON c.user_id1 = a1.id
      LEFT JOIN accounts a2 ON c.user_id2 = a2.id`
    );

    return NextResponse.json(chats, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
