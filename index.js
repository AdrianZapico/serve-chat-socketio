// Dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Configuration
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// App and Server Setup
const app = express();
const server = http.createServer(app);

// CORS Configuration
const allowedOrigins = ['http://localhost:5173'];
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
    origin: allowedOrigins, // Match with frontend origin
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

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Server Start
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
