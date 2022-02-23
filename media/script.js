let GameBoard = (() => {
    let gameBoard = []

    // gameBoard objects format:
    // gameBoard = {
    //      {
    //          ID: 1, (index + 1)
    //          clicked: false, (change on click)
    //          player: player1, (or computer, or player2)
    //          marker: X (or O, or whatever else)
    //      },
    // }



    let init = () => {
        let initGameBoard = [];
        for (let i = 0; i < 9; i++) {
            initGameBoard[i] = {
                ID: (i + 1),
                clicked: false,
                player: 'unclicked',
                marker: 'unclicked'
            }
        }
        return initGameBoard;
    };


    let currentGameBoard = () => {
        return gameBoard;
    }

    // 'pos' refers to the tile that is clicked, referenced by the data-tile-num attribute

    let addMove = (marker, pos, player) => {
        if (marker == 'X' || marker == 'O') {
            if (gameBoard[pos - 1].marker == 'unclicked') {
                gameBoard[pos - 1].player = player;
                gameBoard[pos - 1].clicked = true;
                gameBoard[pos - 1].marker = `${marker}`;
            } else {
                console.log('Cannot make that move - someone has already played there');
            }
        } else {
            console.log('Cannot make that move - invalid move');
        }
    }

    let winningCombos = {
        row1: [1, 2, 3],
        row2: [4, 5, 6],
        row3: [7, 8, 9],
        col1: [1, 4, 7],
        col2: [2, 5, 8],
        col3: [3, 6, 9],
        cross1: [1, 5, 9],
        cross2: [3, 5, 7],
    }

    let equalToX = (marker) => {
        if (marker == 'X') {
            return true;
        } else {
            return false
        }
    }

    let equalToO = (marker) => {
        if (marker == 'O') {
            return true;
        } else {
            return false;
        }
    }

    let equalToEmpty = (marker) => {
        if (marker == ' ') {
            return true;
        } else {
            return false;
        }
    }

    let checkForWinOrTie = () => {
        for (let key in winningCombos) {
            let tileVals = [];
            winningCombos[key].forEach(element => {
                tileVals.push(gameBoard[element - 1].marker);
            })
            if (tileVals.every(equalToX)) {
                // checks for an X win against winning combos
                currentWinResult = 'X';
                return currentWinResult;
            } else if (tileVals.every(equalToO)) {
                // checks for an O win against winning combos
                currentWinResult = 'O';
                return currentWinResult;
            } else {
                let unclickedArray = []
                for (let index of gameBoard) {
                    if (index.marker == 'unclicked') {
                        unclickedArray.push(true);
                    } else if (!index.marker == 'unclicked') {
                        unclickedArray.push(false);
                    }
                }
                if (unclickedArray.includes(false)) {
                    return 'tie';
                }
            }
        }
    }

    let reset = () => {
        gameBoard = init();
    }

    return {
        gameBoard,
        currentGameBoard,
        addMove,
        checkForWinOrTie,
        reset,
    }
})();


// player is either 'computer' or 'person'
const Player = (player, playerMarkerChoice) => {

    let turn, marker;

    let playerChoice = playerMarkerChoice;

    // logic to change the title of the 
    if (player == 'person' ||
        player == 'computer') {
        title = player;
    } else {
        console.log('Please input a valid player type');
    }


    // 'move' is a string of either 'X' or 'O' (capital x and o)
    // 'pos' refers to the tile that is clicked, referenced by the data-tile-num attribute
    // 'player' is the player that made the move, it is immediately passed on to the GameBoard.addMove() function
    let makeMove = (pos) => {
        // change the turn - this is a temporary fix to make a turn based approach automatic, but I want to change this in the future based on how the player wants to play (2 player or player v comp);
        if (turn == 'X') {
            marker = 'X';
            turn = 'O';
        } else if (turn == 'O') {
            marker = 'O';
            turn = 'X';
        } else {
            marker = playerChoice;
            playerChoice == 'X' ? turn = 'O' : turn = 'X';
        }

        GameBoard.addMove(marker, pos, player);

        let result = GameBoard.checkForWinOrTie();
        if (result == 'X' || result == 'O') {
            DisplayController.renderEnd({ win: `${result}` });
        } else if (result == 'tie') {
            DisplayController.renderEnd({ tie: `${result}` });
        }
    }

    return {
        makeMove,
        title,
        marker,
    }
};


