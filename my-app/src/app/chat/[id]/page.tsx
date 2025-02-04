"use client"
import { useParams, useRouter } from 'next/navigation';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import Navbar from '@/app/components/Navbar';
import { useEffect, useState, useRef } from 'react';
import { Box, Container, TextField, Button, Paper, Typography } from '@mui/material';
import { io, Socket } from 'socket.io-client';
import BoxYoutubeError from '@/app/components/BoxYoutubeError';
import Intermission from '@/app/components/Intermission';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useFormik } from 'formik';

interface Message {
  text: string;
  sender: string;
  senderName: string;
  timestamp: string;
}

interface Chat {
  id: number;
  user_id1: number | null;
  user_id2: number | null;
  genre: string | null;
  user1_name: string | null;
  user2_name: string | null;
}

export default function ChatRoom() {
  const params = useParams();
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [account_id, setAccount_id] = useState<string | undefined>();
  const [account_name, setAccount_name] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [connectedUsers] = useState(new Set());

  const formik = useFormik({
    initialValues: {
      message: ''
    },
    onSubmit: (values, { resetForm }) => {
      if (values.message.trim() && socketRef.current && isSocketConnected) {
        const messageData: Message = {
          text: values.message,
          sender: account_id!,
          senderName: account_name!,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, messageData]);
        socketRef.current.emit('message', messageData);
        resetForm();
      }
    }
  });

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem('hasReloaded');
    if (!hasReloaded) {
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload();
      return;
    }
    const storedId = sessionStorage.getItem('account_id');
    const storedName = sessionStorage.getItem('account_name');
    setAccount_id(storedId || undefined);
    setAccount_name(storedName || undefined);

    if (!storedId) {
      setError('Please log in to access the chat.');
      setIsLoading(false);
      return;
    }

    const fetchChat = async () => {
      try {
        const response = await fetch(`/api/chat?id=${params.id}`);
        if (!response.ok) throw new Error('Chat not found');
        const data = await response.json();
        setChat(data);

        if (!data.user_id1?.toString().includes(storedId) &&
          !data.user_id2?.toString().includes(storedId)) {
          setError('You are not a member of this chat.');
          return;
        }

        socketRef.current = io('http://localhost:3001', {
          query: {
            chatId: params.id,
            userId: storedId,
            userName: storedName
          },
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5
        });

        if (!connectedUsers.has(storedId)) {
          const userDescription = sessionStorage.getItem('account_description');
          const joinMessage: Message = {
            text: userDescription && userDescription !== "NONE" ?
              `User ${storedName} joined this chat - "${userDescription}"` :
              `User ${storedName} joined this chat. Say hello!`,
            sender: 'system',
            senderName: 'System',
            timestamp: new Date().toISOString()
          };

          socketRef.current.emit('message', joinMessage);
          setMessages(prev => [...prev, joinMessage]);
          connectedUsers.add(storedId);
        }

        socketRef.current.on('message', (msg: Message) => {
          setMessages(prev => [...prev, msg]);
        });

      } catch (err) {
        setError('Failed to load chat.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChat();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        connectedUsers.delete(storedId);
        sessionStorage.removeItem('hasReloaded')
      }
    };
  }, [params.id, connectedUsers]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('connect', () => {
        setIsSocketConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        setIsSocketConnected(false);
      });
    }
  }, [socketRef.current]);

  const handleExit = async () => {
    const userId = parseInt(account_id!);
    try {
      await fetch('/api/chat/user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: parseInt(params.id as string),
          user_id: userId
        })
      });
      router.push('/chat');
    } catch (error) {
      console.error('Error leaving chat:', error);
    }
  };

  const formatUsername = (username: string) => {
    return username.length > 7 ? username.slice(0, 7) + '...' : username;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        <Container maxWidth="sm">
          {isLoading ? (
            <Box sx={{ mt: 4 }}><Intermission /></Box>
          ) : error ? (
            <Box sx={{ mt: 4 }}><BoxYoutubeError data={{ error: { message: error } }} /></Box>
          ) : (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 4,
              height: 'calc(100vh - 200px)'
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="h5" component="h1">
                  {chat?.genre}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ExitToAppIcon />}
                  onClick={handleExit}
                  sx={{
                    transition: 'all 0.3s ease-in-out, box-shadow 0.2s ease-in-out',
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: 'transparent'
                    },
                    '&:active': {
                      backgroundColor: 'transparent',
                      boxShadow: '0 0 5px 5px rgba(255, 0, 0, 0.5)',
                    }
                  }}
                >
                  Exit Chat
                </Button>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  overflow: 'auto',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      alignSelf: msg.sender === 'system' ? 'center' :
                        msg.sender === account_id ? 'flex-end' : 'flex-start',
                      maxWidth: msg.sender === 'system' ? '90%' : '70%'
                    }}
                  >
                    {msg.sender !== 'system' && (
                      <Box sx={{
                        mb: 0.5,
                        textAlign: msg.sender === account_id ? 'right' : 'left',
                        px: 1
                      }}>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {formatUsername(msg.senderName)}
                        </Typography>
                      </Box>
                    )}
                    <Paper
                      sx={{
                        p: 1,
                        bgcolor: msg.sender === 'system' ? 'grey.900' :
                          msg.sender === account_id ? 'primary.main' : 'grey.800',
                        backdropFilter: 'blur(10px)',
                        backgroundColor: msg.sender === 'system' ? 'rgba(0, 0, 0, 0.5)' :
                          msg.sender === account_id ?
                            'rgba(25, 118, 210, 0.8)' : 'rgba(66, 66, 66, 0.8)',
                        maxWidth: '100%',
                        wordBreak: 'break-word',
                        fontStyle: msg.sender === 'system' ? 'italic' : 'normal'
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {msg.text}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{
                  display: 'flex',
                  gap: 1
                }}
              >
                <TextField
                  fullWidth
                  name="message"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={isSocketConnected ? "Type a message..." : "Connecting to chat..."}
                  variant="outlined"
                  size="small"
                  disabled={!isSocketConnected}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!formik.values.message.trim() || !isSocketConnected}
                >
                  {isSocketConnected ? "Send" : "Connecting..."}
                </Button>
              </Box>
            </Box>
          )}
        </Container>
      </main>
    </ThemeProvider>
  );
}
