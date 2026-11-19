
// Check whether placing a number is valid
function isSafe(board, row, col, num) {

    // Check row and column
    for (let i = 0; i < 9; i++) {

        if (board[row][i] === num) {
            return false;
        }

        if (board[i][col] === num) {
            return false;
        }
    }

    // Find starting position of 3x3 box
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;

    // Check 3x3 box
    for (let r = startRow; r < startRow + 3; r++) {

        for (let c = startCol; c < startCol + 3; c++) {

            if (board[r][c] === num) {
                return false;
            }
        }
    }

    return true;
}


// Find an empty cell
function findEmpty(board) {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (board[row][col] === 0) {
                return [row, col];
            }
        }
    }

    return null;
}


// Sudoku Backtracking Algorithm
function solveSudoku(board) {

    let empty = findEmpty(board);

    // No empty cells means solved
    if (empty === null) {
        return true;
    }

    let [row, col] = empty;

    // Try numbers from 1 to 9
    for (let num = 1; num <= 9; num++) {

        if (isSafe(board, row, col, num)) {

            // Place number
            board[row][col] = num;

            // Recursively solve remaining board
            if (solveSudoku(board)) {
                return true;
            }

            // Backtrack: undo the choice
            board[row][col] = 0;
        }
    }

    // No number worked
    return false;
}


// Check whether existing clues contain duplicates
function hasConflicts(board) {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            let num = board[row][col];

            if (num === 0) continue;

            board[row][col] = 0;

            let valid = isSafe(board, row, col, num);

            board[row][col] = num;

            if (!valid) {
                return true;
            }
        }
    }

    return false;
}

// Shuffle an array randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Generate a complete valid Sudoku board
function fillBoard(board) {
    const empty = findEmpty(board);

    if (!empty) return true;

    const [row, col] = empty;

    const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of numbers) {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;

            if (fillBoard(board)) return true;

            board[row][col] = 0;
        }
    }

    return false;
}

// Generate a new Sudoku puzzle
function generateSudoku(difficulty = "easy") {
    const board = Array.from(
        { length: 9 },
        () => Array(9).fill(0)
    );

    // First generate a complete solution
    fillBoard(board);

    // Number of cells to remove
    let cellsToRemove;

    if (difficulty === "easy") {
        cellsToRemove = 35;
    } else if (difficulty === "medium") {
        cellsToRemove = 45;
    } else {
        cellsToRemove = 52;
    }

    // Randomly remove numbers
    const positions = shuffleArray(
        Array.from({ length: 81 }, (_, i) => i)
    );

    for (let i = 0; i < cellsToRemove; i++) {
        const position = positions[i];

        const row = Math.floor(position / 9);
        const col = position % 9;

        board[row][col] = 0;
    }

    return board;
}
