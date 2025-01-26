import { NextRequest, NextResponse } from "next/server";
import { deleteLikedSong, likeSong } from "../../../../lib/db";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { account_id, music_url } = await request.json()
    const result = await likeSong(parseInt(account_id), music_url)
    return NextResponse.json({
      message: `Liked ${result.liked_count} song(s)`,
      ...result
    }, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.message === 'No songs found with this music URL') {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const account_id = url.searchParams.get('account_id')
    const music_url = url.searchParams.get('music_url')
    if (!account_id || !music_url) return NextResponse.json({ error: 'Provide account ID and music URL' }, { status: 400 })

    const result = await deleteLikedSong(parseInt(account_id), music_url)
    return NextResponse.json({
      message: `Removed ${result.deleted_count} like(s)`,
      ...result
    }, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.message === 'No songs found with this music URL') {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
