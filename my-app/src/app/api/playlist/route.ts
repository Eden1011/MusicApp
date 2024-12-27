import { NextRequest, NextResponse } from "next/server";
import { addSongToPlaylist, createPlaylist, deletePlaylist, getDb, getPlaylistSongs } from "../../../../lib/db";


export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Provide ID' }, { status: 400 })

    const db = await getDb()
    const playlist = await db.get('SELECT * FROM playlists WHERE id = ?', id);
    if (!playlist) return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })

    const songs = await getPlaylistSongs(parseInt(id))
    return NextResponse.json({ playlist, songs }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const data = await request.json();
    if (!data.name || !data.account_id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    await createPlaylist(data)
    return NextResponse.json({ message: 'Playlist created' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const { id, song_id } = await request.json()
    if (!id || !song_id) return NextResponse.json({ error: 'Provide playlist ID and song ID' }, { status: 400 })
    await addSongToPlaylist(id, song_id)
    return NextResponse.json({ message: 'Song added to playlist' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const account_id = url.searchParams.get('account_id')
    if (!id || !account_id) return NextResponse.json({ error: 'Provide ID and account ID' }, { status: 400 })

    await deletePlaylist(parseInt(account_id), parseInt(id))
    return NextResponse.json({ message: 'Playlist deleted' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
