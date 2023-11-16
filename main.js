// Variáveis do jogo
var gameContainer = document.getElementById("game-container");
var player = document.getElementById("player");
var gameWidth = gameContainer.offsetWidth;
var gameHeight = gameContainer.offsetHeight;
var playerWidth = player.offsetWidth;
var playerPositionX = (gameWidth - playerWidth) / 2;
var playerSpeed = 5;
var isMovingLeft = false;
var isMovingRight = false;
var bullets = [];
var enemies = [];
var score = 0;
var scoreElement = document.getElementById("score");
var gameOver = false;
var startButton = document.getElementById("start-button");
var gameOverMessage = document.getElementById("game-over-message");

// Eventos de teclado
document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowLeft") {
    isMovingLeft = true;
  }
  if (event.code === "ArrowRight") {
    isMovingRight = true;
  }
  if (event.code === "Space") {
    shoot();
  }
});

document.addEventListener("keyup", function (event) {
  if (event.code === "ArrowLeft") {
    isMovingLeft = false;
  }
  if (event.code === "ArrowRight") {
    isMovingRight = false;
  }
});

// Atualização do jogo
function update() {
  if (gameOver) {
    return;
  }

  if (isMovingLeft && playerPositionX > 0) {
    playerPositionX -= playerSpeed;
  }
  if (isMovingRight && playerPositionX < gameWidth - playerWidth) {
    playerPositionX += playerSpeed;
  }

  player.style.left = playerPositionX + "px";

  // Atualizar posição dos tiros
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    bullet.style.bottom = parseInt(bullet.style.bottom) + 5 + "px";

    // Verificar colisão com inimigos
    for (var j = 0; j < enemies.length; j++) {
      var enemy = enemies[j];
      if (collision(bullet, enemy)) {
        enemy.parentNode.removeChild(enemy);
        enemies.splice(j, 1);
        j--;
        bullet.parentNode.removeChild(bullet);
        bullets.splice(i, 1);
        i--;
        score += 10;
        scoreElement.textContent = "Score: " + score;
      }
    }

    // Verificar limite superior do container
    if (parseInt(bullet.style.bottom) > gameHeight) {
      bullet.parentNode.removeChild(bullet);
      bullets.splice(i, 1);
      i--;
    }
  }

  // Atualizar posição dos inimigos
  for (var k = 0; k < enemies.length; k++) {
    var enemy = enemies[k];
    enemy.style.bottom = parseInt(enemy.style.bottom) - 2 + "px";

    // Verificar colisão com o jogador
    if (collision(player, enemy)) {
      gameOver = true;
      endGame();
    }

    // Verificar limite inferior do container
    if (parseInt(enemy.style.bottom) < 0) {
      enemy.parentNode.removeChild(enemy);
      enemies.splice(k, 1);
      k--;
    }
  }

  // Adicionar inimigos aleatoriamente
  if (Math.random() < 0.02) {
    createEnemy();
  }

  requestAnimationFrame(update);
}

// Função para atirar
function shoot() {
  var bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = playerPositionX + playerWidth / 2 + "px";
  bullet.style.bottom = "40px";
  gameContainer.appendChild(bullet);
  bullets.push(bullet);
}

// Função para criar inimigos
function createEnemy() {
  var enemy = document.createElement("div");
  enemy.className = "enemy";
  enemy.style.left =
    Math.floor(Math.random() * (gameWidth - playerWidth)) + "px";
  enemy.style.bottom = gameHeight + "px";
  gameContainer.appendChild(enemy);
  enemies.push(enemy);
}

// Função para verificar colisão entre dois elementos
function collision(element1, element2) {
  var rect1 = element1.getBoundingClientRect();
  var rect2 = element2.getBoundingClientRect();

  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

// Função para encerrar o jogo
function endGame() {
  gameOverMessage.textContent = "Game Over! Score: " + score;
  gameOverMessage.style.display = "block";
  player.style.display = "none";
  startButton.style.display = "block";
}

// Função para reiniciar o jogo
function resetGame() {
  score = 0;
  scoreElement.textContent = "Score: " + score;
  playerPositionX = (gameWidth - playerWidth) / 2;
  player.style.left = playerPositionX + "px";
  bullets.forEach(function (bullet) {
    bullet.parentNode.removeChild(bullet);
  });
  bullets = [];
  enemies.forEach(function (enemy) {
    enemy.parentNode.removeChild(enemy);
  });
  enemies = [];
  gameOver = false;
  gameOverMessage.style.display = "none";
  player.style.display = "block";
  startButton.style.display = "none";
}

// Evento de clique do botão de Start
startButton.addEventListener("click", startGame);

// Função para iniciar o jogo
function startGame() {
  startButton.style.display = "none";
  resetGame();
  requestAnimationFrame(update);
}
