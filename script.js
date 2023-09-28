// Import necessary elements and libraries
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const pauseButton = document.getElementById('pause-button');
const levelDisplay = document.getElementById('level');
const restartButton = document.getElementById('restart-button');
const socket = io();
const levelMenu = document.getElementById('level-menu');
const highScoreForm = document.getElementById('high-score-form');
const playerNameInput = document.getElementById('player-name');

// Function to update the high scores list on the client
function updateHighScores(scores) {
  const highScoresList = document.getElementById('high-scores-list');
  highScoresList.innerHTML = '';

  for (const { name, score } of scores) {
    const listItem = document.createElement('li');
    listItem.textContent = `${name}: ${score}`;
    highScoresList.appendChild(listItem);
  }
}

// Handle the form submission for submitting high scores
highScoreForm.addEventListener('submit', e => {
  e.preventDefault();
  const playerName = playerNameInput.value;
  const playerScore = score;

  // Emit a socket event to submit the high score
  socket.emit('submitHighScore', { name: playerName, score: playerScore });
});

// Listen for updates to high scores
socket.on('updateHighScores', updateHighScores);

// Define the game board size
const gridSize = 20;

// Initialize variables
let foodCount = 0;
let bunny = [{ x: 5, y: 5 }];
let food = { x: 10, y: 10 };
let direction = 'right';
let changingDirection = false;
let score = 0;
let level = 1;
let bunnySpeed = levels[level - 1].speed;

// Define game levels with speeds
const levels = [
  { level: 1, speed: 150 },
  { level: 2, speed: 140 },
  { level: 3, speed: 130 },
  { level: 4, speed: 120 },
  { level: 5, speed: 110 },
  { level: 6, speed: 100 },
  { level: 7, speed: 90 },
  { level: 8, speed: 80 },
  { level: 9, speed: 70 },
  { level: 10, speed: 60 },
];

// Function to create the game board
function createGameBoard() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('data-x', x);
      cell.setAttribute('data-y', y);
      gameBoard.appendChild(cell);
    }
  }
}

// Function to clear the game board
function clearGameBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove('bunny', 'food');
  });
}

// Function to draw the bunny on the game board
function drawBunny() {
  bunny.forEach(segment => {
    const cell = document.querySelector(`.cell[data-x="${segment.x}"][data-y="${segment.y}"]`);
    cell.classList.add('bunny');
  });
}

// Adding touch event listeners
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchEnd, false);

function handleTouchStart(event) {
  // Handle touch start event
  // Implement your touch control logic here
}

function handleTouchEnd(event) {
  // Handle touch end event
  // Implement your touch control logic here
}

let isPaused = false;

pauseButton.addEventListener('click', () => {
  if (isPaused) {
    // Resume the game
    isPaused = false;
    pauseButton.textContent = 'Pause';
    resumeGame();
  } else {
    // Pause the game
    isPaused = true;
    pauseButton.textContent = 'Resume';
    pauseGame();
  }
});

function pauseGame() {
  clearInterval(gameInterval);
  // add additional code to freeze game elements or display a pause overlay.
}

function resumeGame() {
  // Resume the game loop and unfreeze game elements.
  gameInterval = setInterval(updateGame, bunnySpeed);
}

// Function to draw the food on the game board
function drawFood() {
  const foodCell = document.querySelector(`.cell[data-x="${food.x}"][data-y="${food.y}"]`);
  foodCell.classList.add('food');
}

// Function to move the bunny
function moveBunny() {
  const head = { ...bunny[0] };

  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  bunny.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    foodCount++; // Increase food count
    updateScore();
    generateFood();
  } else {
    bunny.pop();
  }
}

// Function to generate food on the game board
function generateFood() {
  food = {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize)
  };

  const bunnyBody = new Set(bunny.map(segment => `${segment.x}-${segment.y}`));
  if (bunnyBody.has(`${food.x}-${food.y}`)) {
    generateFood();
  }
}

// Function to check collision with walls and the bunny's own body
function checkCollision() {
  const head = bunny[0];
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    endGame();
  }

  const bunnyBody = new Set(bunny.map(segment => `${head.x}-${head.y}`));
  bunnyBody.delete(`${head.x}-${head.y}`);
  if (bunnyBody.has(`${head.x}-${head.y}`)) {
    endGame();
  }
}

// Function to handle the end of the game
function endGame() {
  clearInterval(gameInterval);
  alert(`Game Over! Your score: ${score}`);
  resetGame();
}

// Function to reset the game
function resetGame() {
  bunny = [{ x: 5, y: 5 }]; // Reset bunny position
  food = { x: 10, y: 10 }; // Reset food position
  direction = 'right'; // Reset direction
  score = 0; // Reset score
  clearGameBoard();
  drawBunny();
  drawFood();
  gameInterval = setInterval(updateGame, bunnySpeed);
}

// Function to update the game
function updateGame() {
  changingDirection = false;
  clearGameBoard();
  moveBunny();
  checkCollision();
  drawBunny();
  drawFood();
  checkLevelCompletion();
}

// Function to check if the level is completed
function checkLevelCompletion() {
  if (foodCount === 5) {
    increaseLevel();
  }
}

// Initialize food count
let foodCount = 0;

// Function to increase the game level
function increaseLevel() {
  foodCount = 0; // Reset food count
  level++;
  levelDisplay.textContent = `Level: ${level}`;
  clearInterval(gameInterval);
  bunnySpeed = levels[level - 1].speed;
  gameInterval = setInterval(updateGame, bunnySpeed);
}

// Function to update the player's score
function updateScore() {
  scoreElement.textContent = `Score: ${score}`;
}

// Event listener for keydown events
document.addEventListener('keydown', e => {
  if (changingDirection) return;
  changingDirection = true;

  const key = e.key;
  switch (key) {
    case 'ArrowUp':
      if (direction !== 'down') direction = 'up';
      break;
    case 'ArrowDown':
      if (direction !== 'up') direction = 'down';
      break;
    case 'ArrowLeft':
      if (direction !== 'right') direction = 'left';
      break;
    case 'ArrowRight':
      if (direction !== 'left') direction = 'right';
      break;
  }
});

// Initialize the game
createGameBoard();
drawBunny();
drawFood();
let gameInterval = setInterval(updateGame, bunnySpeed);

// Show the level menu
levelButton.addEventListener('click', () => {
  levelMenu.style.display = 'block';
});

// Handle level button clicks
const levelButtonsContainer = document.querySelector('.level-buttons');

for (const button of levelButtons) {
  button.addEventListener('click', () => {
    const selectedLevel = parseInt(button.dataset.level);
    setLevel(selectedLevel);
  });
  levelButtonsContainer.appendChild(button); // Append buttons to the container
}

// Function to set the current game level
function setLevel(selectedLevel) {
  level = selectedLevel;
  levelDisplay.textContent = `Level: ${level}`;
  bunnySpeed = levels[level - 1].speed;
  levelMenu.style.display = 'none';
  restartGame();
}

// Function to restart the game
function restartGame() {
  clearInterval(gameInterval);
  resetGame();
  gameInterval = setInterval(updateGame, bunnySpeed);
}

// Event listener for the restart button
restartButton.addEventListener('click', () => {
  levelMenu.style.display = 'block';
});

// Socket.io connection handling
//  include the necessary library in your HTML
