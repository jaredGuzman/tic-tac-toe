let playerOne;
let playerTwo;



////////////////////////////////////////////////////////////////////////////
//
//    GameBoard 
// 
//    The Module used to describe the abstract 'game board' of this game. 
//    Generally, these functions do not need to be called on their own and
//    are instead called by the DisplayController according to user input.
//    
///////////////////////

let GameBoard = (() => {
    let gameBoard = [];
    let gameStatus;

    // gameBoard object format:
    // gameBoard = [
    //      {
    //          ID: 1, (index + 1)
    //          clicked: false, (change on click)
    //          player: player1, (or computer, or player2)
    //          mark: X (or O, or whatever else)
    //      },
    // ]

    // Grabs current board and returns an array of objects
    let currentGameBoard = () => {
        return gameBoard;
    };

    let turn = 'Player One';

    let toggleTurn = () => {
        if (turn == 'Player One') {
            turn = 'Player Two';
        } else if (turn == 'Player Two') {
            turn = 'Player One';
        }
    };

    let currentTurn = () => {
        return turn;
    };

    let currentStatus = () => {
        return gameStatus;
    };

    // Add a move to the current game board.
    // Is passed the player (as an object)
    let addMove = (name, position, mark, title) => {
        if (gameType == 'One Player' && name == 'Computer') {
            let gameboard = GameBoard.currentGameBoard();

            let simpleBoard = [];

            for (let tile of gameboard) {
                if (tile.clicked == 'unclicked') {
                    simpleBoard.push('_');
                } else {
                    simpleBoard.push(`${tile.mark}`);
                }
            }

            let p1Mark = playerOne.mark;
            let p2Mark = playerTwo.mark;


            // return 0 for tie or no win, +10 for p2Mark win, & -10 for p1Mark win
            let evaluate = (board) => {
                for (let [key, value] of Object.entries(winningCombos)) {
                    let arrayToCheck = [...value];
                    // check for equal to p1Mark

                    let isEqualToP1Mark = [];
                    let isEqualToP2Mark = [];
                    for (let i = 0; i < arrayToCheck.length; i++) {
                        if (board[arrayToCheck[i] - 1] == p1Mark) {
                            isEqualToP1Mark.push(board[arrayToCheck[i] - 1]);
                        } else if (board[arrayToCheck[i] - 1] == p2Mark) {
                            isEqualToP2Mark.push(board[arrayToCheck[i] - 1]);
                        }
                    }

                    if (isEqualToP1Mark.length == 3) {
                        return -10;
                    } else if (isEqualToP2Mark.length == 3) {
                        return 10;
                    }
                }
                return 0;
            };

            // works with a more simplified board 
            let minimax = (board, depth, isMaximizing) => {

                let score = evaluate(board);

                let movesLeft = movesLeftToMake(board);

                if (score == 10) {
                    return +10;
                } else if (score == -10) {
                    return -10;
                } else if (movesLeft == false || depth == 5) {
                    return 0;
                }

                if (isMaximizing) {
                    let bestValue = -1000;
                    board.forEach((element, index) => {
                        if (element == '_') {
                            // Insert the maximizer's move
                            board[index] = p2Mark;
                            // Recursively call and choose the max value
                            bestValue = Math.max(bestValue, minimax(board, depth + 1, !isMaximizing));
                            // Undo the move
                            board[index] = '_';
                        }
                        // console.log(bestValue);
                    });
                    return bestValue - depth;
                } else { //minimizer's move
                    let bestValue = 1000;
                    board.forEach((element, index) => {
                        if (element == '_') {
                            // Insert the maximizer's move
                            board[index] = p1Mark;
                            // Recursively call and choose the max value
                            bestValue = Math.min(bestValue, minimax(board, depth + 1, !isMaximizing));
                            // Undo the move
                            board[index] = '_';
                        }
                    });
                    return bestValue + depth;
                }


            };

            let movesLeftToMake = (board) => {
                if (board.includes('_')) {
                    return true;
                } else {
                    return false;
                }
            };

            // Best move will be the best possible move's ID (aka the tile position, or in array terms array[i-1])
            let findBestMove = (board) => {
                let bestValue = -1000;
                let bestMove = -1;

                board.forEach((element, index) => {
                    let thisMove = index;
                    if (element == '_') {
                        board[index] = p2Mark;
                        // Recursively call and choose the max value
                        let thisValue = minimax(board, 0, false);
                        // Undo the move
                        board[index] = '_';
                        if (thisValue > bestValue) {
                            bestValue = thisValue;
                            bestMove = thisMove;
                        }
                    }

                });
                return bestMove + 1;
            };

            let bestPosition = findBestMove(simpleBoard);
            console.log(bestPosition);

            if (gameBoard[bestPosition - 1].mark == 'unclicked') {
                // add the proper attributes to the gameboard
                gameBoard[bestPosition - 1].player = name;
                gameBoard[bestPosition - 1].clicked = 'clicked';
                gameBoard[bestPosition - 1].mark = `${mark}`;
                gameBoard[bestPosition - 1].title = title;
            } else {
                console.log('Cannot make that move - someone has already played there');
            }

        } else if (gameType == 'Two Player' || name != 'Computer') {
            if (gameBoard[position - 1].mark == 'unclicked') {
                // add the proper attributes to the gameboard
                gameBoard[position - 1].player = name;
                gameBoard[position - 1].clicked = 'clicked';
                gameBoard[position - 1].mark = `${mark}`;
                gameBoard[position - 1].title = title;
            } else {
                console.log('Cannot make that move - someone has already played there');
            }
        }
        toggleTurn();

        let result = checkForWinOrTie();
        if (result == 'Player One') {
            DisplayController.renderRoundEnd(playerOne);
        } else if (result == 'Player Two') {
            DisplayController.renderRoundEnd(playerTwo);
        } else if (result == 'Computer') {
            DisplayController.renderRoundEnd(playerTwo);
        } else if (result == 'Tie') {
            DisplayController.renderRoundEnd('Tie');
        }

    };

    // Winning combinations of any given game of tic-tac-toe for a 3x3 grid
    let winningCombos = {
        col1: [1, 4, 7],
        col2: [2, 5, 8],
        col3: [3, 6, 9],
        cross1: [1, 5, 9],
        cross2: [3, 5, 7],
        row1: [1, 2, 3],
        row2: [4, 5, 6],
        row3: [7, 8, 9]
    };

    // Initialize gameboard
    let init = () => {
        gameStatus = 'gaming';
        turn = 'Player One';
        let initGameBoard = [];
        for (let i = 0; i < 9; i++) {
            initGameBoard[i] = {
                ID: (i + 1),
                clicked: 'unclicked',
                player: 'unclicked',
                mark: 'unclicked',
                title: 'unclicked'
            };
        }
        return initGameBoard;
    };

    let gameType;

    let currentGameType = () => {
        return gameType;
    };

    let startNewGame = (gameMode, playerOneName, playerOnemark, playerTwoName, playerTwomark) => {
        playerOne = Player('player', playerOneName, playerOnemark, 'Player One');

        if (gameMode == 'One Player') {
            gameType = 'One Player';
            playerTwo = Player('computer', playerTwoName, playerTwomark, 'Player Two');
        } else if (gameMode == 'Two Player') {
            gameType = 'Two Player';
            playerTwo = Player('player', playerTwoName, playerTwomark, 'Player Two');
        }
        gameBoard = init();
        DisplayController.init();
    };


    // checks for win or tie  ( ͡° ͜ʖ ͡°)
    // returns either 'X', 'player2.title', 'tie', or undefined, depending on result
    let checkForWinOrTie = () => {
        for (let key in winningCombos) {
            let tileVals = [];
            winningCombos[key].forEach((element) => {
                tileVals.push(gameBoard[element - 1].mark);
            });

            // This checks for wins against the array of winning combos
            let isEqual = true;
            for (let i = 0; i < tileVals.length - 1; i++) {
                if (tileVals[i] != tileVals[i + 1]) {
                    isEqual = false;
                }
                if (tileVals[i] == 'unclicked' || tileVals[i + 1] == 'unclicked') {
                    isEqual = false;
                }
            }

            if (isEqual) {
                gameStatus = 'finished';
                return gameBoard[winningCombos[key][0] - 1].player;
            } else {
                let unclickedArray = [];
                for (let index of gameBoard) {
                    if (index.mark == 'unclicked') {
                        unclickedArray.push(true);
                    } else if (index.mark != 'unclicked') {
                        unclickedArray.push(false);
                    }
                }
                if (!unclickedArray.includes(true)) {
                    gameStatus = 'finished';
                    // First condition is obvious, but second also checks for an empty array
                    return 'Tie';
                }
            }
        }
    };

    // reset the board by re-initializing all of the tiles
    let reset = () => {
        gameBoard = init();
    };

    return {
        startNewGame,
        addMove,
        currentGameType,
        currentGameBoard,
        currentTurn,
        currentStatus,
    };
})();



















