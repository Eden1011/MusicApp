import { NextResponse } from "next/server";
import { getDb, getSongGenres, Song } from "../../../../../lib/db";

export async function GET(): Promise<NextResponse> {
  try {
    const db = await getDb()
    const songs = await db.all<Song[]>(`SELECT * FROM songs`)

    for (const song of songs) {
      song.genre = await getSongGenres(song.id)
    }

    return NextResponse.json({ songs }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}


