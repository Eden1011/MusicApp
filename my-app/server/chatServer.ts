import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

io.on('connection', (socket) => {
  const { chatId, userId, userName } = socket.handshake.query;

  socket.join(`chat_${chatId}`);

  socket.on('message', (message) => {
    socket.to(`chat_${chatId}`).emit('message', message);
  });

  socket.on('disconnect', () => {
    socket.leave(`chat_${chatId}`);
  });
});

const PORT = 3001;
const HOST = "0.0.0.0"
httpServer.listen(PORT, HOST, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
