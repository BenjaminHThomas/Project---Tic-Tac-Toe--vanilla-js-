const boardValues = [[null,null,null],
                     [null,null,null],
                     [null,null,null]]

const players = [
    {
        name: "playerOne",
        token: 'X'
    },
    {
        name: "playerTwo",
        token: 'O'
    }
];

const changeCell = (row, column, player) => {
    // don't allow cells to be overwritten
    if (boardValues[row][column] != null) return;
    boardValues[row][column] = player.token;
    if (checkWinner()) {
        console.log("Winner!")
    };
}

function checkWinner() {
    // if any of the rows have all matching non-null values, then true
    const rowMatch = boardValues.some(
        row => row.every((val,i, arr) => val!== null && val === arr[0])
    );
    
    const columnMatch = (() => {
        for (let i = 0; i < 3; i++) {
            if (boardValues[0][i] != null &&
                boardValues[0][i] === boardValues[1][i] && 
                boardValues[1][i] === boardValues[2][i]){return true} else {
                    return false;
                };    
        };
    })();

    const diagonalMatch = (() => {
        if ( 
            //diagonal left to right
            (boardValues[0][0] != null &&
            boardValues[0][0] === boardValues[1][1] &&
            boardValues[1][1] === boardValues[2][2] ) 
            
            ||
            
            // diagonal right to left
            (boardValues[0][2] != null &&
            boardValues[0][2] === boardValues[1][1] &&
            boardValues[1][1] === boardValues[2][0]) 
        ) return true;
        return false;
    })();

    return rowMatch || columnMatch || diagonalMatch;
}