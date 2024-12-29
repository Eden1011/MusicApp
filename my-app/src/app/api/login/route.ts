import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { decrypt } from "../../../../lib/crypto";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const db = await getDb();
    const account = await db.get('SELECT * FROM accounts WHERE email = ?', email);

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    if (password === decrypt(account.password)) {
      return NextResponse.json({ success: true, account_id: account.id }, { status: 200 });
    }
    else return NextResponse.json({ error: 'Wrong password' }, { status: 403 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
