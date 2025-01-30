import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";

export async function GET(): Promise<NextResponse> {
  try {
    const db = await getDb();
    const availableChats = await db.all<{ id: number }[]>(
      `SELECT id FROM chats 
       WHERE user_id1 IS NULL 
       OR user_id2 IS NULL`
    );

    return NextResponse.json(availableChats, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
