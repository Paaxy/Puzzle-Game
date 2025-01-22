// Constants and initial setup
const gridSize = 4;
let board = [];
let gameOver = false;

// Initialize game
function initGame() {
    board = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    spawnTile();
    spawnTile();
    renderBoard();
}

// Render the board
function renderBoard() {
    const boardContainer = document.getElementById('gameBoard');
    boardContainer.innerHTML = ''; // Clear the board

    // Create grid and tiles
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const tileValue = board[row][col];
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (tileValue !== 0) {
                tile.textContent = tileValue;
                tile.classList.add(`tile-${tileValue}`);
            }
            boardContainer.appendChild(tile);
        }
    }
}

// Move and combine tiles based on direction (left, right, up, down)
function move(direction) {
    if (gameOver) return;

    let moved = false;
    if (direction === 'left') moved = slideLeft();
    if (direction === 'right') moved = slideRight();
    if (direction === 'up') moved = slideUp();
    if (direction === 'down') moved = slideDown();

    if (moved) {
        spawnTile();
        renderBoard();
        if (checkWin()) {
            setTimeout(() => alert('You win!'), 100);
        } else if (isBoardFull()) {
            if (checkGameOver()) {
                setTimeout(() => alert('Game Over!'), 100);
            }
        }
    }
}

// Slide tiles to the left
function slideLeft() {
    let moved = false;
    for (let row = 0; row < gridSize; row++) {
        const originalRow = board[row].slice();
        const filtered = board[row].filter(value => value !== 0);
        const merged = merge(filtered);
        board[row] = [...merged, ...Array(gridSize - merged.length).fill(0)];
        if (originalRow.join('') !== board[row].join('')) moved = true;
    }
    return moved;
}

// Slide tiles to the right
function slideRight() {
    for (let row = 0; row < gridSize; row++) {
        board[row] = board[row].reverse();
    }
    const moved = slideLeft();
    for (let row = 0; row < gridSize; row++) {
        board[row] = board[row].reverse();
    }
    return moved;
}

// Slide tiles upwards
function slideUp() {
    board = transpose(board);
    const moved = slideLeft();
    board = transpose(board);
    return moved;
}

// Slide tiles downwards
function slideDown() {
    board = transpose(board);
    const moved = slideRight();
    board = transpose(board);
    return moved;
}

// Helper function to transpose the grid (for up and down sliding)
function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

// Merge tiles during a slide
function merge(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            arr[i + 1] = 0;
        }
    }
    return arr.filter(value => value !== 0);
}

// Spawn a new tile (2 or 4) in a random empty spot
function spawnTile() {
    const emptyCells = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === 0) {
                emptyCells.push([row, col]);
            }
        }
    }

    if (emptyCells.length === 0) return;

    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[row][col] = Math.random() < 0.9 ? 2 : 4;
}

// Check if the player has won (2048 tile)
function checkWin() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === 2048) {
                return true;
            }
        }
    }
    return false;
}

// Check if the game is over
function checkGameOver() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === 0) return false;
            if (row < gridSize - 1 && board[row][col] === board[row + 1][col]) return false;
            if (col < gridSize - 1 && board[row][col] === board[row][col + 1]) return false;
        }
    }
    return true;
}

// Check if the board is full (no empty spots)
function isBoardFull() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === 0) return false;
        }
    }
    return true;
}

// Event listeners for keyboard controls
document.addEventListener('keydown', (event) => {
    if (gameOver) return;
    if (event.key === 'ArrowLeft') move('left');
    if (event.key === 'ArrowRight') move('right');
    if (event.key === 'ArrowUp') move('up');
    if (event.key === 'ArrowDown') move('down');
});

// Initialize the game
initGame();
