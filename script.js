const board = document.getElementById('sudoku-board');
const numberPad = document.getElementById('number-pad');
const newGameBtn = document.getElementById('new-game-btn');
const solveBtn = document.getElementById('solve-btn');
const checkBtn = document.getElementById('check-btn');
const hintBtn = document.getElementById('hint-btn');
const difficultySelect = document.getElementById('difficulty-select');
const timerDisplay = document.getElementById('timer');
const mistakeCount = document.getElementById('mistake-count');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalClose = document.getElementById('modal-close');

let sudokuGrid = Array(9).fill().map(() => Array(9).fill(0));
let solution = Array(9).fill().map(() => Array(9).fill(0));
let selectedCell = null;
let mistakes = 0;
let timerInterval = null;
let seconds = 0;

function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => selectCell(cell));
            board.appendChild(cell);
        }
    }
}

function createNumberPad() {
    for (let i = 1; i <= 9; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'number-btn';
        button.addEventListener('click', () => fillCell(i));
        numberPad.appendChild(button);
    }
}

function selectCell(cell) {
    if (selectedCell) {
        selectedCell.classList.remove('selected');
    }
    selectedCell = cell;
    cell.classList.add('selected');
}

function fillCell(number) {
    if (selectedCell && !selectedCell.classList.contains('given')) {
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);
        sudokuGrid[row][col] = number;
        selectedCell.textContent = number;
        selectedCell.classList.remove('incorrect');
        if (number === solution[row][col]) {
            selectedCell.classList.add('correct');
        } else {
            selectedCell.classList.add('incorrect');
            mistakes++;
            mistakeCount.textContent = mistakes;
            if (mistakes >= 3) {
                endGame('Game Over', 'You made too many mistakes. Try again!');
            }
        }
        checkWin();
    }
}

function generatePuzzle(difficulty) {
    // This is a simplified puzzle generation.
    // In a real implementation, you'd use a more sophisticated algorithm.
    solution = [
        [5,3,4,6,7,8,9,1,2],
        [6,7,2,1,9,5,3,4,8],
        [1,9,8,3,4,2,5,6,7],
        [8,5,9,7,6,1,4,2,3],
        [4,2,6,8,5,3,7,9,1],
        [7,1,3,9,2,4,8,5,6],
        [9,6,1,5,3,7,2,8,4],
        [2,8,7,4,1,9,6,3,5],
        [3,4,5,2,8,6,1,7,9]
    ];
    
    sudokuGrid = JSON.parse(JSON.stringify(solution));
    
    let cellsToRemove;
    switch(difficulty) {
        case 'easy':
            cellsToRemove = 30;
            break;
        case 'medium':
            cellsToRemove = 40;
            break;
        case 'hard':
            cellsToRemove = 50;
            break;
    }
    
    while (cellsToRemove > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (sudokuGrid[row][col] !== 0) {
            sudokuGrid[row][col] = 0;
            cellsToRemove--;
        }
    }
}

function updateBoard() {
    const cells = board.getElementsByClassName('cell');
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = cells[i * 9 + j];
            cell.textContent = sudokuGrid[i][j] || '';
            cell.className = 'cell';
            if (sudokuGrid[i][j] !== 0) {
                cell.classList.add('given');
            }
        }
    }
}

function solveSudoku() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (sudokuGrid[i][j] === 0) {
                sudokuGrid[i][j] = solution[i][j];
            }
        }
    }
    updateBoard();
    endGame('Puzzle Solved', 'The puzzle has been solved for you!');
}

function checkWin() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (sudokuGrid[i][j] !== solution[i][j]) {
                return;
            }
        }
    }
    endGame('Congratulations!', 'You solved the puzzle!');
}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function endGame(title, message) {
    clearInterval(timerInterval);
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

function newGame() {
    const difficulty = difficultySelect.value;
    generatePuzzle(difficulty);
    updateBoard();
    mistakes = 0;
    mistakeCount.textContent = mistakes;
    startTimer();
}

function provideHint() {
    if (selectedCell && selectedCell.textContent === '') {
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);
        selectedCell.textContent = solution[row][col];
        sudokuGrid[row][col] = solution[row][col];
        selectedCell.classList.add('given');
    }
}

newGameBtn.addEventListener('click', newGame);
solveBtn.addEventListener('click', solveSudoku);
checkBtn.addEventListener('click', checkWin);
hintBtn.addEventListener('click', provideHint);
modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

createBoard();
createNumberPad();
newGame();