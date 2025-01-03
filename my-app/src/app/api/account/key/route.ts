import { NextRequest, NextResponse } from "next/server";
import { Account, getDb } from "../../../../../lib/db";
import { encrypt } from "../../../../../lib/crypto";

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const key = url.searchParams.get('key');

    if (!id) return NextResponse.json({ error: "Provide ID" }, { status: 400 });
    if (!key) return NextResponse.json({ error: "Provide a new key" }, { status: 400 });

    const db = await getDb();
    const account = await db.get<Account>(`SELECT * FROM accounts WHERE id = ?`, id);
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    await db.run('UPDATE accounts SET api_key = ? WHERE id = ?', [encrypt(key), id]);

    const updatedAccount = await db.get<Account>('SELECT * FROM accounts WHERE id = ?', id);
    return NextResponse.json({ updatedAccount }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
