// Dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Configuration
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  'https://chat-socket-io-funny.netlify.app', // New frontend URL (Netlify)
];

// App and Server Setup
const app = express();
const server = http.createServer(app);

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

// Socket.IO Initialization with CORS
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins, // Allow the frontend to connect from this URL
    methods: ['GET', 'POST'], // Allow specific HTTP methods
  },
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle 'chat message' events
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Emit message to all connected clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