// Handles display and rendering of the gameboard
let DisplayController = (() => {

    let renderBoard = () => {
        let gameTiles = document.querySelector('#gameboard').children;

        let currentBoard = GameBoard.currentGameBoard();
        for (let gameTile of gameTiles) {
            let currentIndex = gameTile.dataset.tileNumber - 1;
            let currentMarker = currentBoard[currentIndex].marker;
            if (currentMarker == 'unclicked') {
                gameTile.innerText = '';
            } else {
                gameTile.innerText = currentBoard[currentIndex].marker
            }
        }
    }

    let initialized = false;
    let init = () => {
        reset();
        let gameTiles = document.querySelector('#gameboard').children;
        if (initialized == false) {
            for (tile of gameTiles) {
                let thisTile = tile;
                let thisTilePos = thisTile.dataset.tileNumber;
                console.log(tile);

                thisTile.addEventListener('click', () => {
                    person.makeMove(thisTilePos); // change this to make marker optional, can also change what marker they want to use(possibly)
                    thisTile.classList.add('clicked');
                    renderBoard();
                }, { once: true });
            }
        } else {
            console.log('Game already initialized, to start a new game use DisplayController.newGame();')
        }
        initialized = true;
    }

    let renderMessage = (message) => {
        // Render message on the board, for now I'm just console logging it
        console.log(message);
    }

    let reset = () => {
        GameBoard.reset();
        deleteTiles();
        generateTiles();
        renderBoard();
    }

    let generateTiles = () => {
        let currentBoard = GameBoard.currentGameBoard();
        for (let tile in currentBoard) {
            let newTile = document.createElement('p');
            newTile.classList.add('game-tile');

            console.log(currentBoard[tile].clicked)
            newTile.dataset.tileNumber = `${currentBoard[tile].ID}` // to reference individual tiles
            if (currentBoard[tile].clicked == false) {
                newTile.innerText = '';
            } else if (currentBoard[tile].clicked == true) {
                newTile.innerText = `${currentBoard[tile].marker}`
            }
            document.querySelector('#gameboard').appendChild(newTile);
        }
    }

    let deleteTiles = () => {
        document.querySelector('#gameboard').innerHTML = '';
    }

    // Gets passed an object that determines what state to display
    // Both: store temp board array, and use that to display a non-clickable board
    // Win: Display a win message with who won
    // Tie: Display a tie message


    // { winner: winner, message: 'string' }

    let renderEnd = (winnerObj) => {
        // store win array
        let tempBoard = [...GameBoard.currentGameBoard()];
        // reset board
        deleteTiles();
        tempBoard.forEach((element, index) => {
            let newTile = document.createElement('p');
            newTile.classList.add('game-end-tile');
            newTile.classList.add('game-end-tile');
            newTile.dataset.tileNumber = `${index + 1}`
            newTile.innerText = element;
            document.querySelector('#gameboard').appendChild(newTile);
        });
        // display a (non-clickable) win state

        // winner is either {win: 'X'} {win: 'O'} or {tie: 'tie'}
        for (let key in winnerObj) {
            if (key == 'win') {
                if (winnerObj[key] == 'X') {
                    renderMessage('X won, nice!');
                } else if (winnerObj[key] == 'O') {
                    renderMessage('O won, nice!');
                }
            } else if (key == 'tie') {
                renderMessage('Oh wow, it was a tie!');
            }
        }
    }

    return {
        init,
        reset,
        renderBoard,
        renderEnd,
    }
})();

let person = Player('person', 'X');
let computer = Player('computer', 'O');

window.onload = function() {
    DisplayController.init();
}