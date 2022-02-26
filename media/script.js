////////////////////////////////////////////////////////////////////////////
//
//    TODO:
//     - Add documentation and explanatory comments to DisplayController
//     - Update Player() to make it more discernable who is making moves.
//          - maybe for now, have the computer make random playable moves
//          - include custom 'mark' input for players (have comp default 
//            to 'O' unless player wants to change it or make their mark 
//            'O' [in that case make the mark default to 'X])
//          - include name customization
//     - Add an option to choose between pvp and p v comp
//     - Add a message output of some sort, to allow for winning and tie 
//       messages
//     - rebuild win conditions and messages using new methods
//     - build buttons and stuff
// 
///////////////////////


let playerOne;
let playerTwo;



////////////////////////////////////////////////////////////////////////////
//
//    GameBoard 
// 
//    The Module used to describe the abstract 'game board' of this game. 
//    Generally, these functions do not need to be called on their own and
//    are instead called by the DisplayController according to user input.
//    Technically, you could play a whole game of tic-tac-toe in the 
//    console using just these methods.
//     
//    It contains the following public methods:
//
//      currentGameBoard():
//          - grabs the current game board and returns an array of objects 
//            with the following keys and values:
//              (0){
//                  ID: (1),  -- used for adding the data-tile-number 
//                      attribute
//                  clicked: false,
//                  player: 'unclicked', -- changes to the player's title
//                  mark: 'unclicked' -- changes to the players' chosen 
//                          mark
//              }
//      addMove():
//          - adds a move to the gameboard.
//          - Takes mark (Either 'X' or 'O'), pos (the reference to 
//            data-tile-num), and player (the player's title)
//      checkForWinOrTie():
//          - checks current game board for a potential win or tie. 
//          - called after every click and returns either 'X', 'O', 'tie', 
//            or undefined 
//            depending on the outcome
//      reset():
//          - resets the gameboard
//          - called on displayController.ini()
//    
///////////////////////