////////////////////////////////////////////////////////////////////////////
//
//      Player
// 
//      A function factory that returns an object with a series of public 
//      methods meant to emulate the player making actions on the page. This
//      hasn't been fully developed yet, but this will be the primary way
//      to make actual games happen, mainly by differentiating between the 
//      players.
//
//      Includes the following public methods:
// 
//          makeMove
//          title
//          mark
//
///////////////////////

const Player = (playerType, playerName, playerMark, playerTitle) => {

    let type = playerType;
    let name = playerName;
    let mark = playerMark;
    let title = playerTitle;
    let makeMove;

    if (type == 'player') {
        makeMove = (position) => {
            GameBoard.addMove(name, position, mark, title);
            DisplayController.renderBoard();
        };
    } else if (type == 'computer') {
        makeMove = () => {

            let currentAvailableTiles = [];
            let currentBoard = GameBoard.currentGameBoard();
            for (let gameTile of currentBoard) {
                if (gameTile.clicked == 'unclicked') {
                    currentAvailableTiles.push(gameTile.ID);
                }
            }
            let status = GameBoard.currentStatus();
            if (currentAvailableTiles !== undefined && currentAvailableTiles.length != 0 && status != 'finished') {
                // MINIMAX ALGORITHM GETS CALLED HERE
                GameBoard.addMove(name, 0, mark, title);
                DisplayController.renderBoard();
            }
        };
    }

    return {
        type,
        name,
        mark,
        title,
        makeMove,
    };
};



































