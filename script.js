// JavaScript Code for Cetno-Licho Game

// DOM Element References
const gameBoard = document.getElementById('gameBoard'); // Container for the game cells
const gameStatus = document.getElementById('gameStatus'); // Displays current player or winner
const resetButton = document.getElementById('resetButton'); // Button to reset the game
const helpButton = document.getElementById('helpButton'); // Button to show help overlay
const overlay = document.getElementById('overlay'); // Help overlay
const closeHelp = document.getElementById('closeHelp'); // Button to close help overlay
const settingsButton = document.getElementById('settingsButton'); // Button to show settings overlay
const settingsOverlay = document.getElementById('settingsOverlay'); // Settings overlay
const closeSettings = document.getElementById('closeSettings'); // Button to close settings overlay

// Settings DOM Element References
const player2RadioButtons = Array.from(document.getElementsByName('player2Type')); // Radio buttons for Player 2 type (Human/Computer)
const difficultyRadioButtons = Array.from(document.getElementsByName('difficultyLevel')); // Radio buttons for AI difficulty
const neighborRadioButtons = Array.from(document.getElementsByName('neighborRequirement')); // Radio buttons for neighbor rule (Odd/Even)
const randomizeCheckbox = document.getElementById('randomizeCheckbox'); // Checkbox to randomize blocked cells

// Game State Variables
let board = []; // 2D array representing the game board state
let currentPlayer = 1; // Indicates the current player (1 or 2)
let moveNumber = 1; // Counter for the current move number
let lastMove = null; // Stores the {row, col} of the last move made; crucial for validating next moves
let gameActive = true; // Boolean flag to indicate if the game is ongoing or has ended
let isPlayer2Computer = false; // Boolean flag, true if Player 2 is AI
let difficulty = 'Easy'; // AI difficulty level: 'Easy' or 'Normal'
let neighborRequirement = 'odd'; // Rule for placing numbers: 'odd' or 'even' count of adjacent numbered cells
let useRandomBoard = false; // Boolean flag, true if blocked cells should be randomized on reset
let lastFocusedElement = null; // Stores the element that had focus before an overlay was opened

// Board Dimensions
const ROWS = 7; // Number of rows in the game board
const COLS = 6; // Number of columns in the game board

// Default Configuration for Blocked Cells
// These cells cannot be selected by players.
const defaultBlockedCells = [
    [0, 4], [0, 5],
    [6, 5],
    [6, 0], [6, 1], [5, 0]
];

// Active Configuration for Blocked Cells
// Initialized with default, can be changed by randomization.
let blockedCells = [...defaultBlockedCells];

/**
 * Initializes or resets the game to its starting state.
 * @param {boolean} [useDefaultBlockedCells=true] - If true, resets blocked cells to default; otherwise, uses current (potentially randomized) blockedCells.
 */
function initGame(useDefaultBlockedCells = true) {
    board = []; // Reset the internal board representation
    gameBoard.innerHTML = ''; // Clear the visual game board
    moveNumber = 1; // Reset move counter
    currentPlayer = 1; // Player 1 starts
    lastMove = null; // Reset last move
    gameActive = true; // Set game to active
    gameStatus.textContent = `Player ${currentPlayer}'s turn`; // Update status display
    gameStatus.setAttribute('aria-live', 'polite'); // Announce game status changes

    // Determine blocked cells configuration for this game instance
    if (useDefaultBlockedCells) {
        blockedCells = [...defaultBlockedCells]; // Use the predefined layout
    }

    isPlayer2Computer = document.querySelector('input[name="player2Type"]:checked').value === 'computer';
    updateDifficultyButtons();

    if (isPlayer2Computer) {
        difficulty = document.querySelector('input[name="difficultyLevel"]:checked').value;
        document.querySelector(`input[name="difficultyLevel"][value="${difficulty}"]`).checked = true;
    }
    
    createBoard(); 
    updateValidMoves(); 
}

/**
 * Creates the visual and logical representation of the game board.
 * Iterates through ROWS and COLS, creating a div for each cell.
 * Assigns data attributes, ARIA roles, and event listeners.
 */
function createBoard() {
    gameBoard.setAttribute('role', 'grid'); // ARIA role for the game board container
    gameBoard.setAttribute('aria-label', 'Cetno-Licho game board');

    for (let row = 0; row < ROWS; row++) {
        board[row] = []; 
        const rowElement = document.createElement('div'); // Create a row container if needed by ARIA grid structure
        rowElement.setAttribute('role', 'row');

        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.setAttribute('role', 'gridcell'); // ARIA role for individual cells
            cell.setAttribute('aria-label', `Cell R${row + 1}C${col + 1}, Empty`);

            if (isCellBlocked(row, col)) {
                cell.classList.add('blocked'); 
                board[row][col] = 'blocked'; 
                cell.setAttribute('aria-disabled', 'true');
                cell.setAttribute('aria-label', `Cell R${row + 1}C${col + 1}, Blocked`);
            } else {
                board[row][col] = null; 
                cell.setAttribute('tabindex', '0'); // Make non-blocked cells focusable
                cell.addEventListener('click', cellClicked); 
                // Add keyboard listener for Enter/Space to mimic click
                cell.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault(); // Prevent page scroll on Space
                        cellClicked(e);
                    }
                });
            }
            rowElement.appendChild(cell);
        }
        gameBoard.appendChild(rowElement);
    }
}

