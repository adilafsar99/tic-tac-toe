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

    const isEmpty = () => {
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

    // createBoard();
    // boardClone = cloneBoard();
    // makeMove(boardClone, { row: 0, column: 2 }, 'X');
    // makeMove(boardClone, { row: 2, column: 0 }, 'X');
    // makeMove(boardClone, { row: 1, column: 1 }, 'X');
    // console.log(boardClone)
    // console.log(checkBoard(boardClone, 'X'))

})()