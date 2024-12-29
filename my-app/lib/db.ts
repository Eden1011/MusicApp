import sqlite3 from "sqlite3";
import { open, Database } from 'sqlite'
import { encrypt, decrypt } from "./crypto";

let db: Database | null = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
    await db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    description TEXT,
    api_key TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    music_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS song_genres (
    song_id INTEGER NOT NULL,
    genre TEXT NOT NULL,
    PRIMARY KEY (song_id, genre),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    account_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS playlist_songs (
    playlist_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, song_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS liked_songs (
    account_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    liked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (account_id, song_id),
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS liked_playlists (
    account_id INTEGER NOT NULL,
    playlist_id INTEGER NOT NULL,
    liked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (account_id, playlist_id),
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE
    );`);
  }
  return db
}

export interface Account {
  id: number,
  name: string,
  email: string,
  password: string,
  description?: string,
  api_key: string,
  created_at: string
}

export interface Song {
  id: number,
  title: string,
  artist: string,
  music_url: string,
  thumbnail_url: string,
  genre?: string[]
}

export interface Playlist {
  id: number,
  name: string,
  account_id: number,
  created_at: string
}

export async function createAccount(data: Omit<Account, 'id' | 'created_at'>): Promise<Account | undefined> {
  const db = await getDb()
  const encrypted_key = encrypt(data.api_key)
  const encrypted_psswd = encrypt(data.password)
  const result = await db.run(
    `INSERT INTO accounts (name, email, password, description, api_key) VALUES (?, ?, ?, ?, ?)`,
    [data.name, data.email, encrypted_psswd, data.description, encrypted_key]
  );
  const account = await db.get<Account>('SELECT * FROM accounts WHERE id = ?', result.lastID)
  if (account) {
    account.api_key = decrypt(account.api_key)
    account.password = decrypt(account.password)
  } return account
}

export async function deleteAccount(account_id: number) {
  const db = await getDb()
  return db.run(`DELETE FROM accounts WHERE id = ?`, account_id)
}

export async function createSong(data: Omit<Song, 'id'>) {
  const db = await getDb()
  return db.run(
    `INSERT INTO songs (title, artist, music_url, thumbnail_url) VALUES (?, ?, ?, ?)`,
    [data.title, data.artist, data.music_url, data.thumbnail_url]
  );
}

export async function addGenresToSong(song_id: number, genres: string[]) {
  const db = await getDb()
  await db.run(`DELETE FROM song_genres WHERE song_id = ?`, song_id)
  for (const genre of genres) {
    await db.run(`INSERT INTO song_genres (song_id, genre) VALUES (?, ?)`, [song_id, genre])
  }
}

export async function getSongGenres(song_id: number): Promise<string[]> {
  const db = await getDb()
  return await db.all<string[]>(
    `SELECT genre FROM song_genres WHERE song_id = ?`, song_id
  )
}

export async function likeSong(account_id: number, song_id: number) {
  const db = await getDb();
  return db.run(
    `INSERT INTO liked_songs (account_id, song_id) VALUES (?, ?)`, [account_id, song_id]
  )
}

export async function getLikedSongs(account_id: number): Promise<Song[]> {
  const db = await getDb();
  return db.all<Song[]>(
    `SELECT * FROM songs
    JOIN liked_songs ON liked_songs.song_id = songs.id
    WHERE liked_songs.account_id = ?
    `, account_id)
}

export async function deleteLikedSong(account_id: number, song_id: number) {
  const db = await getDb()
  return db.run('DELETE FROM liked_songs WHERE account_id = ? AND song_id = ?', [account_id, song_id])
}

export async function createPlaylist(data: Omit<Playlist, 'id' | 'created_at'>) {
  const db = await getDb()
  return db.run(`INSERT INTO playlists (name, account_id) VALUES (?, ?)`, [data.name, data.account_id])
}

export async function addSongToPlaylist(playlist_id: number, song_id: number) {
  const db = await getDb();
  return db.run(
    `INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)`, [playlist_id, song_id]
  )
}

export async function removeSongFromPlaylist(playlist_id: number, song_id: number) {
  const db = await getDb();
  return db.run(
    `DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?`, [playlist_id, song_id]
  )
}

export async function getAccountPlaylists(account_id: number): Promise<Playlist[]> {
  const db = await getDb();
  return db.all<Playlist[]>(
    `SELECT * FROM playlists WHERE account_id = ?`, account_id
  )
}

export async function getPlaylistSongs(playlist_id: number): Promise<Song[]> {
  const db = await getDb();
  return db.all<Song[]>(
    `SELECT * FROM songs
    JOIN playlist_songs ON playlist_songs.song_id = songs.id
    WHERE playlist_songs.playlist_id = ?`, playlist_id
  )
}

export async function deletePlaylist(account_id: number, playlist_id: number) {
  const db = await getDb()
  return db.run(`DELETE FROM playlists WHERE id = ? AND account_id = ?`, [playlist_id, account_id])
}
