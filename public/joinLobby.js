// joinLobby.js
document.addEventListener("DOMContentLoaded", function () {
  const socket = io();

  // Définition de la fonction joinLobby
  window.joinLobby = function () {
    const playerNameInput = document.getElementById("playerName");
    const playerName = playerNameInput.value.trim();

    if (playerName !== "") {
      // Émettre un événement pour informer le serveur qu'un joueur rejoint le lobby
      socket.emit('joinLobby', playerName);

      // Rediriger vers la page du lobby avec le nom du joueur
      window.location.href = `lobby.html?player=${encodeURIComponent(playerName)}`;
    }
  }
});
