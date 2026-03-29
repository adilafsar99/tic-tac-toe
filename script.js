/* The modules implementing the core logic of the game */

const Player = () => {
    let name;
    let mark;
    let move;

    let isAi = false;
    let score = 0;

    const getName = () => name;

    const setName = newName => name = newName;

    const getMark = () => mark;

    const setMark = newMark => mark = newMark;

    const getMove = () => move;

    const setMove = newMove => move = newMove;

    const checkAi = () => isAi;

    const toggleAi = () => isAi ? false : true;

    const getScore = () => score;

    const incrementScore = () => ++score;

    return { getName, setName, getMark, setMark, getMove, setMove, checkAi, toggleAi, getScore, incrementScore };

};

const Board = (() => {
    let rows = 3;
    let columns = 3;
    let board = [];
    let matchingPattern = [];

    const createBoard = () => {
        board = Array.from(Array(rows), () => Array(columns).fill(null));
        return board;
    }

    const cloneBoard = () => {
        return board.map(row => [...row]);
    }

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

    const makeMove = (board, move, mark) => {
        if (board[move.row][move.column] === null) {
            board[move.row][move.column] = mark;
            return move;
        }
        return false;
    }

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

    const getMatchingPattern = () => matchingPattern;

    const resetMatchingPattern = () => matchingPattern = [];

    return { createBoard, cloneBoard, isEmpty, makeMove, checkBoard, checkRows, checkColumns, checkDiagonals, checkDraw, getMatchingPattern, resetMatchingPattern }

})();

const Game = ((Player, Board) => {
    let playerOne = Player();
    let playerTwo = Player();
    let currentPlayer;
    let roundWinner;
    let gameWinner;
    let board;
    let turn;
    let round;
    let draws;
    let gameStatus = {}

    const initializePlayers = (playerOneConfig = {}, playerTwoConfig = {}) => {
        playerOne.setName(playerOneConfig.name);
        playerOne.setMark(playerOneConfig.mark);
        if (playerOneConfig.isAi) {
            playerOne.toggleAi();
        }
        playerTwo.setName(playerTwoConfig.name);
        playerTwo.setMark(playerTwoConfig.mark);
        if (playerTwoConfig.isAi) {
            playerTwo.toggleAi();
        }
    }

    const getBoard = () => board;

    const getCurrentPlayer = () => currentPlayer;

    const setCurrentPlayer = () => {
        currentPlayer = playerOne.getMark() === 'X' ? playerOne : playerTwo;
    }

    const startGame = (playerOneConfig, playerTwoConfig) => {
        board = Board.createBoard();
        initializePlayers(playerOneConfig, playerTwoConfig);
        setCurrentPlayer();
        turn = 1;
        round = 1;
        draws = 0;
        gameStatus.hasPlayerWon = false;
        gameStatus.hasRoundEnded = false;
        gameStatus.hasGameEnded = false;
    }
    const makeMove = () => {
        if (currentPlayer.checkAi()) {
            // Use minimax algorithm
        }
        else {
            Board.makeMove(board, currentPlayer.getMove(), currentPlayer.getMark());
        }
    }

    const checkRoundWin = () => {
        if (Board.checkBoard(board, currentPlayer.getMark())) {
            gameStatus.hasPlayerWon = true;
            return true;
        }
        return false;
    }

    const checkRoundDraw = () => {
        if (Board.checkDraw(board, currentPlayer.getMove(), currentPlayer.getMark())) {
            gameStatus.hasRoundEnded = true;
            incrementDraws();
            console.log(draws)
            return true;
        }
        return false;
    }
    
    const incrementDraws = () => ++draws;

    const getDraws = () => draws;

    const setRoundWinner = () => roundWinner = currentPlayer;

    const getRoundWinner = () => roundWinner;

    const getTurn = () => turn;

    const incrementTurn = () => ++turn;

    const switchCurrentPlayer = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    }

    const getRound = () => round;

    const incrementRound = () => ++round;

    const checkGameWin = () => {
        if (currentPlayer.getScore() === 3) {
            gameStatus.hasGameEnded = true;
            return true;
        }
        return false;
    }

    const setGameWinner = () => gameWinner = currentPlayer;

    const getGameWinner = () => gameWinner;

    const continueGame = () => {
        incrementRound();
        board = Board.createBoard();
        Board.resetMatchingPattern;
        turn = 1;
        gameStatus.hasPlayerWon = false;
        gameStatus.hasRoundEnded = false;
        gameStatus.hasGameEnded = false;
    }

    const endGame = () => {
        board = [];
        playerOne = Player();
        playerTwo = Player();
        currentPlayer = null;
        roundWinner = null;
        gameWinner = null;
        turn = 1;
        round = 1;
        draws = 0;
        gameStatus = {};
    }

    const playRound = () => {
        makeMove();
        if (checkRoundWin()) {
            currentPlayer.incrementScore();
            setRoundWinner();
            if (checkGameWin()) {
                setGameWinner();
                //endGame();
            }
            //continueGame();
        }
        else if (checkRoundDraw()) {
            //continueGame();
        }
        else {
            incrementTurn();
            switchCurrentPlayer();
        }
    }

    return { playerOne, playerTwo, gameStatus, getBoard, getCurrentPlayer, getRound, getTurn, getDraws, getRoundWinner, getGameWinner, startGame, playRound, continueGame, endGame }

})(Player, Board);

