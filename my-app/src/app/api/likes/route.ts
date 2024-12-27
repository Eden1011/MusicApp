import { NextRequest, NextResponse } from "next/server";
import { deleteLikedSong, likeSong } from "../../../../lib/db";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { account_id, song_id } = await request.json()
    if (!account_id || !song_id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    await likeSong(parseInt(account_id), parseInt(song_id))
    return NextResponse.json({ message: 'Song liked' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const account_id = url.searchParams.get('account_id')
    const song_id = url.searchParams.get('song_id')
    if (!account_id || !song_id) return NextResponse.json({ error: 'Provide ID and account ID' }, { status: 400 })

    await deleteLikedSong(parseInt(account_id), parseInt(song_id))
    return NextResponse.json({ message: 'Like removed' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

