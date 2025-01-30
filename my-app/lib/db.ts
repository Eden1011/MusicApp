import sqlite3 from "sqlite3";
import { open, Database } from 'sqlite'
import { encrypt, decrypt } from "./crypto";
import fs from 'fs/promises';
import path from 'path';

let db: Database | null = null;

async function logAction(message: string) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  await fs.appendFile(path.join(process.cwd(), 'log.txt'), logEntry);
}

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
    );

    CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id1 INTEGER,
    user_id2 INTEGER,
    genre TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id1) REFERENCES accounts(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id2) REFERENCES accounts(id) ON DELETE SET NULL
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

export interface Chat {
  id: number,
  user_id1: number | null,
  user_id2: number | null,
  genre: string | null,
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
    await logAction(`User of id ${result.lastID} created an account`)
    account.api_key = decrypt(account.api_key)
    account.password = decrypt(account.password)
  }
  return account
}

export async function deleteAccount(account_id: number) {
  const db = await getDb()
  await logAction(`User of id ${account_id} deleted their account`)
  return db.run(`DELETE FROM accounts WHERE id = ?`, account_id)
}

export async function createSong(data: Omit<Song, 'id'>) {
  const db = await getDb()
  const result = await db.run(
    `INSERT INTO songs (title, artist, music_url, thumbnail_url) VALUES (?, ?, ?, ?)`,
    [data.title, data.artist, data.music_url, data.thumbnail_url]
  );
  await logAction(`New song created with id ${result.lastID}: ${data.title} by ${data.artist}`)
  return result
}

export async function addGenresToSong(song_id: number, genres: string[]) {
  const db = await getDb()
  const result = await db.run(`DELETE FROM song_genres WHERE song_id = ?`, song_id)
  for (const genre of genres) {
    await db.run(`INSERT INTO song_genres (song_id, genre) VALUES (?, ?)`, [song_id, genre])
  }
  await logAction(`Genres ${genres} added to song id ${result.lastID}`)
  return result
}

export async function getSongGenres(song_id: number): Promise<string[]> {
  const db = await getDb()
  return await db.all<string[]>(
    `SELECT genre FROM song_genres WHERE song_id = ?`, song_id
  )
}

export async function likeSong(account_id: number, music_url: string) {
  const db = await getDb();
  const songs = await db.all<Song[]>(
    `SELECT * FROM songs WHERE music_url = ?`,
    [music_url]
  );
  if (songs.length === 0) {
    throw new Error('No songs found with this music URL');
  }
  const likePromises = songs.map(song =>
    db.run(
      `INSERT OR IGNORE INTO liked_songs (account_id, song_id) VALUES (?, ?)`,
      [account_id, song.id]
    )
  );
  await Promise.all(likePromises);
  await logAction(`User ${account_id} liked song: ${music_url}`)
  return {
    liked_count: songs.length
  };
}

export async function getLikedSongs(account_id: number): Promise<Song[]> {
  const db = await getDb();
  await logAction(`Retrieving liked songs of account id ${account_id}`)
  return db.all<Song[]>(
    `SELECT * FROM songs
    JOIN liked_songs ON liked_songs.song_id = songs.id
    WHERE liked_songs.account_id = ?
    `, account_id)
}

export async function deleteLikedSong(account_id: number, music_url: string) {
  const db = await getDb()
  const songs = await db.all<Song[]>(`SELECT * FROM songs WHERE music_url = ?`, [music_url]);
  if (songs.length === 0) {
    throw new Error('No songs found with this music URL');
  }
  const deletePromises = songs.map(song =>
    db.run('DELETE FROM liked_songs WHERE account_id = ? AND song_id = ?', [account_id, song.id])
  );
  await Promise.all(deletePromises);
  await logAction(`User ${account_id} unliked song ${music_url}`)
  return { deleted_count: songs.length };
}

export async function createPlaylist(data: Omit<Playlist, 'id' | 'created_at'>) {
  const db = await getDb()
  const result = await db.run(`
  INSERT INTO playlists (name, account_id) VALUES (?, ?)`,
    [data.name, data.account_id]
  )
  await logAction(`Created a new playlist for user ${data.account_id}`)
  return db.get(`SELECT * FROM playlists WHERE id = ?`, result.lastID)
}

