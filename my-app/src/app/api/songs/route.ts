import { NextRequest, NextResponse } from "next/server";
import { createSong, getSongGenres, addGenresToSong, getDb, Song } from "../../../../lib/db";
import { connect } from 'mqtt';

const publishToMqtt = async (song: Song) => {
  const client = connect('wss://broker.hivemq.com:8884/mqtt');
  client.on('connect', () => {
    client.publish('music-app/new-songs', JSON.stringify(song));
    client.end();
  });
};

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
    const db = await getDb()
    const existingSong = await db.get<Song>('SELECT * FROM songs WHERE music_url = ?', data.music_url)
    if (existingSong) {
      return NextResponse.json({ message: 'Song already exists', song: existingSong }, { status: 200 })
    }
    await createSong(data)
    const newSong = await db.get<Song>('SELECT * FROM songs WHERE music_url = ?', data.music_url)
    if (newSong) {
      await publishToMqtt(newSong);
    }
    return NextResponse.json({ message: 'Created song', song: newSong }, { status: 201 })
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
    const song = await db.get<Song>(`SELECT * FROM songs WHERE id = ?`, id)
    if (!song) return NextResponse.json({ error: 'Song not found' }, { status: 404 })
    await addGenresToSong(id, genres)

    // Get updated song with genres and publish
    const updatedSong = await db.get<Song>(`SELECT * FROM songs WHERE id = ?`, id)
    if (updatedSong) {
      updatedSong.genre = await getSongGenres(id);
      await publishToMqtt(updatedSong);
    }

    return NextResponse.json({
      message: 'Genres updated',
      genres
    }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
