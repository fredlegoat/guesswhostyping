document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const playerName = urlParams.get("player");
  
    const socket = io();
  
    // Écouter l'événement 'gameStarted' émis par le serveur
    socket.on('gameStarted', () => {
      // Afficher un message ou effectuer des actions spécifiques au démarrage du jeu
      console.log("Le jeu a démarré !");
    });
  
    const chatList = document.getElementById("chatList");
    const messageInput = document.getElementById("messageInput");
    const timerElement = document.getElementById("timer");
  
    let timerMinutes = 10;
    let timerSeconds = 0;
  
    // Fonction pour mettre à jour le timer
    function updateTimer() {
      const minutes = timerMinutes < 10 ? "0" + timerMinutes : timerMinutes;
      const seconds = timerSeconds < 10 ? "0" + timerSeconds : timerSeconds;
      timerElement.textContent = `${minutes}:${seconds}`;
    }
  
    // Fonction pour générer une couleur aléatoire lisible
    function getRandomColor() {
      const letters = "56789ABCDEF"; // Éviter les couleurs trop vives
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
      }
      return color;
    }
  
    const playerColors = {}; // Un objet pour stocker les couleurs associées à chaque joueur
  
    // Fonction pour associer une couleur à un joueur et retourner cette couleur
    function getPlayerColor(playerName) {
      if (!playerColors[playerName]) {
        playerColors[playerName] = getRandomColor();
      }
      return playerColors[playerName];
    }
  
    // Fonction pour choisir un joueur aléatoire parmi ceux présents dans le lobby
  function chooseRandomPlayer() {
    const players = Object.keys(playerColors);
    const randomIndex = Math.floor(Math.random() * players.length);
    return players[randomIndex];
  }

  // Fonction pour afficher le pseudo d'un joueur aléatoire
function displayRandomPlayer() {
  const randomPlayer = chooseRandomPlayer();
  const mysteryPlayerElement = document.getElementById("mysteryPlayer");
  mysteryPlayerElement.textContent = randomPlayer;
  alert(`Le joueur mystère est : ${randomPlayer}`);
}


    // Fonction pour faire défiler la liste des messages vers le bas
    function scrollToBottom() {
      chatList.scrollTop = chatList.scrollHeight;
    }
  
    // Fonction pour envoyer un message dans le chat
    window.sendMessage = function () {
      const message = messageInput.value.trim();
      if (message !== "") {
        const playerColor = getPlayerColor(playerName);
        // Émettre un événement pour envoyer le message au serveur avec la couleur du joueur
        socket.emit('chatMessage', { playerName, message, playerColor });
        messageInput.value = ""; // Effacer le champ de saisie après l'envoi du message
      }
    }
  
    // Ajouter un écouteur d'événements pour la touche "Entrer" dans le champ de texte du message
    messageInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Empêcher le saut de ligne dans le champ de texte
        sendMessage(); // Appeler la fonction sendMessage lorsque la touche "Entrer" est pressée
      }
    });
  
    // Écouter les messages du chat émis par le serveur
    socket.on('chatMessage', (data) => {
      const li = document.createElement("li");
      li.textContent = `${data.message}`;
      li.style.backgroundColor = data.playerColor; // Appliquer la couleur du joueur au message
      chatList.appendChild(li);
      
      // Faire défiler vers le bas après l'ajout d'un nouveau message
      scrollToBottom();
    });
  
    // Mettre à jour le timer chaque seconde
    const timerInterval = setInterval(() => {
      if (timerMinutes === 0 && timerSeconds === 0) {
        // Le temps est écoulé, vous pouvez ajouter des actions spécifiques ici
        clearInterval(timerInterval);
      } else {
        if (timerSeconds === 0) {
          timerMinutes--;
          timerSeconds = 59;
        } else {
          timerSeconds--;
        }
        updateTimer();
      }
    }, 1000);
  });
  