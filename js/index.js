'use strict';

/**
 * reference the different DOM elements from the index HTML
 */
//SCREEN references
const startScreenDiv           = document.getElementById('start_screen');
const gameSetupScreenDiv       = document.getElementById('game_setup');
const gamePlayScreenDiv        = document.getElementById('game_play');
const instructionScreenDiv     = document.getElementById('game_instruction');
const devInstructionScreenDiv  = document.getElementById('dev_instruction');
const gameOverScreenDiv        = document.getElementById('game_over');
const scoreBoardScreenDiv      = document.getElementById('score_board');

//LABEL references
const selectedShipLabel  = document.getElementById('selected_ship_label');
let   setupPlayerLabel   = document.getElementById('setup_player_label');
const playerALabel       = document.getElementById('playerA_name_label');
const playerBLabel       = document.getElementById('playerB_name_label');
const whoseTurnLabel     = document.getElementById('whose_turn_label');

//TABLE references
let gameboardTableDiv     = document.getElementById('gameboard_table');
let scoreBoardTableDiv    = document.getElementById('score_board_table');
let playerAGameboardTable = document.getElementById('playerA_gameboard_table');
let playerBGameboardTable = document.getElementById('playerB_gameboard_table');

//OTHER DOM references
let playerNameInput    = document.getElementById('player_name');
let readyBtn           = document.getElementById('ready_btn');


//app variables
let stage        = null;
let selectedShip = '';

/**
 * we use the player instance for interacting THEN when we setup
 * the user informations we pass the player infos to the approriate player
 * i.e. playerA or playerB depending on whose turn it is
 */
let player       = null;
let playerA      = null;
let playerB      = null;

/**
 *  odd - first player's turn i.e. playerA; even - second player's turn i.e. playerB
 */
let gameTurnCount = 1;

//NOTE : We could extract info Strings as constant variables e.g 
// const SETUP_PLAYER_B_LABEL = 'SETUP PLAYER 2' so when used in 
//multiple places we would stay consistent BUT since this example is fairly simple
//and small its not necessary

/**
 * this function is called when the body is loaded
 */
const appLoaded = () => {
    stage = new Stage();
    stage.hide([gameSetupScreenDiv, gamePlayScreenDiv, instructionScreenDiv, 
         devInstructionScreenDiv, gameOverScreenDiv, scoreBoardScreenDiv]);

    //we show only the startScreen
    stage.show(startScreenDiv);
}

/**
 * triggered when the user clicks Start Game button
 */
const startGame = () => {
    stage.hide([startScreenDiv, instructionScreenDiv]);
    stage.show(gameSetupScreenDiv);

    stage.createGameBoard(gameboardTableDiv, stage.SETUP_MODE);
    playerNameInput.focus();

    //initiate players
    player  = new Player();
    playerA = new Player();
    playerB = new Player();
}

/**
 * gameInstructions - triggered when the user clicks on
 * the instruction button
 */
const gameInstructions = () => {
    stage.hide([startScreenDiv, gameSetupScreenDiv, devInstructionScreenDiv]);
    stage.show(instructionScreenDiv);
}

/**
 * devInfo - triggered when Development Info is clicked
 */
const devInfo = () => {
    stage.hide([startScreenDiv, gameSetupScreenDiv]);
    stage.show(devInstructionScreenDiv);
}

/**
 * goToStartScreen - triggered when the user click the button
 * 'GO BACK' in the game instructions
 */
const goToStartScreen = () => {
    stage.hide([gameSetupScreenDiv, instructionScreenDiv, devInstructionScreenDiv, scoreBoardScreenDiv]);
    stage.show(startScreenDiv);
}

/**
 * showScoreBoard - triggered when the user clicks the 'SCOREBOARD' button
 */
const showScoreBoard = () => {
    stage.hide(startScreenDiv);
    stage.show(scoreBoardScreenDiv);

    const score = new Scoreboard();
    const scoreArray = score.getScoreBoard();
    stage.createScoreBoard(scoreArray, scoreBoardTableDiv);
}

/**
 * when the game is over and the player presses 
 * start over again
 */
const gameOver = () => {
    location.reload();
}

/**
 * selectShip - triggered when the user selects a ship from the table
 * @param {* String} shipName 
 */
const selectShip = (shipName) => {
    selectedShip = stage.selectShipFromTheTable(selectedShip, shipName, selectedShipLabel);
}

/**
 * 
 * @param {* String} shipName 
 * @param {* String} newDirection 
 */
const shipDirection = (shipName, newDirection) => {
    selectShip(shipName); //we also select that ship
    const didChange = player.changeShipDirection(shipName, newDirection);
    if (!didChange) {
         //the ship has been placed already
        //the direction cannot be changed
        alert("Ship has been already put in the board, the direction cannot be changed");
        stage.revertShipDirection(shipName, newDirection);
    }
}

/**
 * boardFieldClicked - triggered when the player wants to put
 * a ship in his game board
 * @param {* Int} row 
 * @param {* Int} column 
 */
