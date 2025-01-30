"use client"
import Navbar from '../components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import { useEffect, useState, useMemo } from 'react';
import BoxYoutubeError from '../components/BoxYoutubeError';
import Intermission from '../components/Intermission';
import { Box, Button, Container, List, ListItem, ListItemButton, ListItemText, Collapse, Typography, TextField, Paper, Checkbox } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import Fuse from 'fuse.js';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';

interface Chat {
  id: number;
  user_id1: number | null;
  user_id2: number | null;
  genre: string | null;
  user1_name: string | null;
  user2_name: string | null;
}

export default function ChatPage() {
  const router = useRouter();
  const [account_id, setAccount_id] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [openChatId, setOpenChatId] = useState<number | null>(null);
  const [chatFilterQuery, setChatFilterQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showMineOnly, setShowMineOnly] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  const [filteredGenres, setFilteredGenres] = useState<string[]>([]);
  const [validGenres, setValidGenres] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: {
      genre: ''
    },
    onSubmit: () => { }
  });

  const fuse = useMemo(() => new Fuse(validGenres, {
    threshold: 0.4,
    distance: 100,
  }), [validGenres]);

  const isValidGenre = (query: string) => {
    return validGenres.includes(query);
  };

  useEffect(() => {
    const init = async () => {
      setAccount_id(sessionStorage.getItem('account_id') || undefined);
      await fetchGenres();
      await fetchChats();
      setIsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!formik.values.genre.trim()) {
      setFilteredGenres(validGenres);
      return;
    }
    const results = fuse.search(formik.values.genre);
    const filtered = results.map(result => result.item);
    setFilteredGenres(filtered);
  }, [formik.values.genre, fuse, validGenres]);

  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/genre/all');
      if (response.ok) {
        const data = await response.json();
        setValidGenres(data.genres);
        setFilteredGenres(data.genres);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chat/all');
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const handleDeleteChat = async (chatId: number) => {
    try {
      const response = await fetch(`/api/chat?id=${chatId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete chat');
      fetchChats();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreateChat = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to create chat');
      const chat = await response.json();

      const userResponse = await fetch('/api/chat', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chat.id,
          user_id: parseInt(account_id!)
        })
      });

      if (!userResponse.ok) throw new Error('Failed to add user to chat');

      if (formik.values.genre) {
        const genreResponse = await fetch('/api/chat/genre', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chat.id,
            genre: formik.values.genre
          })
        });

        if (!genreResponse.ok) throw new Error('Failed to set genre');
      }

      fetchChats();
      formik.resetForm();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleJoinChat = async (chatId: number) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          user_id: parseInt(account_id!)
        })
      });

      if (!response.ok) throw new Error('Failed to join chat');
      fetchChats();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRemoveUser = async (chatId: number, userId: number) => {
    try {
      const response = await fetch('/api/chat/user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          user_id: userId
        })
      });

      if (!response.ok) throw new Error('Failed to remove user');
      fetchChats();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getUserCount = (chat: Chat) => {
    let count = 0;
    if (chat.user_id1) count++;
    if (chat.user_id2) count++;
    return count;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        {isLoading ? (
          <Intermission />
        ) : account_id ? (
          <Container maxWidth="sm">
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 4
            }}>
              <Box sx={{ position: 'relative' }}>
                <TextField
                  fullWidth
                  name="genre"
                  value={formik.values.genre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={() => setShowGenres(true)}
                  onBlurCapture={() => setTimeout(() => setShowGenres(false), 200)}
                  placeholder="Enter genre"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      ...(formik.values.genre !== '' && !isValidGenre(formik.values.genre) && {
                        '& fieldset': {
                          borderColor: 'red',
                          borderWidth: '2px',
                          boxShadow: '0 0 5px rgba(255, 0, 0, 0.5)'
                        }
                      })
                    }
                  }}
                />
                {showGenres && filteredGenres.length > 0 && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 1000,
                    }}
                  >
                    <List>
                      {filteredGenres.map((genre) => (
                        <ListItemButton
                          key={genre}
                          onClick={() => {
                            formik.setFieldValue('genre', genre);
                            setShowGenres(false);
                          }}
                        >
                          <ListItemText primary={genre} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Paper>
                )}
              </Box>

              <Button
                variant="contained"
                color={!isValidGenre(formik.values.genre) ? "error" : "primary"}
                onClick={handleCreateChat}
                fullWidth
                disabled={!formik.values.genre || !isValidGenre(formik.values.genre)}
                sx={{ mt: "-1rem" }}
              >
                {!formik.values.genre ? "Input a proper genre to start chat" :
                  !isValidGenre(formik.values.genre) ? "No such genre" :
                    "Create New Chat"}
              </Button>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Look up..."
                    value={chatFilterQuery}
                    onChange={(e) => setChatFilterQuery(e.target.value)}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="label">
                      Available
                    </Typography>
                    <Checkbox
                      checked={showAvailableOnly}
                      onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    />
                    <Typography component="label">
                      Mine
                    </Typography>
                    <Checkbox
                      checked={showMineOnly}
                      onChange={(e) => setShowMineOnly(e.target.checked)}
                    />
                  </Box>
                </Box>
              </Box>

              <List>
                {chats
                  .filter(chat => {
                    const matchesGenre = !chatFilterQuery || (chat.genre && chat.genre.toLowerCase().includes(chatFilterQuery.toLowerCase()));
                    const matchesAvailability = !showAvailableOnly || getUserCount(chat) < 2;
                    const matchesMine = !showMineOnly || (chat.user_id1?.toString() === account_id || chat.user_id2?.toString() === account_id);
                    return matchesGenre && matchesAvailability && matchesMine;
                  })
                  .map((chat) => (
                    <Box key={chat.id}>
                      <ListItemButton onClick={() => setOpenChatId(openChatId === chat.id ? null : chat.id)}>
                        <ListItemText
                          primary={chat.genre}
                        />
                        {getUserCount(chat) === 0 && (
                          <DeleteIcon
                            sx={{ mr: 1, cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(chat.id);
                            }}
                          />
                        )}
                        {openChatId === chat.id ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={openChatId === chat.id} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItem sx={{ pl: 4 }}>
                            <Box>
                              <Typography>
                                Status: {getUserCount(chat)}/2
                              </Typography>
                              {chat.user_id1 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography>User 1: {chat.user1_name} (ID: {chat.user_id1})</Typography>
                                  {parseInt(account_id!) === chat.user_id1 && (
                                    <Button
                                      size="small"
                                      color="error"
                                      variant='outlined'
                                      onClick={() => handleRemoveUser(chat.id, chat.user_id1!)}
                                      sx={{
                                        transition: 'all 0.3s ease-in-out, box-shadow 0.2s ease-in-out',
                                        '&:hover': {
                                          backgroundColor: 'transparent',
                                        },
                                        '&:active': {
                                          backgroundColor: 'transparent',
                                          boxShadow: '0 0 5px 5px rgba(255, 0, 0, 0.5)',
                                        }
                                      }}
                                    >
                                      Leave
                                    </Button>
                                  )}
                                </Box>
                              )}
                              {chat.user_id2 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography>User 2: {chat.user2_name} (ID: {chat.user_id2})</Typography>
                                  {parseInt(account_id!) === chat.user_id2 && (
                                    <Button
                                      size="small"
                                      color="error"
                                      onClick={() => handleRemoveUser(chat.id, chat.user_id2!)}
                                    >
                                      Leave
                                    </Button>
                                  )}
                                </Box>
                              )}
                              {(chat.user_id1?.toString() === account_id || chat.user_id2?.toString() === account_id) && (
                                <Button
                                  size="small"
                                  color="primary"
                                  variant='outlined'
                                  sx={{
                                    transition: 'all 0.3s ease-in-out, box-shadow 0.2s ease-in-out',
                                    '&:hover': {
                                      backgroundColor: 'transparent',
                                    },
                                    '&:active': {
                                      backgroundColor: 'transparent',
                                    }
                                  }}
                                  onClick={() => router.push(`/chat/${chat.id}`)}
                                >
                                  Show
                                </Button>
                              )}
                              {getUserCount(chat) < 2 &&
                                !chat.user_id1?.toString().includes(account_id!) &&
                                !chat.user_id2?.toString().includes(account_id!) && (
                                  <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleJoinChat(chat.id)}
                                    sx={{ mt: 1 }}
                                  >
                                    Join Chat
                                  </Button>
                                )}
                            </Box>
                          </ListItem>
                        </List>
                      </Collapse>
                    </Box>
                  ))}
              </List>
            </Box>
          </Container>
        ) : (
          <BoxYoutubeError data={{ error: { message: 'Please log in to be able to create chats.' } }} />
        )}
      </main>
    </ThemeProvider>
  );
}
