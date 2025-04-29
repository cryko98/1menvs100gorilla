const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player;
let enemies = [];
let bullets = [];
let isPaused = false;
let gameStarted = false;
let totalEnemies = 100;
let enemySpeed = 0.3;
let currentDifficulty = null;
let animationFrameId = null;
let selectedButton = null;

const enemyEmoji = '🪰';
const playerEmoji = '🐸';

function initGame() {
  player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    speed: 7
  };

  enemies = [];
  bullets = [];

  let enemyCount = 100;
  if (enemySpeed === 0.3) enemyCount = 80;
  else if (enemySpeed === 0.6) enemyCount = 90;
  else if (enemySpeed === 0.9) enemyCount = 100;

  for (let i = 0; i < enemyCount; i++) {
    enemies.push({
      x: Math.random() * (canvas.width - 30),
      y: Math.random() * -1000,
      width: 30,
      height: 30,
      speed: enemySpeed
    });
  }

  document.getElementById('enemyCount').innerText = enemies.length;
}

function selectDifficulty(button, level) {
  if (selectedButton) {
    selectedButton.classList.remove('selected');
  }

  selectedButton = button;
  selectedButton.classList.add('selected');
  currentDifficulty = level;
  document.getElementById('start-button').disabled = false;
}

function startGame() {
  if (!currentDifficulty) return;

  cancelAnimationFrame(animationFrameId); // ← ezt adtuk hozzá

  if (currentDifficulty === 'easy') {
    enemySpeed = 0.3;
  } else if (currentDifficulty === 'medium') {
    enemySpeed = 0.6;
  } else if (currentDifficulty === 'hard') {
    enemySpeed = 0.9;
  }

  initGame();
  gameStarted = true;
  isPaused = false;
  animate();
}

function animate() {
  if (isPaused || !gameStarted) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.font = "30px Arial";
  ctx.fillText(playerEmoji, player.x, player.y + 30);

  // Draw bullets
  ctx.fillStyle = "lime";
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, 5, 25);
    bullet.y -= 8;
  });

  bullets = bullets.filter(bullet => bullet.y > 0);

  // Draw enemies
  ctx.font = "30px Arial";
  enemies.forEach(enemy => {
    ctx.fillText(enemyEmoji, enemy.x, enemy.y + 30);
    enemy.y += enemy.speed;

    if (enemy.y + enemy.height > canvas.height) {
      alert("You Lose!");
      gameStarted = false;
      cancelAnimationFrame(animationFrameId);
      return;
    }
  });

  // Collision detection
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (bullet.x < enemy.x + enemy.width &&
          bullet.x + 5 > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + 25 > enemy.y) {
        enemies.splice(enemyIndex, 1);
        bullets.splice(bulletIndex, 1);
        document.getElementById('enemyCount').innerText = enemies.length;

        if (enemies.length === 0) {
          alert("You Win!");
          gameStarted = false;
          cancelAnimationFrame(animationFrameId);
        }
      }
    });
  });

  animationFrameId = requestAnimationFrame(animate);
}

document.addEventListener('mousemove', function (e) {
  let rect = canvas.getBoundingClientRect();
  player.x = e.clientX - rect.left - player.width / 2;
});

document.addEventListener('click', function () {
  if (gameStarted && !isPaused) {
    bullets.push({
      x: player.x + player.width / 2 - 2.5,
      y: player.y,
    });
  }
});

function pauseGame() {
  isPaused = !isPaused;
  if (!isPaused) animate();
}

function restartGame() {
  if (currentDifficulty) {
    cancelAnimationFrame(animationFrameId); // ← biztos ami biztos
    initGame();
    gameStarted = true;
    isPaused = false;
    animate();
  }
}
