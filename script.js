let symbols = ['★', '☂', '✿', '☯', '✈', '♫', '♛', '☾', '⚽', '⚡']; // Symbols for matching
let level = 1;
let cards = [];
let flippedCards = [];
let lockBoard = false;
let timer = 0;
let timerInterval;
let easyLevels = [2, 3, 4, 5]; // Pairs for easy levels
let intermediateLevels = [6, 7, 8, 9]; // Pairs for intermediate levels
let hardLevels = [10, 12]; // Pairs for hard levels

const gameContainer = document.querySelector('.game-container');
const timerDisplay = document.getElementById('timer');
const levelDisplay = document.getElementById('level');
const nextLevelBtn = document.getElementById('next-level');

startGame(level);

function startGame(level) {
  resetGame();
  cards = generateCardsForLevel(level);
  shuffleCards();
  createCards();
  startTimer();
  updateLevelDisplay();
}

function generateCardsForLevel(level) {
  let pairs;
  if (level <= 4) {
    pairs = easyLevels[level - 1];
  } else if (level <= 8) {
    pairs = intermediateLevels[level - 5];
  } else {
    pairs = hardLevels[level - 9];
  }

  const cardSet = [];
  for (let i = 0; i < pairs; i++) {
    cardSet.push(symbols[i]);
    cardSet.push(symbols[i]);
  }
  return cardSet;
}

function shuffleCards() {
  cards.sort(() => 0.5 - Math.random());
}

function createCards() {
  gameContainer.innerHTML = ''; // Clear previous cards
  cards.forEach((symbol) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerHTML = `
      <div class="front"></div>
      <div class="back">${symbol}</div>`;
    cardElement.addEventListener('click', flipCard);
    gameContainer.appendChild(cardElement);
  });
  adjustGrid();
}

function adjustGrid() {
  const columns = Math.sqrt(cards.length);
  gameContainer.style.gridTemplateColumns = `repeat(${Math.ceil(columns)}, 100px)`;
}

function flipCard() {
  if (lockBoard) return;
  if (this.classList.contains('flipped')) return;

  this.classList.add('flipped');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

function checkForMatch() {
  lockBoard = true;
  const [card1, card2] = flippedCards;

  if (card1.querySelector('.back').textContent === card2.querySelector('.back').textContent) {
    flippedCards = [];
    lockBoard = false;
    checkForWin();
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}

function checkForWin() {
  if (document.querySelectorAll('.flipped').length === cards.length) {
    clearInterval(timerInterval);
    nextLevelBtn.style.display = 'block';
  }
}

nextLevelBtn.addEventListener('click', () => {
  level++;
  if (level > 10) {
    alert("You've completed all levels!");
    nextLevelBtn.style.display = 'none';
    return;
  }
  nextLevelBtn.style.display = 'none';
  startGame(level);
});

function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = timer;
  }, 1000);
}

function resetGame() {
  gameContainer.innerHTML = '';
  clearInterval(timerInterval);
  timerDisplay.textContent = '0';
  flippedCards = [];
  lockBoard = false;
}

function updateLevelDisplay() {
  levelDisplay.textContent = level;
}
