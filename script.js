/* The modules implementing the core logic of the game */

const Player = () => {
    let name;
    let mark;
    let move;

    //let isAi = false;
    let score = 0;

    const getName = () => name;

    const setName = newName => name = newName;

    const getMark = () => mark;

    const setMark = newMark => mark = newMark;

    const getMove = () => move;

    const setMove = newMove => move = newMove;

    //const checkAi = () => isAi;

    //const toggleAi = () => isAi = isAi ? false : true;

    const getScore = () => score;

    const incrementScore = () => ++score;

    const resetPlayer = () => {
        name = '';
        mark = '';
        score = 0;
        //isAi = false;
    }

    return { getName, setName, getMark, setMark, getMove, setMove, getScore, incrementScore, resetPlayer };

};

const Board = (() => {
    let rows = 3;
    let columns = 3;
    let board = [];
    let matchingPattern = [];
    
    // To create a board for games other than tic-tac-toe
    const createBoard = () => {
        board = Array.from(Array(rows), () => Array(columns).fill(null));
        return board;
    }
    
    // To prevent mutation of the original board
    const cloneBoard = (board) => {
        return board.map(row => [...row]);
    }
    
    // To check availabe squares
    const isEmpty = (board) => {
        for (let row = 0; row < board.length; row++) {
            for (let column = 0; column < board[row].length; column++) {
                if (board[row][column] === null) {
                    return true;
                }
            }
        }
        return false;
    }
    
    // This should not be here. It's preventing the program from running the playRound
    // function if the board is already occupied. The makeMove function only prevents
    // placing the mark on a non-empty square. Without this the turn keeps changing.
    const checkMove = (board, move) => {
        if (board[move.row][move.column] !== 'X' && board[move.row][move.column] !== 'O') {
            return true;
        }
        return false;
    }
    
    // To place the player's mark on the board
    const makeMove = (board, move, mark) => {
        if (board[move.row][move.column] === null) {
            board[move.row][move.column] = mark;
            return move;
        }
        return false;
    }
    
    // To check for matching pattern on the board
    const checkBoard = (board, mark) => {
        return checkRows(board, mark) || checkColumns(board, mark) || checkDiagonals(board, mark);
    }
    
    const checkRows = (board, mark) => {
        let targetRow = 0;
        for (let row = 0; row < board.length; row++) {
            for (let column = 0; column < board[row].length; column++) {
                if (row === targetRow) {
                    if (board[row][column] === mark) {
                        matchingPattern.push({ row, column });
                        if (matchingPattern.length === 3) {
                            console.log('Row')
                            return true;
                        }
                    }
                    else {
                        ++targetRow;
                        matchingPattern = [];
                    }
                }
            }
        }
        return false;
    }

    const checkColumns = (board, mark) => {
        let targetColumn = 0;
        for (let row = 0; row < board.length; row++) {
            for (let column = 0; column < board[row].length; column++) {
                if (column === targetColumn) {
                    if (board[row][column] === mark) {
                        matchingPattern.push({ row, column });
                        if (matchingPattern.length === 3) {
                            console.log('Column')
                            return true;
                        }
                    }
                    else {
                        ++targetColumn;
                        matchingPattern = [];
                        row = -1;
                        break;
                    }
                }
            }
        }
        return false;
    }

    const checkDiagonals = (board, mark) => {
        let targetRow = 0;
        let targetColumn = 0;
        let leftToRight = true;
        for (let row = 0; row < board.length; row++) {
            for (let column = 0; column < board[row].length; column++) {
                if (row === targetRow && column === targetColumn) {
                    if (board[row][column] === mark) {
                        matchingPattern.push({ row, column });
                        ++targetRow;
                        if (leftToRight) {
                            ++targetColumn;
                        }
                        else {
                            --targetColumn;
                        }
                        if (matchingPattern.length === 3) {
                            console.log('Diagonal')
                            return true;
                        }
                    }
                    else {
                        matchingPattern = [];
                        if (!leftToRight) {
                            break;
                        }
                        targetColumn = 2;
                        targetRow = 0;
                        leftToRight = false;
                        row = -1;
                        break;
                    }
                }
            }
        }
        return false;
    }

    const checkDraw = (board, move, mark) => {
        if (!checkRows(board, move, mark) &&
            !checkColumns(board, move, mark) &&
            !checkDiagonals(board, move, mark) &&
            !isEmpty(board)) {
            return true;
        }
        return false;
    }
    
    // To retrive the squares matched to display the winning move.
    const getMatchingPattern = () => matchingPattern;
    
    const resetMatchingPattern = () => matchingPattern = [];

    return { createBoard, cloneBoard, isEmpty, checkMove, makeMove, checkBoard, checkRows, checkColumns, checkDiagonals, checkDraw, getMatchingPattern, resetMatchingPattern }

})();

