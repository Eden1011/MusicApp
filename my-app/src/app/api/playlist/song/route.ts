import { NextRequest, NextResponse } from "next/server";
import { getDb, removeSongFromPlaylist } from "../../../../../lib/db";

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const playlist_id = url.searchParams.get('playlist_id');
    const music_url = url.searchParams.get('music_url');

    if (!playlist_id || !music_url) {
      return NextResponse.json({ error: 'Provide playlist_id and music_url' }, { status: 400 });
    }

    const result = await removeSongFromPlaylist(parseInt(playlist_id), music_url);
    return NextResponse.json({ message: 'Songs removed', count: result.removed_count }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'No songs found with this music URL') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
