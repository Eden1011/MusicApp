import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";
import { decrypt } from "../../../../../lib/crypto";

const BASE_URL = "https://www.googleapis.com/youtube/v3/search"

async function verifyAPIKey(account_id: number, encrypted_providedAPIKey: string): Promise<boolean> {
  const db = await getDb()
  const account = await db.get(
    `SELECT api_key FROM accounts WHERE id = ?`, account_id
  )
  return account?.api_key === encrypted_providedAPIKey
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const account_id = url.searchParams.get('account_id')
    const api_key = url.searchParams.get('api_key')
    const query = url.searchParams.get('query') // Suppose this is already URL encoded

    const max_results = url.searchParams.get('max_results') || '5'

    if (!account_id || !api_key || !query) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const isValid = await verifyAPIKey(parseInt(account_id), api_key)
    if (!isValid) return NextResponse.json({ error: 'Provided API key is invalid' }, { status: 403 })

    const decrypted_key = decrypt(api_key)
    const youtube = `${BASE_URL}?part=snippet&maxResults=${max_results}&q=${query}&key=${decrypted_key}`
    const response = await fetch(youtube)
    const data = await response.json()

    return NextResponse.json({ data }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Encountered error while fetching YouTube' }, { status: 500 })
  }
}
