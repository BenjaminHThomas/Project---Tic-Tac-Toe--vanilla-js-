
function Gameboard() {
    const rows = 3;
    const columns = 3;
    let board = [];

    for (let i = 0; i < rows; i++){
        board[i] = [];
        for (let j = 0; j < columns; j++){
            board[i].push(Cell());
        }
    }

    // This function will be used to render the board in the UI
    const getBoard = () => board;

    const changeCell = (row, column, player) => {
        if (board[row][column].getValue() != null) {
            // have something here for an invalid move
            return;
        }
        board[row][column].addToken(player);
    }

    // useful when testing things out in the console
    const printBoard = () => {
        console.log(board);
    }

    return { getBoard, changeCell, printBoard };
}

function Cell() {
    let value = null;

    const addToken = (player) => {
        value = player.token;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    }
}

function checkWinner(board) {
    const rowMatch = (() => {
        for (let i = 0; i < 3; i++) {
           const [val1, val2, val3] = board[i].map(cell => cell.getValue());
           if (val1 !== null && val1 === val2 && val2 === val3) {
            return true;
           }
        }
        return false;
    })();

    const columnMatch = (() => {
        for (let i = 0; i < 3; i++) {
            const [val1, val2, val3] = [board[0][i], board[1][i], board[2][i]].map(cell => cell.getValue());
            if (val1 !== null && val1 === val2 && val2 === val3) {
                return true;
            }
        }
        return false;
    })();

    const diagonalMatch = (() => {
        if ( 
            //diagonal left to right
            (board[0][0].getValue() != null &&
            board[0][0].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][2].getValue() ) 
            
            ||
            
            // diagonal right to left
            (board[0][2].getValue() != null &&
            board[0][2].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][0].getValue()) 
        ) return true;
        return false;
    })();

    return rowMatch || columnMatch || diagonalMatch ;
}

function checkTie(board) {
    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            if (board[i][j].getValue() === null){
                return false; // if there's a null value, there's still legal moves remaining.
            }
        }
    }
    return true;
}

function GameController() {
    let board = Gameboard()

    let paused = false;
    const players = [
    {
        name: "Player One",
        token: 'X',
        score: 0,
    },
    {
        name: "Player Two",
        token: 'O',
        score: 0,
    }
    ];
    renderGameBoard(board.getBoard())
    updateScore(players)

    let activePlayer = players[0]
    const switchPlayerTurn = () => {
        // switches from first player to second, and vice versa
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
        document.querySelector('.currentPlayer').innerText = `Currently playing: ${activePlayer.name}`
    };

    const resetBoard = () => {
        board = Gameboard();
        renderGameBoard(board.getBoard())
        paused = false;
    };

    const resetScore = () => {
        players[0].score = 0;
        players[1].score = 0;
        updateScore(players)
    };

    const playRound = (row, column) => {
        if (paused){return;} // don't play the round if the game is over
        if (board.getBoard()[row][column].getValue() !== null){
            console.log('Invalid move, this tile is already taken. Please try again.')
            return;
        }
        board.changeCell(row, column, getActivePlayer());
        renderGameBoard(board.getBoard())

        if (checkWinner(board.getBoard())) {
            activePlayer.score ++;
            console.log(`Congratulations ${getActivePlayer().name} you have won!`);
            console.log(`The score is now:\n ${players[0].score}:${players[1].score} `);
            paused = true;
            updateScore(players)
            //resetBoard();
            return;
        } else if (checkTie(board.getBoard())) {
            console.log("No more legal moves, it's a tie. Better luck next time");
            paused = true;
            //resetBoard();
            return;
        }
        switchPlayerTurn();
        printNewRound();
    };
    

    return {
        getActivePlayer,
        playRound,
        printNewRound,
        resetBoard,
        resetScore
    };
}

function renderGameBoard(board) {
    const parentContainer = document.querySelector('.gameBoard');
    parentContainer.innerHTML = '';

    for (let i = 0; i < board.length; i++){
        for (let j = 0; j < board[i].length; j++) {
            var cellDiv = document.createElement('div');
            cellDiv.classList.add('gridCell');
            cellDiv.innerText = board[i][j].getValue();
            cellDiv.id = `cell-${i}-${j}`
            parentContainer.appendChild(cellDiv)
        }
    }
}

function updateScore(players) {
    document.querySelector('.score').innerText = `${players[0].name}: ${players[0].score} | ${players[1].name}: ${players[1].score}` 
};

const game = GameController();
game.printNewRound()

let resetBoardButton = document.querySelector('.resetBoard');
resetBoardButton.addEventListener('click', game.resetBoard);

let resetScoreButton = document.querySelector('.resetScore');
resetScoreButton.addEventListener('click',game.resetScore);

const gridContainer = document.querySelector('.gameBoard')
gridContainer.addEventListener('click', function(e){
    if (e.target.classList.contains('gridCell')) {
        let idSplit = e.target.id.split('-');
        let row = parseInt(idSplit[1]);
        let column = parseInt(idSplit[2]);
        game.playRound(row, column);
    }
})
