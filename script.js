// Game variables
var score = 0;
var timeLeft = 30; // Game duration in seconds
var timer;
var targetSize = 50; // Width and height in pixels
var gameContainer = document.getElementById('game-container');
var lives = 3; 

// DOM elements
var target = document.getElementById('target');
var scoreDisplay = document.getElementById('score');
var timerDisplay = document.getElementById('timer');
var livesDisplay = document.getElementById('lives');

// Button elements
var startButton = document.getElementById('start-button');
var endButton = document.getElementById('end-button');

// Attach event listeners to buttons
startButton.addEventListener('click', startGame);
endButton.addEventListener('click', endGame);

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
  // Add duration
  var duration = score >= 130 ? 700 : score >= 100 ? 900 : score >= 75 ? 1200 : score >= 50 ? 1500 : 2000;
  createTemporaryTarget('grey', duration, function () {
    score += 5;
    timeLeft += 5;
    updateUI();
  });
}

// Create a bomb target (stays for 4 seconds)
function createBomb() {
  createTemporaryTarget('red', 4000, function () {
    lives--;
    score = Math.max(0, score - 5); // Decrease score by 5
    updateUI();

    // End the game if lives reach 0 or score falls to 0
    if (lives === 0 || score === 0) {
      endGame();
    }
  });
}

// Create the main target (black, duration depends on score)
function createNormalTarget() {
  // Adjust duration based on score
  var duration = score >= 130 ? 1000 : score >= 100 ? 1500 : score >= 75 ? 2000 : score >= 50 ? 2500 : 3000;
  createTemporaryTarget('black', duration, function () {
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
}

// Update the score, timer, and lives display
function updateUI() {
  scoreDisplay.textContent = score;
  timerDisplay.textContent = Math.max(0, timeLeft); // Ensure timer doesn't display negative values
  livesDisplay.textContent = lives; // Update lives display
}

// Create a unicorn target (gold, shoooort time)
function createUnicorn() {
  createTemporaryTarget('purple', 500, function () {
    timeLeft += 25; // Add 25 seconds to the timer
    updateUI();
  });
}

// Start the game timer
function startTimer() {
  var interval = 1000; // Default interval for the game loop
  timer = setInterval(function () {
    timeLeft--;
    updateUI();

    // Adjust difficulty based on score
    if (score >= 130) {
      clearInterval(timer); // Clear the current timer
      interval = 100; // Decrease the interval to make the game even faster
      startTimer(); // Restart the timer with the new interval
    } else if (score >= 100) {
      clearInterval(timer); // Clear the current timer
      interval = 300; // Decrease the interval to make the game even faster
      startTimer(); // Restart the timer with the new interval
    } else if (score >= 75) {
      clearInterval(timer); // Clear the current timer
      interval = 500; // Decrease the interval to make the game faster
      startTimer(); // Restart the timer with the new interval
    } else if (score >= 50) {
      clearInterval(timer); // Clear the current timer
      interval = 700; // Decrease the interval to make the game faster
      startTimer(); // Restart the timer with the new interval
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }

    // Occasionally create bonus, bomb, or unicorn
    if (Math.random() < (score >= 130 ? 0.08 : score >= 100 ? 0.05 : score >= 75 ? 0.10 : score >= 50 ? 0.15 : 0.15)) createBonus(); // Reduce bonus rate by 5% for each tier
    if (Math.random() < (score >= 130 ? 0.9 : score >= 100 ? 0.9 : score >= 75 ? 0.8 : score >= 50 ? 0.6 : 0.4)) createBomb();
    if (score >= 130 && Math.random() < 0.03) createUnicorn(); // Spawn unicorn with a 5% chance when score is 130+

    // Spawn normal target with reduced probability based on score
    if (Math.random() < (score >= 130 ? 0.7 : score >= 100 ? 0.45 : score >= 75 ? 0.60 : score >= 50 ? 0.75 : 1.0)) {
      createNormalTarget(); // Spawn black target
    }
  }, interval);
}
// Start the game
function startGame() {
  // Clear all existing targets and reset variables
  clearInterval(timer);
  gameContainer.innerHTML = ''; // Remove all targets
  score = 0;
  timeLeft = 30;
  lives = 3; // Reset lives to 3
  updateUI();

  // Initialize the main target
  initializeTarget(target, 'gold');
  target.addEventListener('click', handleNormalClick);

  // Start the game
  createNormalTarget();
  startTimer();
}

// End the game
function endGame() {
  clearInterval(timer);
  gameContainer.innerHTML = ''; // Remove all targets
  target.removeEventListener('click', handleNormalClick);
  alert(`Game over! Your score is: ${score}. Bomb Lives remaining: ${lives}`);
}