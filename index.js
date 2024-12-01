const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configurar o CORS para permitir requisições do front-end hospedado
app.use(cors({
  origin: 'https://chat-socket-io-funny.netlify.app', // Substitua com o seu domínio
  methods: ['GET', 'POST'],
}));

const io = socketIo(server, {
  cors: {
    origin: 'https://chat-socket-io-funny.netlify.app', // Substitua com o seu domínio
    methods: ['GET', 'POST'],
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
