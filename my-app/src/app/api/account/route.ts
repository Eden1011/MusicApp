import { NextRequest, NextResponse } from "next/server";
import { getDb, createAccount, getLikedSongs, getAccountPlaylists, Account } from "../../../../lib/db";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: "Provide ID" }, { status: 400 });

    const db = await getDb();
    const account = await db.get<Account>(`SELECT * FROM accounts WHERE id = ?`, id)
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 })

    const likedSongs = await getLikedSongs(parseInt(id))
    const playlists = await getAccountPlaylists(parseInt(id))

    return NextResponse.json({
      account,
      likedSongs,
      playlists
    }, { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const data = await request.json()
    if (!data.name || !data.api_key || !data.password || !data.email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    const newAccount = await createAccount(data)
    return NextResponse.json({ newAccount }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