////////////////////////////////////////////////////////////////////////////
//
//      DisplayController
//
//      Handles display and rendering of the gameboard & other visual elements
//      Includes the following public methods:
//      
//          init()
//          reset()
//          renderBoard()
//          renderRoundEnd()
//
///////////////////////
let DisplayController = (() => {

    let toggleModal = () => {
        let modal = document.querySelector('#modal');
        modal.classList.toggle('hidden');
        if (modal.classList.contains('hidden')) {
            return 'hidden';
        } else {
            return 'visible';
        }
    };

    let showIntro = () => {
        let initMessage = document.querySelector('.init-message');
        if (initMessage.classList.contains('hidden')) {
            initMessage.classList.remove('hidden');
        }
        let introP1Button = document.querySelector('#one-player-button');
        introP1Button.addEventListener('click', () => {
            showGamemode('One Player');
        });

        let introP2Button = document.querySelector('#two-player-button');
        introP2Button.addEventListener('click', () => {
            showGamemode('Two Player');
        });

    };

    let hideIntro = () => {
        let startModal = document.querySelector('.init-message');
        if (!startModal.classList.contains('hidden')) {
            startModal.classList.add('hidden');
        }
    };

    let hideIntroAllOptions = () => {
        let onePOptions = document.querySelector('.one-player-options');
        let twoPOptions = document.querySelector('.two-player-options');
        let introSubmitButton = document.querySelector('.init-options-submit');

        if (!onePOptions.classList.contains('hidden')) {
            onePOptions.classList.add('hidden');
        }
        if (!twoPOptions.classList.contains('hidden')) {
            twoPOptions.classList.add('hidden');
        }
        if (!introSubmitButton.classList.contains('hidden')) {
            introSubmitButton.classList.add('hidden');
        }
    };

    let submitOnePlayer = () => {
        let p1Name = document.querySelector('#one-player-player-one-info').value;
        let p1Mark = document.querySelector('#one-player-player-one-mark').value;
        if (p1Name == '') { p1Name = 'Player One'; }
        if (p1Mark == '') { p1Mark = 'X'; }

        let p2Name = 'Computer';
        let p2Mark;
        if (p1Mark == 'O') {
            p2Mark = 'X';
        } else {
            p2Mark = 'O';
        }

        GameBoard.startNewGame('One Player', p1Name, p1Mark, p2Name, p2Mark);
        hideIntro();
        hideIntroAllOptions();
        if (!document.querySelector('#modal').classList.contains('hidden')) {
            toggleModal();
        }
    };

    let submitTwoPlayer = () => {
        let p1Name = document.querySelector('#two-player-player-one-info').value;
        if (p1Name == '') { p1Name = 'Player One'; }
        let p1MarkDefault = 'X';
        let p1Mark = document.querySelector('#two-player-player-one-mark').value;
        if (p1Mark == '') { p1Mark = 'X'; }

        let p2Name = document.querySelector('#two-player-player-two-info').value;
        if (p2Name == '') { p2Name = 'Player Two'; }
        let p2MarkDefault = 'O';
        let p2Mark = document.querySelector('#two-player-player-two-mark').value;
        if (p2Mark == '') { p2Mark = 'O'; }

        let errorMessage = document.querySelector('.input-error-wrapper');

        if (p1Mark == p2Mark) {
            if (p1Mark != p2MarkDefault && p2Mark != p1MarkDefault) {
                if (errorMessage.classList.contains('hidden')) {
                    errorMessage.classList.remove('hidden');
                }
            }
            if (p1Mark == p2MarkDefault) {
                p2Mark = 'X';
                GameBoard.startNewGame('Two Player', p1Name, p1Mark, p2Name, p2Mark);
            } else if (p2Mark == p1MarkDefault) {
                p1Mark = 'O';
                GameBoard.startNewGame('Two Player', p1Name, p1Mark, p2Name, p2Mark);
            }
        } else {
            GameBoard.startNewGame('Two Player', p1Name, p1Mark, p2Name, p2Mark);

        }
        hideIntro();
        hideIntroAllOptions();
        if (!document.querySelector('#modal').classList.contains('hidden')) {
            toggleModal();
        }

    };

    let showGamemode = (gameMode) => {
        let submitOptionsButtonContainer = document.querySelector('.init-options-submit');
        let submitOptionsButton = document.querySelector('#start-game-button');
        let onePlayerOptions = document.querySelector('.one-player-options');
        let twoPlayerOptions = document.querySelector('.two-player-options');

        submitOptionsButtonContainer.classList.remove('hidden');
        submitOptionsButton.classList.remove('hidden');

        // remove event listeners to prevent multiple firings
        if (submitOptionsButton.getAttribute('listener' == 'true')) {
            // check if there's an event listener on the submit button & remove if necessary
            submitOptionsButton.removeEventListener('click', submitOnePlayer);
            submitOptionsButton.removeEventListener('click', submitTwoPlayer);
        }

        if (gameMode == 'One Player') { // for one player games
            // display stuff

            // if one player options are hidden (the default), clear it and show it
            // if two player options are shown, hide it
            if (onePlayerOptions.classList.contains('hidden')) {
                document.querySelector('#one-player-player-one-info').value = ''; // Input field
                document.querySelector('#one-player-player-one-mark').value = '';
                onePlayerOptions.classList.remove('hidden');
            }
            if (!twoPlayerOptions.classList.contains('hidden')) {
                twoPlayerOptions.classList.add('hidden');
            }

            submitOptionsButton.addEventListener('click', submitOnePlayer); //add event listener to submit button


        } else if (gameMode == 'Two Player') {
            // Display form logic

            // Reset fields
            document.querySelector('#two-player-player-one-info').value = '';
            document.querySelector('#two-player-player-one-mark').value = '';
            document.querySelector('#two-player-player-two-info').value = '';
            document.querySelector('#two-player-player-two-mark').value = '';

            // Change game mode forms
            // 2 Player
            if (twoPlayerOptions.classList.contains('hidden')) {
                twoPlayerOptions.classList.remove('hidden');
            }
            if (!onePlayerOptions.classList.contains('hidden')) {
                onePlayerOptions.classList.add('hidden');
            }

            // Submit button
            // Reinitialized every time there is a gamemode change
            submitOptionsButton.addEventListener('click', submitTwoPlayer);
        }

    };

    let generateTile = (tile) => {

        let tileBuild;

        tileBuild = document.createElement('p');
        tileBuild.dataset.tileNumber = `${tile.ID}`;
        tileBuild.classList.add('game-tile');

        if (tile.clicked == false) {
            tileBuild.innerText = '';
        } else if (tile.clicked == 'clicked') {
            tileBuild.classList.add('clicked');
            tileBuild.innerText = `${tile.mark}`;
        }

        return tileBuild;
    };

    // renderboard takes the current game and puts it on the screen. It is called every time there is a move.
    let renderBoard = () => {

        let tiles = GameBoard.currentGameBoard(); // array of objects holding the tile data

        document.querySelector('#gameboard').innerHTML = '';

        // gameBoard array of objects format:
        // gameBoard = [
        //      {
        //          ID: 1, (index + 1)
        //          clicked: false, (change on click)
        //          player: player1, (or computer, or player2)
        //          mark: X (or O, or whatever else)
        //      },
        // ]

        for (let tile of tiles) {
            let tileHTML = generateTile(tile); // generate the tile
            document.querySelector('#gameboard').appendChild(tileHTML); // add them to the page with everything made
            // add event listener here if the classlist !contain 'clicked'
            if (!tileHTML.classList.contains('clicked')) {
                tileHTML.addEventListener('click', () => {
                    // on click, get the turn, and add the move according to the position of the tile

                    let thisTurn = GameBoard.currentTurn();

                    if (thisTurn == 'Player One') {
                        playerOne.makeMove(tileHTML.dataset.tileNumber);


                        // COMPUTER MAKES MOVE HERE -- attempts to make it right after the player does
                        if (playerTwo.type == 'computer') {
                            playerTwo.makeMove();
                        }
                    } else if (thisTurn == 'Player Two') {
                        playerTwo.makeMove(tileHTML.dataset.tileNumber);
                    }

                    tileHTML.classList.add('clicked');

                }, {
                    once: true
                });
            } else if (tileHTML.classList.contains('clicked')) {
                tileHTML.classList.remove('game-tile');
                tileHTML.classList.add('game-end-tile');
            }
        }

    };


    let init = () => {
        renderBoard();
    };

    let deleteTiles = () => {
        let currentlyRenderedBoard = document.querySelector('#gameboard');
        currentlyRenderedBoard.innerHTML = '';
    };

    let showEnding = () => {
        let endModal = document.querySelector('#end-message');
        endModal.classList.remove('hidden');
    };

    let hideEnding = () => {
        let endModal = document.querySelector('#end-message');
        endModal.classList.add('hidden');
    };

    let endSubmitSameGame = () => {
        let p1 = playerOne;
        let p1Name = p1.name;
        let p1Mark = p1.mark;

        let p2 = playerTwo;
        let p2Name = p2.name;
        let p2Mark = p2.mark;

        // preserve players
        // reset board & 
        if (GameBoard.currentGameType() == 'One Player') {
            GameBoard.startNewGame('One Player', p1Name, p1Mark, p2Name, p2Mark);
        } else {
            GameBoard.startNewGame('Two Player', p1Name, p1Mark, p2Name, p2Mark);
        }
        hideEnding();
        toggleModal();
    };

    let endSubmitNewGame = () => {
        hideEnding();
        showIntro();
    };

    let renderRoundEnd = (winner) => {
        // store win array
        let tempBoard = [...GameBoard.currentGameBoard()];
        // reset board
        deleteTiles();
        // display a (non-clickable) win state
        tempBoard.forEach((element, index) => {
            let newTile = document.createElement('p');
            newTile.classList.add('game-end-tile');
            newTile.classList.add('game-end-tile');
            newTile.dataset.tileNumber = `${index + 1}`;
            if (element.mark == 'unclicked') {
                newTile.innerText = '';
            } else {
                newTile.innerText = element.mark;
            }
            document.querySelector('#gameboard').appendChild(newTile);
        });

        let modalContainer = document.querySelector('#modal');
        let endMessageContainer = document.querySelector('#round-result');
        showEnding();
        if (modalContainer.classList.contains('hidden')) {
            toggleModal();
        }

        // show the end modal component with a customized message depending on the outcome of the game
        if (winner == 'Tie') {
            endMessageContainer.innerText = `This one was a tie - nobody won. Click that button below to play again!`;
        } else if (winner.name == 'Player One') {
            endMessageContainer.innerText = `${winner.name} won this round! Click below to play again!`;
        } else if (winner.name == 'Player Two') {
            endMessageContainer.innerText = `${winner.name} won this round! Click below to play again!`;
        } else if (winner.name == 'Computer') {
            endMessageContainer.innerText = `Oh, the computer won this round! Maybe play again by clicking one of the buttons below?`;
        }

        let submitNewGameButton = document.querySelector('#round-end-new-game-button');
        if (submitNewGameButton.getAttribute('listener' == 'true')) {
            submitNewGameButton.removeEventListener('click', endSubmitNewGame);
        }
        submitNewGameButton.addEventListener('click', endSubmitNewGame);


        // add event listeners to final buttons
        let submitSameGameButton = document.querySelector('#round-end-same-game-button');
        if (submitSameGameButton.getAttribute('listener' == 'true')) {
            submitSameGameButton.removeEventListener('click', endSubmitSameGame);
        }
        submitSameGameButton.addEventListener('click', endSubmitSameGame);

    };

    return {
        init,
        showIntro,
        renderBoard,
        renderRoundEnd,
    };
})();

window.onload = function() {
    DisplayController.showIntro();
};