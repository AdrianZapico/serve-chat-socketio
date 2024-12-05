const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configurar o CORS para permitir requisições do front-end hospedado
app.use(
  cors({
    origin: 'https://chat-socket-io-funny.netlify.app', // Substitua com o seu domínio
    methods: ['GET', 'POST'],
  })
);

const io = socketIo(server, {
  cors: {
    origin: 'https://chat-socket-io-funny.netlify.app', // Substitua com o seu domínio
    methods: ['GET', 'POST'],
  },
});

let onlineUsers = {}; // Armazenar usuários online

// Evento de conexão
io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  // Quando o cliente envia um nome de usuário
  socket.on('set username', (username) => {
    onlineUsers[socket.id] = username; // Associa o socket.id ao nome de usuário
    console.log(`${username} entrou no chat`);
    io.emit('update online users', Object.values(onlineUsers)); // Atualiza a lista de usuários para todos
  });

  // Quando uma mensagem é enviada
  socket.on('chat message', (msg) => {
    console.log('Mensagem recebida:', msg);
    io.emit('chat message', msg); // Envia a mensagem para todos os clientes conectados
  });

  // Evento de desconexão
  socket.on('disconnect', () => {
    const username = onlineUsers[socket.id];
    delete onlineUsers[socket.id]; // Remove o usuário desconectado
    console.log(`${username || 'Um usuário'} desconectou-se`);
    io.emit('update online users', Object.values(onlineUsers)); // Atualiza a lista
  });
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