let GameBoard = (() => {
    let gameBoard = [];

    // gameBoard object format:
    // gameBoard = [
    //      {
    //          ID: 1, (index + 1)
    //          clicked: false, (change on click)
    //          player: player1, (or computer, or player2)
    //          mark: X (or O, or whatever else)
    //      },
    // ]

    let gameMode = 'pvp';

    // Initialize gameboard
    let init = () => {
        let initGameBoard = [];
        for (let i = 0; i < 9; i++) {
            initGameBoard[i] = {
                ID: (i + 1),
                clicked: false,
                player: 'unclicked',
                mark: 'unclicked'
            };
        }
        return initGameBoard;
    };

    // Grabs current board and returns an array of objects
    let currentGameBoard = () => {
        return gameBoard;
    };

    let turn;
    let turnController;

    let currentTurn = () => {
        return turn;
    }


    // Add a move to the current game board.
    // Is passed the player (as an object)
    let addMove = (player, position) => {
        let currentPlayer;

        if (player == 'playerOne') {
            currentPlayer = playerOne;
        } else if (player == 'playerTwo') {
            currentPlayer = playerTwo;
        }
        mark = currentPlayer.mark;
        playerTitle = currentPlayer.title;

        if (gameBoard[position - 1].mark == 'unclicked') {
            gameBoard[position - 1].player = playerTitle;
            gameBoard[position - 1].clicked = true;
            gameBoard[position - 1].mark = `${mark}`;
        } else {
            console.log('Cannot make that move - someone has already played there');
        }

        turnController();

        // let result = GameBoard.checkForWinOrTie();
        // if (result == 'X' || result == 'O') {
        //     DisplayController.renderEnd({
        //         win: `${result}`
        //     });
        // } else if (result == 'tie') {
        //     DisplayController.renderEnd({
        //         tie: `${result}`
        //     });
        // }

    };

    // Winning combinations of any given game of tic-tac-toe for a 3x3 grid
    let winningCombos = {
        row1: [1, 2, 3],
        row2: [4, 5, 6],
        row3: [7, 8, 9],
        col1: [1, 4, 7],
        col2: [2, 5, 8],
        col3: [3, 6, 9],
        cross1: [1, 5, 9],
        cross2: [3, 5, 7],
    };

    //  ['Computer', 'Tie', 'Jared', 'Jared', 'Computer', etc....]
    //

    let gameResults = [];

    let startNewGame = (gameMode, playerOneName, playerOnemark, playerTwoName, playerTwomark) => {
        playerOne = Player('player', playerOneName, playerOnemark);

        if (gameMode == 'one-player') {
            playerTwo = Player('computer', playerTwoName, playerTwomark);
        } else if (gameMode == 'two-player') {
            playerTwo = Player('player', playerTwoName, playerTwomark);
        }
        init();
    }

    let startNewRound = () => {

    }





    // // checks for win or tie  ( ͡° ͜ʖ ͡°)
    // // returns either 'X', 'player2.title', 'tie', or undefined, depending on result
    // let checkForWinOrTie = () => {
    //     for (let key in winningCombos) {
    //         let tileVals = [];
    //         winningCombos[key].forEach(element => {
    //                 // takes the values of each object in the main array (at the winning combinations index corrected value eg 1, 2, 3 -> [0, 1, 2] and push them to the tileVals array for easier access
    //                 tileVals.push(gameBoard[element - 1].mark);
    //             })
    //             // check tileVals for equality. If there is a match in any of these cases, it will result in a win. If there isn't, it will simply continue
    //         if (tileVals.every(equalToX)) {
    //             currentWinResult = 'X';
    //             return currentWinResult;
    //         } else if (tileVals.every(equalToO)) {
    //             currentWinResult = 'O';
    //             return currentWinResult;
    //         } else {
    //             // checking for unclicked is a little harder because I want the object's mark value to be more descriptive than simply an empty string or ' '. This checks against all of the 'clicked' values of the objects in Gameboard.currentGameBoard() (the main storage array) and checks for a tie
    //             let unclickedArray = [];
    //             for (let index of gameBoard) {
    //                 if (index.mark == 'unclicked') {
    //                     unclickedArray.push(true);
    //                 } else if (!index.mark == 'unclicked') {
    //                     unclickedArray.push(false);
    //                 }
    //             }
    //             if (!unclickedArray.includes(false) && !unclickedArray.includes(true)) {
    //                 return 'tie';
    //             }
    //         }
    //     }
    // };

    // reset the board by re-initializing all of the tiles
    let reset = () => {
        gameBoard = init();
    }

    return {
        startNewGame,
        startNewRound,
        addMove,
        currentGameBoard,
        currentTurn,
        reset,
    }
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

const Player = (playerType, playerTitle, playermark) => {

    let type = playerType;
    let title = playerTitle;
    let mark = playermark;

    let makeMove = (position) => {
        GameBoard.addMove(title, position);
    }

    return {
        makeMove,
        type,
        title,
        mark,
    }
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
//          renderEnd()
//
///////////////////////
let DisplayController = (() => {

    // gameMode is either 'pvp' or 'pvc'
    // players in an object that is either [{player1: 'name', markChoice: 'X'} {player2: 'name', markChoice: 'O'}] (editable via the first form) or [{player1: 'name', markChoice: 'X'}]
    // let startGame = (gameMode, players) {
    //     if (gameMode == 'pvp') {

    //     }
    // }

    // // render borad needs to be able to differentiate between the individual players, so maybe there's a turn storage somewhere up on the gameboard, and it gets that every time 

    // // render board is called every time there is a move. If the tile has not been clicked, there needs to be an event listener listening for the 

    // let renderBoard = (gameMode) {

    // }

    // renderboard takes the current game and puts it on the screen
    let generateTile = (tile) => {

        let tileBuild;

        tileBuild = document.createElement('p');
        tileBuild.dataset.tileNumber = `${tile.ID}`
        tileBuild.classList.add('game-tile');

        if (tile.clicked == false) {
            tileBuild.innerText = '';
        } else if (tile.clicked == true) {
            tileBuild.classList.add('clicked')
            tileBuild.innerText = `${tile.mark}`
        }

        return tileBuild
    }

    let toggleModal = () => {
        let modal = document.querySelector('#modal');
        modal.classList.toggle('hidden');
        if (modal.classList.contains('hidden')) {
            return 'hidden'
        } else {
            return 'visible'
        };
    }


    //  needs to be able to take the form on page, attach all needed functions to the submit buttons ()
    let showIntro = () => {
        let introP1Button = document.querySelector('#one-player-button');
        introP1Button.addEventListener('click', () => {
            showGamemode('one-player');
        })

        let introP2Button = document.querySelector('#two-player-button');
        introP2Button.addEventListener('click', () => {
            showGamemode('two-player');
        })

    }

    let submitOnePlayer = () => {
        let p1Name = document.querySelector('#one-player-player-one-info').value;
        let p1Mark = document.querySelector('#one-player-player-two-mark').value;
        if (p1Name == '') { p1Name = 'Player One'; };
        if (p1Mark == '') { p1Mark = 'X' };

        let p2Name = 'Computer';
        let p2Mark;
        if (p1Mark == 'O') {
            p2Mark = 'X';
        } else {
            p2Mark = 'O';
        }

        startGame('one-player', p1Name, p2Name);
        toggleModal();
    }

    let submitTwoPlayer = () => {
        let p1Name = document.querySelector('#two-player-player-one-info').value;
        if (p1Name == '') { p1Name = 'Player One'; };
        let p2Name = document.querySelector('#two-player-player-two-info').value;
        if (p2Name == '') { p2Name = 'Player Two'; };

        startGame('two-player', p1Name, p2Name);
        toggleModal();
    }

    let showGamemode = (gameMode) => {
        let submitOptionsButton = document.querySelector('.init-options-submit');
        let onePlayerOptions = document.querySelector('.one-player-options');
        let twoPlayerOptions = document.querySelector('.two-player-options');

        submitOptionsButton.classList.remove('hidden');

        if (gameMode == 'one-player') { // for one player games
            // display stuff
            // if one player options are hidden (the default), clear it and show it
            // if two player options are shown, hide it
            if (onePlayerOptions.classList.contains('hidden')) {
                document.querySelector('#one-player-player-one-info').value = ''; // Input field
                document.querySelector('#one-player-player-one-mark').value = ''
                onePlayerOptions.classList.remove('hidden');
            }
            if (!twoPlayerOptions.classList.contains('hidden')) {
                twoPlayerOptions.classList.add('hidden');
            }


            // submit button stuff
            if (submitOptionsButton.getAttribute('listener' == 'true')) {
                // check if there's an event listener on the submit button & remove if necessary
                submitOptionsButton.removeEventListener('click', submitTwoPlayer);
            }
            submitOptionsButton.addEventListener('click', submitOnePlayer); //add event listener to submit button


        } else if (gameMode == 'two-player') {
            // display stuff
            // if two player options are hidden (the default), clear it and show it
            // if one player options are shown, clear it and hide it
            if (twoPlayerOptions.classList.contains('hidden')) {
                document.querySelector('#two-player-player-one-info').value = ''; // clear input fields
                document.querySelector('#two-player-player-one-mark').value = '';
                document.querySelector('#two-player-player-two-info').value = '';
                document.querySelector('#two-player-player-two-mark').value = '';
                twoPlayerOptions.classList.remove('hidden');
            }
            if (!onePlayerOptions.classList.contains('hidden')) {
                onePlayerOptions.classList.add('hidden');
            }

            // same things as above, but reversed
            if (submitOptionsButton.getAttribute('listener' == 'true')) {
                submitOptionsButton.removeEventListener('click', submitOnePlayer);
            }

            submitOptionsButton.addEventListener('click', () => {
                // Error handling logic, the two players cannot have the same mark. It checks against the defaults as well
                let twoPP1Mark = document.querySelector('#two-player-player-one-mark').value;
                let twoPP1MarkDefault = 'X';
                let twoPP2Mark = document.querySelector('#one-player-player-one-mark').value;
                let twoPP2MarkDefault = 'O';

                if (twoPP1Mark == twoPP2MarkDefault) {
                    if (twoPP1Mark == twoPP2Mark) {
                        // display error, both players cannot have the same marker
                    }
                } else if (twoPP2Mark == twoPP1MarkDefault) {
                    if (twoPP2Mark == twoPP1Mark) {
                        // display error, both players cannot have the same marker
                    }
                } else {
                    submitTwoPlayer();
                }
            });
        }

    }

    let renderBoard = () => {
        let tiles = GameBoard.currentGameBoard(); // array of objects holding the tile data
        document.querySelector('#gameboard').innerHTML = '';
        // gameBoard object format:
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

                    if (thisTurn == 'playerOne') {
                        playerOne.makeMove(tileHTML.dataset.tileNumber);
                    } else if (thisTurn == 'playerTwo') {
                        playerTwo.makeMove(tileHTML.dataset.tileNumber);
                    }

                    tileHTML.classList.add('clicked');

                    renderBoard();

                }, {
                    once: true
                });
            } else if (tileHTML.classList.contains('clicked')) {
                tileHTML.classList.remove('game-tile');
                tileHTML.classList.add('game-end-tile');
            }
        }

    }

    // Gets called on click of submit options on the intro modal
    // let initializeGame = (playMode) => {
    //     reset(); // reset game completely, just in case
    //     renderBoard();
    // }


    let init = () => {
        renderBoard();

        // let playMode = 'pvp'
        // if (playMode = 'pvp') {
        //     initializeGame('pvp');
        // } else {
        //     initializeGame('pvc');
        // }

    }

    let renderMessage = (message) => {
        // Render message on the board, for now I'm just console logging it
        console.log(message);
    }

    // let reset = () => {
    //     GameBoard.reset();
    //     deleteTiles();
    //     generateTiles();
    //     renderBoard();
    // }

    let deleteTiles = () => {
        document.querySelector('#gameboard').innerHTML = '';
    }

    // Gets passed an object that determines what state to display
    // Both: store temp board array, and use that to display a non-clickable board
    // Win: Display a win message with who won
    // Tie: Display a tie message


    // { winner: winner, message: 'string' }

    // let renderEnd = (winnerObj) => {
    //     // store win array
    //     let tempBoard = [...GameBoard.currentGameBoard()];
    //     // reset board
    //     deleteTiles();
    //     tempBoard.forEach((element, index) => {
    //         let newTile = document.createElement('p');
    //         newTile.classList.add('game-end-tile');
    //         newTile.classList.add('game-end-tile');
    //         newTile.dataset.tileNumber = `${index + 1}`
    //         newTile.innerText = element;
    //         document.querySelector('#gameboard').appendChild(newTile);
    //     });
    //     // display a (non-clickable) win state

    //     // winner is either {win: 'X'} {win: 'O'} or {tie: 'tie'}
    //     for (let key in winnerObj) {
    //         if (key == 'win') {
    //             if (winnerObj[key] == 'X') {
    //                 renderMessage('X won, nice!');
    //             } else if (winnerObj[key] == 'O') {
    //                 renderMessage('O won, nice!');
    //             }
    //         } else if (key == 'tie') {
    //             renderMessage('Oh wow, it was a tie!');
    //         }
    //     }
    // }


    let showEndOfRound = () => {
        let endTarget = document.querySelector('#round-result');
    }

    return {
        init,
        showIntro,
        // reset,
        // renderBoard,
        // renderEnd,
    }
})();

window.onload = function() {
    GameBoard.reset();
    DisplayController.showIntro();
}