// const Ai = ((Board) => {
//     const evalBoard = (board, minMark, maxMark) => {
//         if (Board.checkBoard(board, maxMark)) {
//             return 1;
//         }
//         else if (Board.checkBoard(board, minMark)) {
//             return -1;
//         }
//         else if (!Board.isEmpty(board)) {
//             return 0;
//         }
//     }

//     const minimax = (board, depth, alpha, beta, isMax, minMark, maxMark) => {
//         let score = evalBoard(board, minMark, maxMark);
//         if (typeof score === 'number') {
//             return score;
//         }
//         if (isMax) {
//             let bestScore = -Infinity;
//             for (let row = 0; row < board.length; row++) {
//                 for (let column = 0; column < board[row].length; column++) {
//                     if (board[row][column] === null) {
//                         let clonedBoard = Board.cloneBoard(board);
//                         clonedBoard[row][column] = maxMark;
//                         score = minimax(clonedBoard, depth - 1, !isMax, alpha, beta, minMark, maxMark);
//                         bestScore = Math.max(score, bestScore);

//                     }
//                 }
//             }
//             return bestScore;
//         }
//         else {
//             let bestScore = Infinity;
//             for (let row = 0; row < board.length; row++) {
//                 for (let column = 0; board[row].length; column++) {
//                     if (board[row][column] === null) {
//                         let clonedBoard = Board.cloneBoard(board);
//                         clonedBoard[row][column] = minMark;
//                         score = minimax(clonedBoard, depth - 1, !isMax, alpha, beta, minMark, maxMark);
//                         bestScore = Math.min(score, bestScore);

//                     }
//                 }
//             }
//             return bestScore;
//         }

//     }

//     const findBestMove = (board, maxMark) => {
//         let bestScore = -Infinity;
//         let bestMove = null;
//         board.forEach((row, rowIndex) => {
//             row.forEach((cell, cellIndex) => {
//                 let move = { row: rowIndex, column: cellIndex };
//                 if (cell === null) {
//                     let clonedBoard = Board.cloneBoard(board);
//                     clonedBoard[move.row][move.column] = maxMark;
//                     let minMark = maxMark === 'X' ? 'O' : 'X';
//                     let score = minimax(clonedBoard, 2, false, -Infinity, Infinity, minMark, maxMark);
//                     if (score > bestScore) {
//                         bestScore = score;
//                         bestMove = move;
//                     }
//                 }
//             })
//         })
//         return bestMove;
//     }
//     return { findBestMove }
// })(Board);

