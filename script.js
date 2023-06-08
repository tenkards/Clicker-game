var score = 0;
var target = document.getElementById('target');
var scoreDisplay = document.getElementById('score');

// Generate random position for the target
function generateRandomPosition() {
  var containerWidth = document.getElementById('game-container').offsetWidth;
  var containerHeight = document.getElementById('game-container').offsetHeight;

  var targetWidth = target.offsetWidth;
  var targetHeight = target.offsetHeight;

  var maxX = containerWidth - targetWidth;
  var maxY = containerHeight - targetHeight;

  var randomX = Math.floor(Math.random() * maxX);
  var randomY = Math.floor(Math.random() * maxY);

  return { x: randomX, y: randomY };
}

// Move the target to a random position
function moveTarget() {
  var position = generateRandomPosition();
  target.style.left = position.x + 'px';
  target.style.top = position.y + 'px';
}

// Increment score when the target is clicked
function handleClick() {
  score++;
  scoreDisplay.textContent = score;
  moveTarget();
}

// Add event listener to the target
target.addEventListener('click', handleClick);

// Start the game by moving the target
moveTarget();
