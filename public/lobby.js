document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const playerName = urlParams.get("player");

  const socket = io();

  if (playerName) {
    addPlayerToList(playerName);
    // Informer le serveur qu'un joueur a rejoint le lobby
    socket.emit('joinLobby', playerName);
  } else {
    window.location.href = "index.html";
  }

  socket.on('updatePlayerList', (playerList) => {
    const playerListElement = document.getElementById("playerList");
    playerListElement.innerHTML = "";

    playerList.forEach(player => {
      addPlayerToList(player);
    });

    updatePlayerCount();
  });

  function addPlayerToList(playerName) {
    const playerList = document.getElementById("playerList");
    const li = document.createElement("li");
    li.textContent = playerName;
    playerList.appendChild(li);
  }

  function removePlayerFromList(playerName) {
    const playerList = document.getElementById("playerList");
    const players = playerList.getElementsByTagName("li");

    for (let i = 0; i < players.length; i++) {
      if (players[i].textContent === playerName) {
        playerList.removeChild(players[i]);
        break;
      }
    }

    updatePlayerCount();
  }

  function updatePlayerCount() {
    const playerCountElement = document.getElementById("playerCount");
    const currentCount = document.getElementById("playerList").childElementCount;
    playerCountElement.textContent = currentCount;
  }

  window.leaveLobby = function () {
    const confirmed = confirm("Êtes-vous sûr de vouloir quitter le lobby ?");
    
    if (confirmed) {
      window.location.href = "joinLobby.html";
      removePlayerFromList(playerName);
      socket.disconnect(); // Déconnexion du socket côté client
    }
  }

  window.startGame = function () {
    const minPlayers = 3;
    const playerCount = document.getElementById("playerList").childElementCount;

    if (playerCount >= minPlayers) {
      // Informer le serveur que la partie va commencer
      socket.emit('startGame');
    } else {
      alert(`Il faut au moins ${minPlayers} joueurs pour démarrer la partie.`);
    }
  }

  // Écouter l'événement 'gameStarted' émis par le serveur
  socket.on('gameStarted', () => {
    // Rediriger vers la page du jeu
    window.location.href = "game.html";
  });
});
