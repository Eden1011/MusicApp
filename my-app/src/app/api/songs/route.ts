import { NextRequest, NextResponse } from "next/server";
import { createSong, getDb } from "../../../../lib/db";

export async function GET(): Promise<NextResponse> {
  try {
    const db = await getDb()
    const songs = await db.all(`SELECT * FROM songs`)
    return NextResponse.json(songs, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const data = await request.json()
    if (!data.title || !data.artist || !data.music_url || !data.thumbnail_url) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    await createSong(data)
    return NextResponse.json({ message: 'Created song' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
