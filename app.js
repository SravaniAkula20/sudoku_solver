
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const difficultyElement = document.getElementById("difficulty");

const examplePuzzle = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
];

let originalClues = Array.from(
    { length: 9 },
    () => Array(9).fill(false)
);


// Display status messages
function setStatus(message, type = "") {
    statusElement.textContent = message;
    statusElement.className = type;
}


// Create 9x9 input grid
function createBoard() {

    boardElement.innerHTML = "";

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const input = document.createElement("input");

            input.className = "cell";
            input.type = "text";
            input.inputMode = "numeric";
            input.maxLength = 1;

            input.dataset.row = row;
            input.dataset.col = col;

            input.addEventListener("input", function () {

                input.value = input.value
                    .replace(/[^1-9]/g, "")
                    .slice(0, 1);

                input.classList.remove("invalid", "solved");

                originalClues[row][col] = input.value !== "";

                setStatus("Puzzle changed.");
            });

            boardElement.appendChild(input);
        }
    }
}


// Read values from HTML grid
function readBoard() {

    let board = Array.from(
        { length: 9 },
        () => Array(9).fill(0)
    );

    document.querySelectorAll(".cell").forEach(input => {

        let row = Number(input.dataset.row);
        let col = Number(input.dataset.col);

        if (input.value !== "") {
            board[row][col] = Number(input.value);
        }
    });

    return board;
}


// Display board on screen
function displayBoard(board, solved = false) {

    document.querySelectorAll(".cell").forEach(input => {

        let row = Number(input.dataset.row);
        let col = Number(input.dataset.col);

        input.value = board[row][col] || "";

        input.readOnly = solved && !originalClues[row][col];

        input.classList.toggle("given", originalClues[row][col]);

        input.classList.toggle(
            "solved",
            solved && !originalClues[row][col] && board[row][col] !== 0
        );

        input.classList.remove("invalid");
    });
}


// Highlight conflicting entries
function highlightConflicts(board) {

    let conflict = false;

    document.querySelectorAll(".cell").forEach(input => {
        input.classList.remove("invalid");
    });

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            let num = board[row][col];

            if (num === 0) continue;

            board[row][col] = 0;

            let valid = isSafe(board, row, col, num);

            board[row][col] = num;

            if (!valid) {

                conflict = true;

                document.querySelector(
                    `[data-row="${row}"][data-col="${col}"]`
                ).classList.add("invalid");
            }
        }
    }

    return conflict;
}


// Solve Sudoku
function solve() {

    let board = readBoard();

    if (highlightConflicts(board)) {
        setStatus(
            "Duplicate numbers found. Check highlighted cells.",
            "error"
        );
        return;
    }

    let solution = board.map(row => [...row]);

    if (!solveSudoku(solution)) {

        setStatus(
            "This Sudoku puzzle has no solution.",
            "error"
        );

        return;
    }

    displayBoard(solution, true);

    setStatus(
        "Sudoku solved successfully using Backtracking!",
        "success"
    );
}


// Check user entries
function checkEntries() {

    let board = readBoard();

    if (highlightConflicts(board)) {

        setStatus("Conflicting entries found.", "error");

    } else {

        setStatus(
            "No duplicate entries found.",
            "success"
        );
    }
}


// Load example puzzle
function loadExample() {

    originalClues = examplePuzzle.map(
        row => row.map(value => value !== 0)
    );

    displayBoard(examplePuzzle);

    document.querySelectorAll(".cell").forEach(input => {
        input.readOnly = false;
    });

    setStatus("Example puzzle loaded. Click Solve Sudoku.");
}


// Generate a new Sudoku puzzle
function generateNewPuzzle() {

    const difficulty = difficultyElement.value;

    // Generate a fresh puzzle using solver.js
    const newPuzzle = generateSudoku(difficulty);

    // Remember which cells contain original clues
    originalClues = newPuzzle.map(
        row => row.map(value => value !== 0)
    );

    // Display the new puzzle
    displayBoard(newPuzzle);

    // Make all cells editable
    document.querySelectorAll(".cell").forEach(input => {
        input.readOnly = false;
    });

    setStatus(
        `New ${difficulty} Sudoku puzzle generated!`,
        "success"
    );
}


// Clear all cells
function clearBoard() {

    originalClues = Array.from(
        { length: 9 },
        () => Array(9).fill(false)
    );

    document.querySelectorAll(".cell").forEach(input => {

        input.value = "";
        input.readOnly = false;

        input.classList.remove(
            "given",
            "solved",
            "invalid"
        );
    });

    setStatus("Board cleared.");
}


// Button events
document.getElementById("solve").addEventListener("click", solve);

document.getElementById("check").addEventListener(
    "click",
    checkEntries
);

document.getElementById("example").addEventListener(
    "click",
    loadExample
);

document.getElementById("clear").addEventListener(
    "click",
    clearBoard
);

document.getElementById("generateBtn").addEventListener(
    "click",
    generateNewPuzzle
);


// Start application
createBoard();
loadExample();
