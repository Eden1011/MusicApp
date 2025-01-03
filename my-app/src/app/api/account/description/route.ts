import { NextRequest, NextResponse } from "next/server";
import { Account, getDb } from "../../../../../lib/db";

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const description = url.searchParams.get('description');

    if (!id || !description) return NextResponse.json({ error: "Provide missing fields" }, { status: 400 });

    const db = await getDb();
    const account = await db.get<Account>(`SELECT * FROM accounts WHERE id = ?`, id);
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    await db.run('UPDATE accounts SET description = ? WHERE id = ?', [description, id]);

    const updatedAccount = await db.get<Account>('SELECT * FROM accounts WHERE id = ?', id);
    return NextResponse.json(updatedAccount, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