/**
 * Checks if a cell at the given coordinates is a blocked cell.
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 * @returns {boolean} True if the cell is blocked, false otherwise.
 */
function isCellBlocked(row, col) {
    return blockedCells.some(coord => coord[0] === row && coord[1] === col);
}

/**
 * Handles a click or keyboard activation event on a game cell.
 */
function cellClicked(e) {
    if (!gameActive) return; 

    // For keyboard events, target might be different, ensure we get the cell div
    const targetCell = e.target.closest('.cell');
    if (!targetCell) return;

    const row = parseInt(targetCell.dataset.row); 
    const col = parseInt(targetCell.dataset.col); 

    if (isValidMove(row, col)) { 
        makeMove(row, col); 

        if (gameActive) { 
            switchPlayer(); 
            updateValidMoves(); 

            if (currentPlayer === 2 && isPlayer2Computer) {
                setTimeout(computerMove, 500); 
            }
        }
    }
}

/**
 * Executes a player's move on the board.
 */
function makeMove(row, col) {
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    cell.classList.remove('valid'); 
    cell.removeAttribute('tabindex'); // No longer focusable after move
    cell.removeEventListener('click', cellClicked); 
    cell.removeEventListener('keydown', cellClicked); // Assuming keydown listener was added

    const numberElement = document.createElement('div');
    numberElement.classList.add('number');
    numberElement.textContent = moveNumber;
    cell.appendChild(numberElement);

    cell.classList.add(currentPlayer === 1 ? 'player1' : 'player2');
    cell.setAttribute('aria-label', `Cell R${row + 1}C${col + 1}, Player ${currentPlayer}, Number ${moveNumber}`);
    cell.setAttribute('aria-disabled', 'true'); // Mark as disabled after move

    board[row][col] = {
        player: currentPlayer,
        number: moveNumber
    };

    lastMove = { row, col }; 
    moveNumber++; 
}

/**
 * Switches the current player.
 */
function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1; 
    gameStatus.textContent = `Player ${currentPlayer}'s turn`; 
}

/**
 * Updates the visual and accessible state of the game board cells.
 */
function updateValidMoves() {
    const cells = document.querySelectorAll('.cell');
    let hasValidMoves = false; 

    cells.forEach(cell => {
        // Skip if the cell is part of the board structure but not a gridcell (e.g. row containers)
        if (!cell.hasAttribute('data-row')) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        cell.classList.remove('valid');
        // Only non-blocked, non-occupied cells can become valid
        if (board[row][col] === null && !isCellBlocked(row,col)) { 
            if (isValidMove(row, col)) {
                cell.classList.add('valid');
                cell.setAttribute('tabindex', '0'); // Make valid moves focusable
                cell.setAttribute('aria-disabled', 'false'); 
                cell.setAttribute('aria-label', `Cell R${row + 1}C${col + 1}, Empty, Valid move`);
                hasValidMoves = true; 
            } else {
                // Not a valid move, ensure it's not focusable unless it's the first cell for initial focus
                // cell.removeAttribute('tabindex'); // Revisit: might remove focus from board entirely
                cell.setAttribute('aria-disabled', 'true');
                if (!cell.querySelector('.number')) { // Keep label if empty but not valid
                     cell.setAttribute('aria-label', `Cell R${row + 1}C${col + 1}, Empty`);
                }
            }
        } else if (board[row][col] !== 'blocked' && !cell.querySelector('.number')) {
            // Catch any other empty cells that weren't explicitly set up
             cell.setAttribute('aria-label', `Cell R${row + 1}C${col + 1}, Empty`);
        }
    });

    if (!hasValidMoves && gameActive) { // Added gameActive check to prevent multiple win announcements
        gameActive = false; 
        const winner = currentPlayer === 1 ? 2 : 1;
        gameStatus.innerHTML = `<div id="winnerMessage">PLAYER ${winner} WINS!</div>`;
        gameStatus.setAttribute('aria-live', 'assertive'); // Announce winner assertively
        // Optional: Remove tabindex from all cells or focus a reset button
        cells.forEach(cell => cell.removeAttribute('tabindex'));
    }
}

