// Dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Configuration
const PORT = process.env.PORT || 3000;
const allowedOrigins = ['https://chat-socket-io-funny.netlify.app']; // Allowed frontend URL

// App and Server Setup
const app = express();
const server = http.createServer(app);

// CORS Configuration
app.use(
  cors({
    origin: allowedOrigins, // Restrict origins to allowed URLs
    methods: ['GET', 'POST'], // Allow GET and POST methods
    credentials: true, // Enable credentials sharing
  })
);

// Socket.IO Initialization with CORS
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins, // Match frontend URL
    methods: ['GET', 'POST'],
  },
});

// Routes
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Broadcast received message to all connected clients
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Log disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