export async function addSongToPlaylist(playlist_id: number, music_url: string) {
  const db = await getDb();
  const songs = await db.all<Song[]>(`SELECT * FROM songs WHERE music_url = ?`, [music_url]);

  if (songs.length === 0) {
    throw new Error('No songs found with this music URL');
  }

  const addPromises = songs.map(song =>
    db.run(
      `INSERT OR IGNORE INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)`,
      [playlist_id, song.id]
    )
  );

  await Promise.all(addPromises);
  await logAction(`Added song ${music_url} to playlist id ${playlist_id}`)
  return { added_count: songs.length };
}

export async function removeSongFromPlaylist(playlist_id: number, music_url: string) {
  const db = await getDb();
  const songs = await db.all<Song[]>(`SELECT * FROM songs WHERE music_url = ?`, [music_url]);

  if (songs.length === 0) {
    throw new Error('No songs found with this music URL');
  }

  const removePromises = songs.map(song =>
    db.run(
      `DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?`,
      [playlist_id, song.id]
    )
  );

  await Promise.all(removePromises);
  await logAction(`Removed song ${music_url} from playlist id ${playlist_id}`)
  return { removed_count: songs.length };
}

export async function getAccountPlaylists(account_id: number): Promise<Playlist[]> {
  const db = await getDb();
  await logAction(`Retrieving account playlists for user id ${account_id}`)
  return db.all<Playlist[]>(
    `SELECT * FROM playlists WHERE account_id = ?`, account_id
  )
}

export async function getPlaylistSongs(playlist_id: number): Promise<Song[]> {
  const db = await getDb();
  await logAction(`Retrieving playlist songs for playlist id ${playlist_id}`)
  return db.all<Song[]>(
    `SELECT * FROM songs
    JOIN playlist_songs ON playlist_songs.song_id = songs.id
    WHERE playlist_songs.playlist_id = ?`, playlist_id
  )
}

export async function deletePlaylist(account_id: number, playlist_id: number) {
  const db = await getDb()
  await logAction(`Deleting playlist ${playlist_id} for user ${account_id}`)
  return db.run(`DELETE FROM playlists WHERE id = ? AND account_id = ?`, [playlist_id, account_id])
}

export async function createChat(): Promise<Chat | undefined> {
  const db = await getDb()
  const result = await db.run(
    `INSERT INTO chats (user_id1, user_id2, genre) VALUES (NULL, NULL, NULL)`
  );
  await logAction(`Created a new chat with null fields`)
  return db.get<Chat>('SELECT * FROM chats WHERE id = ?', result.lastID)
}

export async function addUserToChat(chat_id: number, user_id: number): Promise<Chat | undefined> {
  const db = await getDb()
  const chat = await db.get<Chat>('SELECT * FROM chats WHERE id = ?', chat_id)

  if (!chat) {
    throw new Error('Chat not found')
  }

  if (chat.user_id1 === null) {
    await db.run(
      `UPDATE chats SET user_id1 = ? WHERE id = ?`,
      [user_id, chat_id]
    )
  } else if (chat.user_id2 === null) {
    await db.run(
      `UPDATE chats SET user_id2 = ? WHERE id = ?`,
      [user_id, chat_id]
    )
  } else {
    throw new Error('Chat is full')
  }
  await logAction(`Added user ${user_id} to chat ${chat_id}`)
  return db.get<Chat>('SELECT * FROM chats WHERE id = ?', chat_id)
}

export async function addGenreToChat(chat_id: number, genre: string): Promise<Chat | undefined> {
  const db = await getDb()
  const chat = await db.get<Chat>('SELECT * FROM chats WHERE id = ?', chat_id)

  if (!chat) {
    throw new Error('Chat not found')
  }

  await db.run(
    `UPDATE chats SET genre = ? WHERE id = ?`,
    [genre, chat_id]
  )
  await logAction(`Added genre ${genre} to chat ${chat_id}`)
  return db.get<Chat>('SELECT * FROM chats WHERE id = ?', chat_id)
}

export async function deleteChat(chat_id: number) {
  const db = await getDb()
  await logAction(`Deleted chat ${chat_id}`)
  return db.run(`DELETE FROM chats WHERE id = ?`, chat_id)
}