/**
 * Checks if a move at the given (row, col) is valid for the current game state.
 * @param {number} row - The row index of the potential move.
 * @param {number} col - The column index of the potential move.
 * @returns {boolean} True if the move is valid, false otherwise.
 */
function isValidMove(row, col) {
    if (board[row][col] !== null) return false;
    if (lastMove === null && moveNumber === 1) return true;
    if (moveNumber === 2 && isAdjacent(row, col, lastMove.row, lastMove.col)) {
        return true;
    }
    if (!isAdjacent(row, col, lastMove.row, lastMove.col)) return false;

    const neighbors = getNeighbors(row, col);
    const numberedNeighbors = neighbors.filter(n => {
        const cellValue = board[n.row][n.col];
        return cellValue !== null && cellValue !== 'blocked';
    });

    if (neighborRequirement === 'odd' && numberedNeighbors.length % 2 !== 1) return false;
    if (neighborRequirement === 'even' && numberedNeighbors.length % 2 !== 0) return false;

    return true;
}

/**
 * Checks if two cells, defined by their coordinates, are adjacent.
 */
function isAdjacent(row1, col1, row2, col2) {
    return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
}

/**
 * Gets all valid neighboring cells for a given cell.
 */
function getNeighbors(row, col) {
    const neighbors = [];
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                if (!(r === row && c === col)) {
                    neighbors.push({ row: r, col: c });
                }
            }
        }
    }
    return neighbors;
}

/**
 * Determines and executes the computer's move based on the selected difficulty.
 */
function computerMove() {
    if (difficulty === 'Easy') {
        computerMoveEasy();
    } else { 
        computerMoveNormal();
    }
}

/**
 * Makes a random valid move for the computer (Easy difficulty).
 */
function computerMoveEasy() {
    const validMoves = [];
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (isValidMove(row, col)) {
                validMoves.push({ row, col });
            }
        }
    }

    if (validMoves.length > 0) {
        const move = validMoves[Math.floor(Math.random() * validMoves.length)];
        makeMove(move.row, move.col); 
        if (gameActive) { 
            switchPlayer(); 
            updateValidMoves(); 
        }
    }
}

/**
 * Makes a more strategic move for the computer (Normal difficulty).
 */
function computerMoveNormal() {
    const validMoves = [];
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (isValidMove(row, col)) {
                validMoves.push({ row, col });
            }
        }
    }

    if (validMoves.length === 0) return; 

    for (let move of validMoves) {
        const boardClone = JSON.parse(JSON.stringify(board)); 
        boardClone[move.row][move.col] = { player: 2, number: moveNumber }; 
        const lastMoveClone = { row: move.row, col: move.col };
        const moveNumberClone = moveNumber + 1; 

        const opponentValidMoves = getAllValidMoves(1, lastMoveClone, boardClone, moveNumberClone);
        if (opponentValidMoves.length === 0) {
            makeMove(move.row, move.col);
            if (gameActive) { 
                switchPlayer();
                updateValidMoves();
            }
            return; 
        }
    }

    let bestNonLosingMove = null;
    for (let move of validMoves) {
        const boardClone = JSON.parse(JSON.stringify(board));
        boardClone[move.row][move.col] = { player: 2, number: moveNumber };
        const lastMoveClone = { row: move.row, col: move.col };
        const moveNumberClone = moveNumber + 1; 
        const opponentResponses = getAllValidMoves(1, lastMoveClone, boardClone, moveNumberClone);

        if (opponentResponses.length === 0) {
            makeMove(move.row, move.col);
            if (gameActive) {
                switchPlayer();
                updateValidMoves();
            }
            return;
        }
        let isSafeMove = true; 
        for (let opponentMove of opponentResponses) {
            const boardClone2 = JSON.parse(JSON.stringify(boardClone));
            boardClone2[opponentMove.row][opponentMove.col] = { player: 1, number: moveNumberClone };
            const lastMoveClone2 = { row: opponentMove.row, col: opponentMove.col };
            const moveNumberClone2 = moveNumberClone + 1; 
            const aiNextMoves = getAllValidMoves(2, lastMoveClone2, boardClone2, moveNumberClone2);
            if (aiNextMoves.length === 0) {
                isSafeMove = false; 
                break; 
            }
        }
        if (isSafeMove) {
            bestNonLosingMove = move; 
            break; 
        }
    }

    if (bestNonLosingMove) {
        makeMove(bestNonLosingMove.row, bestNonLosingMove.col);
        if (gameActive) {
            switchPlayer();
            updateValidMoves();
        }
        return;
    }
    computerMoveEasy();
}

/**
 * Gets all valid moves for a specified player given a simulated board state.
 */
function getAllValidMoves(player, lastMoveParam, boardParam, moveNumberParam) {
    const validMoves = [];
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (boardParam[row][col] === null && isValidMoveSimulation(row, col, player, lastMoveParam, boardParam, moveNumberParam)) {
                validMoves.push({ row, col });
            }
        }
    }
    return validMoves;
}

