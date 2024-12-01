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

// Evento de conexão
io.on('connection', (socket) => {
  console.log('Novo usuário conectado');
  
  socket.on('chat message', (msg) => {
    console.log('Mensagem recebida:', msg);
    io.emit('chat message', msg); // Envia a mensagem para todos os clientes conectados
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