// The module with the properties and methods to control the flow of the game
const Game = ((Player, Board) => {
    let playerOne = Player();
    let playerTwo = Player();
    let currentPlayer = {};
    let roundWinner;
    let gameWinner;
    let board;
    let turn;
    let round;
    let draws;
    let gameStatus = {};
    let matchingPattern;
    
    // To create the player objects based on user selection
    const initializePlayers = (playerOneConfig = {}, playerTwoConfig = {}) => {
        playerOne.setName(playerOneConfig.name);
        playerOne.setMark(playerOneConfig.mark);
        // if (playerOneConfig.isAi) {
        //     playerOne.toggleAi();
        // }
        playerTwo.setName(playerTwoConfig.name);
        playerTwo.setMark(playerTwoConfig.mark);
        // if (playerTwoConfig.isAi) {
        //     playerTwo.toggleAi();
        // }
    }

    const resetPlayers = () => {
        playerOne.resetPlayer();
        playerTwo.resetPlayer();
    }
    
    // Flag used to change rounds, announce winner and end the game
    const setGameStatus = () => {
        gameStatus.hasPlayerWon = false;
        gameStatus.isDraw = false;
        gameStatus.hasRoundEnded = false;
        gameStatus.hasGameEnded = false;
    }
    
    // Gameboard cannot be accessed otherwise
    const getBoard = () => board;
    
    // Is undefined otherwise
    const getCurrentPlayer = () => currentPlayer;

    const setCurrentPlayer = () => {
        currentPlayer = playerOne.getMark() === 'X' ? playerOne : playerTwo;
    }
    
    // Setup the initial state of the game
    const startGame = (playerOneConfig, playerTwoConfig) => {
        board = Board.createBoard();
        initializePlayers(playerOneConfig, playerTwoConfig);
        setCurrentPlayer();
        setGameStatus();
        turn = 1;
        round = 1;
        draws = 0;
    }
    
    // These functions are created to make the playRound() function easy to read 
    const checkMove = () => {
        return Board.checkMove(board, currentPlayer.getMove());
    }

    const makeMove = () => {
        // if (currentPlayer.checkAi()) {
        //     currentPlayer.setMove(Ai.findBestMove(board, currentPlayer.getMark()));
        // }   
        Board.makeMove(board, currentPlayer.getMove(), currentPlayer.getMark());
    }

    const setMatchingPattern = () => {
        matchingPattern = Board.getMatchingPattern();
    }

    const getMatchingPattern = () => matchingPattern;

    const resetMatchingPattern = () => {
        Board.resetMatchingPattern();
    }
    
    // To check for a winner for the current round
    const checkRoundWin = () => {
        if (Board.checkBoard(board, currentPlayer.getMark())) {
            gameStatus.hasPlayerWon = true;
            gameStatus.hasRoundEnded = true;
            setMatchingPattern();
            return true;
        }
        return false;
    }
    
    // Used to make the losing player go first next
    const setRoundWinner = () => roundWinner = currentPlayer;

    const checkRoundDraw = () => {
        if (Board.checkDraw(board, currentPlayer.getMove(), currentPlayer.getMark())) {
            gameStatus.isDraw = true;
            gameStatus.hasRoundEnded = true;
            incrementDraws();
            return true;
        }
        return false;
    }

    const incrementDraws = () => ++draws;

    // Because of closures, if I don't use a function that has access to the same scope,
    // all the variables return undefined
    const getDraws = () => draws;

    const getTurn = () => turn;

    const incrementTurn = () => ++turn;

    const switchCurrentPlayer = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    }

    const getRound = () => round;

    const incrementRound = () => ++round;
    
    // Whoever has won three rounds
    const checkGameWin = () => {
        if (currentPlayer.getScore() === 3) {
            gameStatus.hasGameEnded = true;
            return true;
        }
        return false;
    }

    const setGameWinner = () => gameWinner = currentPlayer;

    const getGameWinner = () => gameWinner;
    
    // To setuo the game state for the next round
    const continueGame = () => {
        incrementRound();
        board = Board.createBoard();
        resetMatchingPattern();
        turn = 1;
        setGameStatus();
        if (!roundWinner) {
            setCurrentPlayer()
        }
        else if (roundWinner.getName() === playerOne.getName()) {
            currentPlayer = playerTwo;
        }
        else {
            currentPlayer = playerOne;
        }
    }
    
    // Used upon a game win or upon quitting the game
    const endGame = () => {
        board = [];
        resetMatchingPattern();
        resetPlayers();
        setGameStatus();
        currentPlayer = null;
        roundWinner = null;
        gameWinner = null;
        turn = 1;
        round = 1;
        draws = 0;
    }
    
    // The function that runs when the user clicks the board
    const playRound = () => {
        if (!checkRoundWin() && !checkRoundDraw()) {
            if (checkMove()) {
                makeMove();
                if (checkRoundWin()) {
                    setRoundWinner();
                    currentPlayer.incrementScore();
                    if (checkGameWin()) {
                        setGameWinner();
                    }
                }
                else {
                    if (!checkRoundDraw()) {
                        incrementTurn();
                        switchCurrentPlayer();
                    }
                }
            }
        }
    }

    return { playerOne, playerTwo, gameStatus, getBoard, getCurrentPlayer, getRound, getTurn, getDraws, getGameWinner, getMatchingPattern, startGame, playRound, continueGame, endGame }

})(Player, Board);