/* The module to implement the UI of the game */

const DisplayController = ((Game) => {
    const setupScreen = document.querySelector('.setup-screen-div');
    const playerOneInput = document.querySelector('input.player-one');
    const playerTwoInput = document.querySelector('input.player-two');
    const aiButtons = document.querySelectorAll('.ai-button');
    aiButtons.forEach(aiButton => aiButton.onclick = toggleAi);
    const markButtons = document.querySelectorAll('.mark-button');
    markButtons.forEach(markButton => markButton.onclick = selectMark)
    const startButton = document.querySelector('#start-button');
    startButton.onclick = startGame;
    const message = document.querySelector('.message');

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

    function toggleAi(event) {
        const playerAi = event.target;
        playerAi.classList.toggle('is-ai');
    }

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

    function startGame(event) {
        const playerOneAiButton = document.querySelector('.player-one.is-ai');
        const playerOneMarkButton = document.querySelector('.player-one.selected-mark');
        const playerTwoAiButton = document.querySelector('.player-two.is-ai');
        const playerTwoMarkButton = document.querySelector('.player-two.selected-mark');

        if (!playerOneMarkButton || !playerTwoMarkButton) {
            message.textContent = 'Select players\' marks to start the game!';
            return;
        }
        message.textContent = '';
        const playerOneName = playerOneInput.value === '' ? 'Player One' : playerOneInput.value;
        const playerTwoName = playerTwoInput.value === '' ? 'Player Two' : playerTwoInput.value;
        const playerOneAi = playerOneAiButton ? true : false;
        const playerTwoAi = playerTwoAiButton ? true : false;
        const playerOneMark = playerOneMarkButton.textContent;
        const playerTwoMark = playerTwoMarkButton.textContent;
        const playerOneConfig = {
            name: playerOneName,
            mark: playerOneMark,
            isAi: playerOneAi
        };
        const playerTwoConfig = {
            name: playerTwoName,
            mark: playerTwoMark,
            isAi: playerTwoAi
        };
        Game.startGame(playerOneConfig, playerTwoConfig);
        setupScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        updateDisplay();
    }

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
                cell.onclick = handleBoardClicks;
                gameboard.appendChild(cell);
            })
        })
    }

    function displayPlayerStats() {
        const playerOne = Game.playerOne;
        const playerTwo = Game.playerTwo;

        playerOneName.textContent = playerOne.getName();
        playerOneMark.textContent = playerOne.getMark();
        playerOneScore.textContent = playerOne.getScore();
        playerTwoName.textContent = playerTwo.getName();
        playerTwoMark.textContent = playerTwo.getMark();
        playerTwoScore.textContent = playerTwo.getScore();
    }

    function displayGameStats() {
        const round = document.querySelector('#round');
        const turn = document.querySelector('#turn');
        const draws = document.querySelector('#draws');
        round.textContent = Game.getRound();
        turn.textContent = Game.getTurn();
        draws.textContent = Game.getDraws();
    }

    function updateDisplay(gameStatus = {}) {
        if (gameStatus.hasGameEnded) {
            const winner = Game.getGameWinner();
            if (winner.getName() === playerOneName) {
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

    function handleContinuation() {
        continueButton.style.display = 'none';
        Game.continueGame();
        updateDisplay();
    }

    function handleQuit() {
        Game.endGame();
        gameScreen.style.display = 'none';
        aiButtons.forEach(aiButton => aiButton.classList.remove('is-ai'));
        markButtons.forEach(markButton => markButton.classList.remove('selected-mark'));
        playerOneInput.value = 'Player One';
        playerTwoInput.value = 'Player Two';
        setupScreen.style.display = 'flex';
    }

    function handleBoardClicks(event) {
        const cell = event.target;
        const move = { row: cell.dataset.row, column: cell.dataset.column };

        const currentPlayer = Game.getCurrentPlayer();
        const gameStatus = Game.gameStatus;
        console.log(gameStatus)

        currentPlayer.setMove(move);
        Game.playRound();
        updateDisplay();
        if (gameStatus.hasGameEnded) {
            console.log(currentPlayer.getName() + ' has won the game.');
            updateDisplay(gameStatus);
        }
        else if (gameStatus.hasPlayerWon) {
            console.log(currentPlayer.getName() + ' has won this round.')
            continueButton.style.display = 'block'
        }
        else if (gameStatus.hasRoundEnded) {
            console.log('It\'s a draw.')
            continueButton.style.display = 'block';
        }
    }


})(Game);