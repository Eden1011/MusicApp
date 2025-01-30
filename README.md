# Krzysztof Glowka 291692 Grupa 4

# Music Streaming Application

A Next.js application for music streaming with features including playlist management, chat rooms, YouTube integration, and genre-based music discovery.

## Requirements

- Node.js (v18 or higher)
- NPM
- SQLite3

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

Start WebSocket chat server:
```bash
npm run dev:chat
```

The application will be available at `http://localhost:3000`

## Features

### Authentication
- Account creation and management
- API key generation and validation
- Session-based authentication

### Music Streaming
- YouTube integration for music playback
- Genre-based music discovery
- Custom video player with playlist support
- Search functionality for songs and artists

### Social Features
- Real-time chat rooms
- Genre-specific chat rooms
- User presence tracking
- Chat history

### Library Management
- Create and manage playlists
- Like/unlike songs
- Add songs to playlists
- Browse by genre

## API Endpoints

### Authentication
- `POST /api/login` - User authentication
- `GET /api/account/key` - Get API key
- `PATCH /api/account/description` - Update account description

### Music
- `GET /api/songs/all` - Get all available songs
- `GET /api/youtube/search` - Search YouTube for songs
- `GET /api/genre/all` - Get all music genres

### Chat
- `GET /api/chat/available` - Get available chat rooms
- `GET /api/chat/genre` - Get genre-specific chat rooms
- `GET /api/chat/user` - Get user chat history

### Playlists
- `GET /api/playlist/user` - Get user playlists
- `POST /api/playlist/song` - Add song to playlist
- `DELETE /api/playlist` - Delete playlist

## Project Structure

```text
src/
  └── app/
      ├── account/          # Account management pages
      ├── api/              # API route handlers
      │   ├── account/      # Account management endpoints
      │   ├── ads/          # Advertisement system
      │   ├── chat/         # Chat system endpoints
      │   ├── genre/        # Genre management
      │   ├── likes/        # Song likes system
      │   ├── playlist/     # Playlist management
      │   ├── songs/        # Song management
      │   └── youtube/      # YouTube integration
      ├── chat/             # Chat interface pages
      ├── components/       # Reusable React components
      ├── library/          # Music library pages
      ├── playlist/         # Playlist pages
      ├── search/           # Search functionality
      └── watch/            # Video player pages
hooks/                      # Custom React hook (for session management)
styles/                     # Theme configuration
```

## Components

### UI Components
- `AdComponent` - Advertisement display
- `BoxBackground` - Styled container
- `CallsLeft` - API usage tracking
- `InputWatchSearch` - Search input for videos
- `SearchResults` - Search results display
- `VideoPlayer` - Custom video player

### Functional Components
- `Navbar` - Navigation and user controls
- `Login` - Authentication form
- `Popup` - Modal notifications
- `SongCard` - Song information display

## Tech Stack

- Next.js 13+ (App Router)
- React 18
- TypeScript
- Material UI
- SQLite3
- WebSocket (for chat)
