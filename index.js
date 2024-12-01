// Dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Constants
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
    'https://chat-socket-test-io.netlify.app', // URL do seu frontend
    'http://localhost:3000',  // URL local para desenvolvimento
  ];

// Initialize Express and Server
const app = express();
const server = http.createServer(app);

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection and events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle incoming chat messages
  socket.on('chat message', (msg) => {
    console.log(`Message received: ${msg.content}`);
    io.emit('chat message', msg); // Broadcast to all clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Routes
app.get('/', (req, res) => {
  res.send('Chat server is running');
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