const boardFieldClicked = (row, column) => {
    if (selectedShip.length > 0) {
        //we have a ship selected to be placed in the board
        if (player.hasShipAt(row, column, selectedShip)) {
            alert("There is already a ship in these coordinates!");
        }
        else {
            const oldCoordinates = player.getCoordinatesOfShip(selectedShip);
            if (oldCoordinates.length > 0) {
                //the ship has already been placed
                alert("The ship has already been placed");
            }
            else {
                const newShip = player.placeShipAt(selectedShip, [row, column]);
                if (newShip.length !== 0 && newShip.location.length > 0) {
                    //the ship was added so we should draw it in the board
                    stage.addShipToBoard(newShip);
                    if (player.allShipsPositioned()) {
                        stage.show(readyBtn);
                    }
                }
                else {
                    alert(selectedShip.toUpperCase() + ' cannot be placed in this location!');
                }
            }
        }
    }
    else {
        alert('Please select a ship first!');
    }
}

/**
 * playerReady - when the setup is finished and user clicks I AM READY
 */
const playerReady = () => {
    //the name entered by the user
    const playerName = playerNameInput.value;
    if (playerName.length === 0) {
        //the user hasnt entered their name
        alert("Please, enter your name!");
        playerNameInput.focus();
    }
    else {
        player.setName(playerName);

        if (!playerA.isReady()) {
            //if playerA hasn't yet been assigned then prepare him
            //and make the stage ready for the scond player to chose
            stage.createGameBoard(gameboardTableDiv, stage.SETUP_MODE); //reset the gameboard
            playerNameInput.value = ""; //reset the name in the input
            playerNameInput.focus();
            stage.deselectShipFromTable(selectedShip);
            //we setup the first player
            playerA.setName(playerName);
            playerA.setShips(player.getShips());
            playerA.setReady();

            stage.changeHTMLText(setupPlayerLabel, 'SETUP PLAYER 2');
            stage.changeHTMLText(selectedShipLabel, 'Pick A Ship From the Table On The Left');
            stage.hide(readyBtn);
            //we set a new instance and flush out the old data used for playerA
            player = new Player();
            //we should reset the directions/orientations of the ships to the default i.e. horizontal
            const shipIDs = ['carrier_horizontal', 'battleship_horizontal', 'cruiser_horizontal',
             'submarine_horizontal', 'destroyer_horizontal'];
            stage.resetAllShipDirections(shipIDs);
        }
        else {
            //playerA has already been setup so we setup playerB
            playerB.setName(playerName);
            playerB.setShips(player.getShips());
            playerB.setReady();
            //both of the players are setup we can start the game now
            //we prepare the game stage
            stage.hide(gameSetupScreenDiv);
            stage.show(gamePlayScreenDiv);
            stage.changeHTMLText(playerALabel, playerA.getName());
            stage.changeHTMLText(playerBLabel, playerB.getName());

            stage.createGameBoard(playerAGameboardTable, stage.GAME_MODE, playerB.getName());// PLAYER_B is supposed to attack
            stage.createGameBoard(playerBGameboardTable, stage.GAME_MODE, playerA.getName());// PLAYER_A is supposed to attack
            //the starting turn should belong to player A 
            //we should display it in the game
            stage.changeHTMLText(whoseTurnLabel, playerA.getName() + "'s turn!");
        }
    }
}

/**
 * shootEnemy -triggered in game when the player clicks at his enemys board
 * in attemt to destry enemy's ship
 * @param {* Int} row - the row of the attack}
 * @param {* Int} column -the column of the attack
 * @param {* String} shooterName  - the shooter name
 */
const shootEnemy = (row, column, shooterName) => {
    let hitInformation = null;

    if (parseInt(gameTurnCount) % 2 !== 0) {
        //playerA-s turn
        hitInformation = performShoot(row, column, shooterName, playerA, playerB);
    }
    else {
        //playerB-s turn
        hitInformation = performShoot(row, column, shooterName, playerB, playerA);
    }

    (hitInformation !== null) ? stage.markTheHit(hitInformation, [row, column], shooterName) : "";
}

/**
 * performShoot - helper function for shootEnemy so we won't have
 * to repeat the same code for the both players
 * @param {* Int} row
 * @param {* Int} column
 * @param {* String} shooterName
 * @param {* Player} shooter
 * @param {* Player} enemy
 * @return {* Object} hitInformation 
 */
const performShoot = (row, column, shooterName, shooter, enemy) => {
    let hitInformation = null;

    if (shooter.getName() == shooterName) {
        //the game turn is correct
        //check if our target hit any of the enemy's ships
        hitInformation = enemy.getHit([row, column]);
        //mark as success i.e. * or fail hit i.e. X
        if (hitInformation.hasAWinner) {
            //the game is over the shooter won
            //store the score in our scoreboard
            const score = new Scoreboard();
            score.updateScoreBoard(shooter.getName());
            alert("PLAYER " + shooter.getName().toUpperCase() + " WON!!");
            gameOver();
        }
        else {
            //if we don't have a winner yet we continue the turn
            gameTurnCount++;
            stage.changeHTMLText(whoseTurnLabel, enemy.getName() + "'s turn!");
        }
    }
    else {
        //wrong turn played
        alert(" IT IS " + shooter.getName().toUpperCase() + "'S TURN!");
    }

    return hitInformation;
}




