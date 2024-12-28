import { NextRequest, NextResponse } from "next/server";
import { createSong, getSongGenres, addGenresToSong, getDb, Song } from "../../../../lib/db";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: "Provide song ID" }, { status: 400 });

    const db = await getDb()
    const song = await db.get<Song>(`SELECT * FROM songs WHERE id = ?`, id)
    if (!song) return NextResponse.json({ error: 'Song not found' }, { status: 404 })

    song.genre = await getSongGenres(parseInt(id))
    return NextResponse.json({ song }, { status: 200 })
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

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const data = await request.json()
    const { id, genres } = data
    if (!id || !Array.isArray(genres)) return NextResponse.json({ error: 'Provide song ID and genres as array' }, { status: 400 })

    const db = await getDb()
    const song = await db.get(`SELECT id FROM songs WHERE id = ?`, id)
    if (!song) return NextResponse.json({ error: 'Song not found' }, { status: 404 })

    await addGenresToSong(id, genres)
    return NextResponse.json({
      message: 'Genres updated',
      genres
    }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
