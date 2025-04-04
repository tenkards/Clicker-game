// Game variables
var score = 0;
var timeLeft = 30; // Game duration in seconds
var timer;
var targetSize = 30; // Width and height in pixels
var gameContainer = document.getElementById('game-container');

// DOM elements
var target = document.getElementById('target');
var scoreDisplay = document.getElementById('score');
var timerDisplay = document.getElementById('timer');

// Button elements
var startButton = document.getElementById('start-button');
var endButton = document.getElementById('end-button');
var restartButton = document.getElementById('restart-button');

// Attach event listeners to buttons
startButton.addEventListener('click', restartGame);
endButton.addEventListener('click', endGame);
restartButton.addEventListener('click', restartGame);

// Initialize target styles
function initializeTarget(targetElement, color) {
  targetElement.style.position = 'absolute';
  targetElement.style.width = targetSize + 'px';
  targetElement.style.height = targetSize + 'px';
  targetElement.style.borderRadius = '50%';
  targetElement.style.backgroundColor = color;
}

// Generate random position for any target
function generateRandomPosition() {
  var maxX = gameContainer.offsetWidth - targetSize;
  var maxY = gameContainer.offsetHeight - targetSize;

  return {
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY),
  };
}

// Move a target to a random position
function moveTarget(targetElement) {
  var position = generateRandomPosition();
  targetElement.style.left = position.x + 'px';
  targetElement.style.top = position.y + 'px';
}

// Create a temporary target (bonus or bomb)
function createTemporaryTarget(color, duration, onClick) {
  var tempTarget = document.createElement('div');
  initializeTarget(tempTarget, color);
  moveTarget(tempTarget);
  gameContainer.appendChild(tempTarget);

  // Add click event
  tempTarget.addEventListener('click', function () {
    onClick();
    tempTarget.remove();
  });

  // Remove after duration
  setTimeout(function () {
    if (tempTarget.parentNode) {
      tempTarget.remove();
    }
  }, duration);
}

// Create a bonus target (disappears after 2 seconds)
function createBonus() {
  createTemporaryTarget('blue', 2000, function () {
    score += 5;
    timeLeft += 5;
    updateUI();
  });
}

// Create a bomb target (stays for 3 seconds)
function createBomb() {
  createTemporaryTarget('red', 3000, function () {
    timeLeft = Math.max(0, timeLeft - 5); // Ensure timer doesn't go below 0
    score = Math.max(0, score - 5); // Ensure score doesn't go below 0
    updateUI();

    // End the game if score falls to 0
    if (score === 0) {
      endGame();
    }
  });
}

// Create the main target (gold, stays for 3 seconds)
function createNormalTarget() {
  createTemporaryTarget('gold', 3000, function () {
    score++; // Increment score when clicked
    timeLeft += 1; // Add 1 second for each click
    updateUI();
  });
}

// Handle normal target click
function handleNormalClick() {
  score++;
  timeLeft += 1; // Add 1 second for each click
  updateUI();
  //createNormalTarget();
}

// Update the score and timer display
function updateUI() {
  scoreDisplay.textContent = score;
  timerDisplay.textContent = Math.max(0, timeLeft); // Ensure timer doesn't display negative values
}

// Start the game timer
function startTimer() {
  timer = setInterval(function () {
    timeLeft--;
    updateUI();

    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }

    // Occasionally create bonus or bomb
    if (Math.random() < 0.15) createBonus(); // 15% chance for bonus
    if (Math.random() < 0.4) createBomb();  // 40% chance for bomb
    createNormalTarget(); // Always create a gold target
  }, 1000);
}

// End the game
function endGame() {
  clearInterval(timer);
  target.style.display = 'none';
  target.removeEventListener('click', handleNormalClick);
  alert('Game over! Your score is: ' + score);
}

// Restart the game
function restartGame() {
  score = 0;
  timeLeft = 30;
  updateUI();
  target.addEventListener('click', handleNormalClick);
  createNormalTarget();
  startTimer();
}

// Initialize the game
function initializeGame() {
  initializeTarget(target, 'gold');
  target.addEventListener('click', handleNormalClick);
  updateUI();
}

// Start the game setup
initializeGame();