/**
 * Checks if a move is valid in a simulated board state.
 */
function isValidMoveSimulation(row, col, player, lastMoveSim, boardSim, moveNumberSim) {
    if (boardSim[row][col] !== null) return false;
    if (lastMoveSim === null && moveNumberSim === 1) return true;
    if (lastMoveSim === null && moveNumberSim > 1) return false;
    if (moveNumberSim === 2 && isAdjacent(row, col, lastMoveSim.row, lastMoveSim.col)) {
        return true;
    }
    if (!isAdjacent(row, col, lastMoveSim.row, lastMoveSim.col)) return false;
    const neighbors = getNeighbors(row, col);
    const numberedNeighbors = neighbors.filter(n => {
        const cellValue = boardSim[n.row][n.col];
        return cellValue !== null && cellValue !== 'blocked';
    });
    if (neighborRequirement === 'odd' && numberedNeighbors.length % 2 !== 1) return false;
    if (neighborRequirement === 'even' && numberedNeighbors.length % 2 !== 0) return false;
    return true;
}

/**
 * Generates a new set of 6 randomly selected blocked cells along the border of the game board.
 */
function generateRandomBlockedCells() {
    const borderCells = []; 
    for (let col = 0; col < COLS; col++) {
        borderCells.push([0, col]); 
        borderCells.push([ROWS - 1, col]); 
    }
    for (let row = 1; row < ROWS - 1; row++) {
        borderCells.push([row, 0]); 
        borderCells.push([row, COLS - 1]); 
    }
    const shuffled = borderCells.sort(() => 0.5 - Math.random());
    blockedCells = shuffled.slice(0, 6);
}

/**
 * Applies the current settings and resets the game.
 */
function applySettings() {
    isPlayer2Computer = document.querySelector('input[name="player2Type"]:checked').value === 'computer';
    difficulty = document.querySelector('input[name="difficultyLevel"]:checked').value;
    neighborRequirement = document.querySelector('input[name="neighborRequirement"]:checked').value;
    useRandomBoard = randomizeCheckbox.checked;
    resetGameWithNewSettings(); 
}

/**
 * Resets the game, potentially with a new randomized board.
 */
function resetGameWithNewSettings() {
    if (useRandomBoard) {
        generateRandomBlockedCells(); 
        initGame(false); 
    } else {
        initGame(true); 
    }
}

/**
 * Updates the enabled/disabled state of difficulty radio buttons.
 */
function updateDifficultyButtons() {
    difficultyRadioButtons.forEach(radio => {
        radio.disabled = !isPlayer2Computer; 
        if (!isPlayer2Computer) {
            radio.parentElement.style.opacity = '0.5'; 
        } else {
            radio.parentElement.style.opacity = '1'; 
        }
    });
}

// --- Event Listeners ---
player2RadioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
        isPlayer2Computer = radio.value === 'computer';
        if (isPlayer2Computer) {
            difficulty = document.querySelector('input[name="difficultyLevel"]:checked').value;
        }
        updateDifficultyButtons(); 
    });
});

difficultyRadioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
        difficulty = radio.value; 
    });
});

neighborRadioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
        neighborRequirement = radio.value; 
        if (gameActive) { 
            updateValidMoves();
        }
    });
});

resetButton.addEventListener('click', () => {
    resetGameWithNewSettings();
});

helpButton.addEventListener('click', () => {
    lastFocusedElement = document.activeElement; // Store focus
    settingsOverlay.classList.add('hidden'); 
    overlay.classList.remove('hidden'); 
    closeHelp.focus(); // Set focus to close button in help overlay
});

closeHelp.addEventListener('click', () => {
    overlay.classList.add('hidden'); 
    if (lastFocusedElement) {
        lastFocusedElement.focus(); // Restore focus
    }
});

settingsButton.addEventListener('click', () => {
    lastFocusedElement = document.activeElement; // Store focus
    overlay.classList.add('hidden'); 
    settingsOverlay.classList.remove('hidden'); 
    closeSettings.focus(); // Set focus to close button in settings overlay
});

closeSettings.addEventListener('click', () => {
    settingsOverlay.classList.add('hidden'); 
    applySettings(); 
    if (lastFocusedElement) {
        lastFocusedElement.focus(); // Restore focus
    }
});

randomizeCheckbox.addEventListener('change', () => {
    useRandomBoard = randomizeCheckbox.checked; 
});

// --- Initial Game Start ---
initGame();
// Set initial focus to the first interactive element, e.g., the game board or reset button
if (gameBoard.querySelector('[tabindex="0"]')) {
    gameBoard.querySelector('[tabindex="0"]').focus();
} else {
    resetButton.focus();
}
