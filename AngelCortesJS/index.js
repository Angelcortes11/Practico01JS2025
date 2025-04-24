// Variables globales y configuración básica
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameSpeed = 5;
let gravity = 0.5;
let gameOver = false;
let score = 0;
let highScore = 0;
let scoreMilestoneReached = false;

// Objeto dinosaurio
let dino = {
  x: 50,
  y: canvas.height - 47,
  width: 44,
  height: 47,
  vy: 0,
  isJumping: false
};

// Objeto obstáculo (cactus)
let obstacle = {
  x: canvas.width,
  y: canvas.height - 40,
  width: 25,
  height: 40
};

// Carga de imágenes
let dinoImg = new Image();
dinoImg.src = "dino.png";
let cactusImg = new Image();
cactusImg.src = "cactus.png";

// Carga de sonidos
let saltoSound = new Audio("salto.mp3");
let puntoSound = new Audio("punto.mp3");

// Función principal del ciclo de juego
function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// Actualiza posiciones y controla la lógica del juego
function update() {
  score++;

  // Aumentar velocidad y reproducir sonido solo una vez cada 100 puntos
  if (score > 0 && score % 100 === 0 && !scoreMilestoneReached) {
    gameSpeed += 0.5;
    puntoSound.play();
    scoreMilestoneReached = true;
  } else if (score % 100 !== 0) {
    scoreMilestoneReached = false;
  }

  // Movimiento del dino
  if (dino.isJumping) {
    dino.vy += gravity;
    dino.y += dino.vy;

    if (dino.y >= canvas.height - dino.height) {
      dino.y = canvas.height - dino.height;
      dino.isJumping = false;
      dino.vy = 0;
    }
  }

  // Movimiento del obstáculo
  obstacle.x -= gameSpeed;
  if (obstacle.x + obstacle.width < 0) {
    obstacle.x = canvas.width + Math.random() * 200;
  }

  // Colisión
  if (collision(dino, obstacle)) {
    gameOver = true;
    if (score > highScore) {
      highScore = score;
    }
  }
}

// Colisión simple
function collision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// Dibujo del juego
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Puntajes
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);
  ctx.fillText("High Score: " + highScore, 10, 50);

  // Dino (color azul si está saltando)
  if (dinoImg.complete && !dino.isJumping) {
    ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  } else {
    ctx.fillStyle = "blue";
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
  }

  // Obstáculo
  if (cactusImg.complete) {
    ctx.drawImage(cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  } else {
    ctx.fillStyle = "brown";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  }
}

// Salto con espacio
document.addEventListener("keydown", function(e) {
  if (e.code === "Space" && !dino.isJumping && !gameOver) {
    dino.isJumping = true;
    dino.vy = -10;
    saltoSound.play();
    e.preventDefault();
  }
});

// Reiniciar juego manualmente
document.getElementById("restartBtn").addEventListener("click", function () {
  gameOver = false;
  score = 0;
  gameSpeed = 5;
  dino.y = canvas.height - dino.height;
  dino.isJumping = false;
  dino.vy = 0;
  obstacle.x = canvas.width;
  scoreMilestoneReached = false;
  gameLoop();
});

// Reiniciar juego manualmente
document.getElementById("restartbtn").addEventListener("click", function () {
  gameOver = false;
  score = 0;
  gameSpeed = 5;
  dino.y = canvas.height - dino.height;
  dino.isJumping = false;
  dino.vy = 0;
  obstacle.x = canvas.width;
  scoreMilestoneReached = false;
  gameLoop();
});



// Iniciar juego
window.onload = function () {
  gameLoop();
};
