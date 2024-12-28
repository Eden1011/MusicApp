import { NextRequest, NextResponse } from "next/server";
import { getDb, getSongGenres } from "../../../../lib/db";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const genre = url.searchParams.get('genre')
    if (!genre) return NextResponse.json({ error: "Provide genre" }, { status: 400 })

    const db = await getDb()
    const songs = await db.all(`
     SELECT * FROM songs
     JOIN song_genres ON songs.id = song_genres.song_id
     WHERE song_genres.genre = ?`, genre)

    for (const song of songs) {
      song.genre = await getSongGenres(song.id)
    }
    return NextResponse.json({ songs }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
