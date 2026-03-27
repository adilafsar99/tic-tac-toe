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

    const toggleAi = () => isAi === true ? false : true;

    const getScore = () => score;

    const incrementScore = () => ++score;

    return { getName, setName, getMark, setMark, getMove, setMove, toggleAi, getScore, incrementScore };

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
        if (checkRows(board, mark) || checkColumns(board, mark) || checkDiagonals(board, mark)) {
            return true;
        }
        return false;
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

    const getMatchingPattern = () => matchingPattern;

    const resetMatchingPattern = () => matchingPattern = [];

    return { createBoard, cloneBoard, isEmpty, makeMove, checkBoard, checkRows, checkColumns, checkDiagonals, getMatchingPattern, resetMatchingPattern }

})();

const Game = ((Player, Board) => {
    let playerOne = Player();
    let playerTwo = Player();
    let currentPlayer;
    let roundWinner;
    let gameWinner;
    let board = [];
    let turn;
    let round;

    const initializePlayers = (player1Config = {}, player2Config = {}) => {
        playerOne.setName(player1Config.name);
        playerOne.setMark(player1Config.mark);
        playerTwo.setName(player2Config.name);
        playerTwo.setMark(player2Config.mark);
    }

    const setCurrentPlayer = () => {
        currentPlayer = playerOne.getMark() === 'X' ? playerOne : playerTwo;
    }

    const startGame = () => {
        board = Board.createBoard();
        initializePlayers();
        setCurrentPlayer();
        turn = 1;
        round = 1;
    }

    const makeMove = () => {
        if (currentPlayer.isAi) {
            // Use minimax algorithm
        }
        else {
            Board.makeMove(board, currentPlayer.getMove(), currentPlayer.getMark());
        }
    }

    const checkRoundWin = () => {
        if (Board.checkBoard(board, currentPlayer.getMark())) {
            return true;
        }
        return false;
    }

    const setRoundWinner = () => roundWinner = currentPlayer;

    const incrementTurn = () => ++turn;

    const switchCurrentPlayer = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    }

    const incrementRound = () => ++round;

    const checkGameWin = () => {
        if (currentPlayer.getScore() === 3) {
            return true;
        }
        return false;
    }

    const setGameWinner = () => gameWinner = currentPlayer;

    const continueGame = () => {
        incrementRound();
        board = Board.createBoard();
        Board.resetMatchingPattern;
        turn = 1;
    }

    const endGame = () => {
        board = [];
        playerOne = null;
        playerTwo = null;
        currentPlayer = null;
        roundWinner = null;
        gameWinner = null;
        turn = 1;
        round = 1;
    }

    const playRound = () => {
        makeMove();
        console.log(board)
        if (checkRoundWin()) {
            currentPlayer.incrementScore();
            console.log(currentPlayer.getScore())
            setRoundWinner();
            console.log('roundWinner', roundWinner)
            if (checkGameWin()) {
                setGameWinner();
                console.log('gameWinner', gameWinner)
                endGame();
            }
            continueGame();
        }
        else {
            incrementTurn();
            console.log('turn', turn)
            switchCurrentPlayer();
            console.log(currentPlayer.getName())
        }
    }

})(Player, Board);