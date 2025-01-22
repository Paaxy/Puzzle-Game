// Puzzle game logic
const puzzleElement = document.getElementById('puzzle');
const winMessage = document.getElementById('winMessage');
const gridSize = 4; // 4x4 grid
let puzzleArray = [];
let emptyTileIndex = 15; // Starting with the last tile being empty

// Function to create the puzzle pieces
function createPuzzle() {
    puzzleArray = [];
    let imagePosition = 0;
    // Create the puzzle pieces
    for (let i = 0; i < gridSize * gridSize; i++) {
        if (i === emptyTileIndex) {
            puzzleArray.push(null); // Empty tile
        } else {
            puzzleArray.push(imagePosition);
            imagePosition++;
        }
    }

    shufflePuzzle();
    renderPuzzle();
}

// Function to shuffle the puzzle pieces
function shufflePuzzle() {
    for (let i = puzzleArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [puzzleArray[i], puzzleArray[j]] = [puzzleArray[j], puzzleArray[i]];
    }
}

// Function to render the puzzle on the screen
function renderPuzzle() {
    puzzleElement.innerHTML = '';

    const tileSize = puzzleElement.offsetWidth / gridSize; // Dynamically set tile size based on puzzle container width

    for (let i = 0; i < puzzleArray.length; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');

        piece.style.width = `${tileSize - 2}px`;  // Adjust width and height based on puzzle size
        piece.style.height = `${tileSize - 2}px`;

        if (puzzleArray[i] !== null) {
            const row = Math.floor(puzzleArray[i] / gridSize);
            const col = puzzleArray[i] % gridSize;
            piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
        } else {
            piece.classList.add('empty');
        }

        piece.setAttribute('data-index', i);
        piece.addEventListener('click', handleTileClick); // For desktop
        piece.addEventListener('touchstart', handleTileClick, { passive: true }); // For mobile
        puzzleElement.appendChild(piece);
    }

    checkWinCondition();
}

// Function to handle tile click event
function handleTileClick(event) {
    event.preventDefault(); // Prevents double triggering on touch events

    const clickedTileIndex = parseInt(event.target.getAttribute('data-index'));

    const emptyRow = Math.floor(emptyTileIndex / gridSize);
    const emptyCol = emptyTileIndex % gridSize;

    const clickedRow = Math.floor(clickedTileIndex / gridSize);
    const clickedCol = clickedTileIndex % gridSize;

    const isAdjacent =
        (Math.abs(emptyRow - clickedRow) === 1 && emptyCol === clickedCol) ||
        (Math.abs(emptyCol - clickedCol) === 1 && emptyRow === clickedRow);

    if (isAdjacent) {
        // Swap tiles
        puzzleArray[emptyTileIndex] = puzzleArray[clickedTileIndex];
        puzzleArray[clickedTileIndex] = null;

        emptyTileIndex = clickedTileIndex;
        renderPuzzle();
    }
}

// Function to check if the puzzle is solved
function checkWinCondition() {
    if (puzzleArray.every((val, index) => val === index || val === null)) {
        winMessage.style.display = 'block';
    }
}

// Initialize the puzzle
createPuzzle();
