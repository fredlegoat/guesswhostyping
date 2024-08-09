// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/joinLobby.html');
});

// Stockage des joueurs côté serveur
const players = [];

io.on('connection', (socket) => {
  console.log('Un joueur s\'est connecté');

  socket.on('joinLobby', (playerName) => {
    players.push({ id: socket.id, name: playerName });
    io.emit('updatePlayerList', getPlayerNames());
  });

  socket.on('disconnect', () => {
    console.log('Un joueur s\'est déconnecté');
    const index = players.findIndex(player => player.id === socket.id);
    if (index !== -1) {
      players.splice(index, 1);
      io.emit('updatePlayerList', getPlayerNames());
    }
  });

  socket.on('startGame', () => {
    // Gérer le démarrage du jeu ici
    io.emit('gameStarted'); // Informer tous les clients que la partie a démarré
  });

  // Écouter les messages du chat émis par les clients
  socket.on('chatMessage', (data) => {
    io.emit('chatMessage', data); // Diffuser le message à tous les clients
  });
});

function getPlayerNames() {
  return players.map(player => player.name);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur écoutant sur le port ${PORT}`);
});
