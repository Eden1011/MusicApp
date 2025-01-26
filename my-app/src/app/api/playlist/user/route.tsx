import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const playlist_id = url.searchParams.get('playlist_id');

    if (!playlist_id) {
      return NextResponse.json({ error: 'Provide playlist_id' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.get<{ account_id: number }>(
      'SELECT account_id FROM playlists WHERE id = ?',
      playlist_id
    );

    if (!result) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }

    return NextResponse.json({ account_id: result.account_id }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