/* The module to implement the UI of the game */

const DisplayController = ((Game) => {
    /* Setup screen elements */
    const setupScreen = document.querySelector('.setup-screen-div');
    const playerOneInput = document.querySelector('input.player-one');
    const playerTwoInput = document.querySelector('input.player-two');
    //const aiButtons = document.querySelectorAll('.ai-button');
    //aiButtons.forEach(aiButton => aiButton.onclick = toggleAi);
    const markButtons = document.querySelectorAll('.mark-button');
    markButtons.forEach(markButton => markButton.onclick = selectMark)
    const startButton = document.querySelector('#start-button');
    startButton.onclick = startGame;
    const message = document.querySelector('.message');

    /* Game screen elements */
    const gameScreen = document.querySelector('.game-screen-div');
    const playerOneName = document.querySelector('#player-one-name');
    const playerOneMark = document.querySelector('#player-one-mark');
    const playerOneScore = document.querySelector('#player-one-score');
    const playerTwoName = document.querySelector('#player-two-name');
    const playerTwoMark = document.querySelector('#player-two-mark');
    const playerTwoScore = document.querySelector('#player-two-score');
    const gameboard = document.querySelector('.gameboard');
    const continueButton = document.querySelector('#continue-button');
    continueButton.onclick = handleContinuation;
    const quitButton = document.querySelector('#quit-button');
    quitButton.onclick = handleQuit;

    /* Game module properties necessary for the UI */
    const playerOne = Game.playerOne;
    const playerTwo = Game.playerTwo;
    
    // function toggleAi(event) {
    //     const playerAi = event.target;
    //     playerAi.classList.toggle('is-ai');
    // }
    
    // Retrieve the player marks and add visual indications
    function selectMark(event) {
        const playerMark = event.target;
        const markButtons = playerMark.parentElement.children;
        // Adding viusal style to the selected button
        for (const markButton of markButtons) {
            markButton.classList.remove('selected-mark');
        }
        playerMark.classList.add('selected-mark');
        const selectedMarks = document.querySelectorAll('.selected-mark');
        // To make sure both players can't select the same mark
        if (selectedMarks.length === 2) {
            if (selectedMarks[0].textContent === selectedMarks[1].textContent) {
                selectedMarks.forEach(selectedMark => {
                    if (selectedMark !== playerMark) {
                        selectedMark.classList.remove('selected-mark');
                    }
                });
            }
        }
    }
    
    // To setup the initial UI state for the game
    function startGame() {
        //const playerOneAiButton = document.querySelector('.player-one.is-ai');
        const playerOneMarkButton = document.querySelector('.player-one.selected-mark');
        //const playerTwoAiButton = document.querySelector('.player-two.is-ai');
        const playerTwoMarkButton = document.querySelector('.player-two.selected-mark');

        if (!playerOneMarkButton || !playerTwoMarkButton) {
            message.textContent = 'Select players\' marks to start the game!';
            return;
        }

        message.textContent = '';
        const playerOneName = playerOneInput.value === '' ? 'Player One' : playerOneInput.value;
        const playerTwoName = playerTwoInput.value === '' ? 'Player Two' : playerTwoInput.value;
        //const playerOneAi = playerOneAiButton ? true : false;
        //const playerTwoAi = playerTwoAiButton ? true : false;
        const playerOneMark = playerOneMarkButton.textContent;
        const playerTwoMark = playerTwoMarkButton.textContent;
        const playerOneConfig = {
            name: playerOneName,
            mark: playerOneMark,
            //isAi: playerOneAi
        };
        const playerTwoConfig = {
            name: playerTwoName,
            mark: playerTwoMark,
            //isAi: playerTwoAi
        };
        Game.startGame(playerOneConfig, playerTwoConfig);
        setupScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        updateDisplay();
    }
    
    // To render the board
    function displayBoard() {
        gameboard.innerHTML = '';
        const board = Game.getBoard();
        board.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                const cell = document.createElement('button');
                cell.classList.add('cell');
                cell.dataset.row = rowIndex;
                cell.dataset.column = columnIndex;
                cell.textContent = column;
                cell.onclick = playRound;
                gameboard.appendChild(cell);
            })
        })
    }
    
    // Present at the top of the board
    function displayPlayerStats() {
        playerOneName.textContent = playerOne.getName();
        playerOneMark.textContent = playerOne.getMark();
        playerOneScore.textContent = playerOne.getScore();
        playerTwoName.textContent = playerTwo.getName();
        playerTwoMark.textContent = playerTwo.getMark();
        playerTwoScore.textContent = playerTwo.getScore();
    }
    
    // Present at the base of the board
    function displayGameStats() {
        const round = document.querySelector('#round');
        const turn = document.querySelector('#turn');
        const draws = document.querySelector('#draws');
        const currentPlayerMark = document.querySelector('#current-player');
        //const currentPlayerStatus = document.querySelector('#current-player-status');
        round.textContent = Game.getRound();
        turn.textContent = Game.getTurn();
        draws.textContent = Game.getDraws();
        currentPlayerMark.textContent = Game.getCurrentPlayer().getMark();
        //currentPlayerStatus.textContent = Game.getCurrentPlayer().checkAi() === true ? 'AI' : 'Human';
    }
    
    // To show the squares that are matching
    function displayMatchingPattern() {
        const matchingPattern = Game.getMatchingPattern();
        const cells = document.querySelectorAll('.cell');
        matchingPattern.forEach(pattern => {
            cells.forEach(cell => {
                let position = { row: cell.dataset.row, column: cell.dataset.column };
                if (pattern.row == position.row && pattern.column == position.column) {
                    cell.classList.add('winning-cell');
                }
            })
        })
    }
    
    // To update the UI after every turn
    function updateDisplay(gameStatus = {}) {
        if (gameStatus.hasGameEnded) {
            const winner = Game.getGameWinner();
            if (winner.getName() === playerOneName.textContent) {
                playerOneName.classList.add('winner');
            }
            else {
                playerTwoName.classList.add('winner');
            }
            return;
        }
        displayBoard();
        displayPlayerStats();
        displayGameStats();
    }
    
    // When the continue button is clicked
    function handleContinuation() {
        continueButton.style.display = 'none';
        Game.continueGame();
        updateDisplay();
    }
    
    // When the quit button is clicked
    function handleQuit() {
        Game.endGame();
        gameScreen.style.display = 'none';
        //aiButtons.forEach(aiButton => aiButton.classList.remove('is-ai'));
        markButtons.forEach(markButton => markButton.classList.remove('selected-mark'));
        playerOneName.classList.remove('winner');
        playerTwoName.classList.remove('winner');
        playerOneInput.value = 'Player One';
        playerTwoInput.value = 'Player Two';
        setupScreen.style.display = 'flex';
    }
    
    // The function that handles user input and calls the Game module's playRound()
    function playRound(event) {
        const cell = event.target;
        const move = { row: cell.dataset.row, column: cell.dataset.column };
        const currentPlayer = Game.getCurrentPlayer();
        const gameStatus = Game.gameStatus;
        currentPlayer.setMove(move);
        Game.playRound();
        updateDisplay();
        if (gameStatus.hasPlayerWon) {
            console.log(currentPlayer.getName() + ' has won this round.')
            displayMatchingPattern();
            if (gameStatus.hasGameEnded) {
                console.log(currentPlayer.getName() + ' has won the game.');
                updateDisplay(gameStatus);
            }
            else {
                continueButton.style.display = 'block';
            }
        }
        if (gameStatus.isDraw) {
            console.log('It\'s a draw.')
            continueButton.style.display = 'block';
        }
    }


})(Game);