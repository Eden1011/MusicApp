import { NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";

export async function GET(): Promise<NextResponse> {
  try {
    const db = await getDb()
    const genres = await db.all<{ genre: string }[]>(`
     SELECT DISTINCT genre 
     FROM song_genres 
     ORDER BY genre ASC
   `);
    return NextResponse.json({
      genres: genres.map(g => g.genre)
    }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
