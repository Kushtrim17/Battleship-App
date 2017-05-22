'use strict';

class Stage {
   
    constructor() {
        /**
         * ROWs and COLs size of the board
         */
        this.ROWS = 10;

        this.COLS = 10;

        /**
         * SETUP_MODE i.e. when we place the ships in our board
         */
        this.SETUP_MODE = 'SETUP_MODE';

        /**
         * GAME_MODE - when we generate the boards for the game
         */
        this.GAME_MODE  = 'GAME_MODE';

        /**
         * the two player modes used to label the boards correctly
         */
        this.PLAYER_A   = 'PLAYER_A';
        
        this.PLAYER_B   = 'PLAYER_B'
    }

    /**
     * createGameBoard 
     * @param {* DOM} gameboardDiv - the div the board shold be drawn
     * @param {* String} mode - we have two modes SETUP_MODE and GAME_MODE
     * @param {* String} shooterName - the name of the person who clicked/shot at the enemy
     * @return {* DOM} gameboardDiv - we return the DOM element i.e. the game board created
     */
    createGameBoard(gameboardDiv, mode, shooterName = null) {
        let tableContents = '';
        let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        for (let i = 0; i <= this.ROWS; i ++) {
            tableContents += '<tr>';
            for (let j = 0; j <= this.COLS; j ++) {
                if (i != 0) {
                    //the body of the game board
                    if (j === 0) {
                        //we have the letters A - J in the first column
                        tableContents += `<th>${letters[i-1]}</th>`;
                    }
                    else {
                        if (mode === this.GAME_MODE) {
                            //when we have the game mode we should add the name of the enemy in the board
                            //i.e. the person who will be shooting at the board and the coordinates of that shoot
                            const coordinates = [i, j];
                            tableContents += `<td id ='${shooterName + '_' +i + '_' +j}' `;
                            tableContents += `class = 'game_td' onclick = 'shootEnemy(${i}, ${j}, "${shooterName}")'></td>`;
                        }
                        else {
                            //its during the game setup process when user puts its ships in the board
                            tableContents += `<td id ='${i + '_' +j}' onclick = 'boardFieldClicked(${i}, ${j})'></td>`;
                        }
                    }
                }
                else {
                    //header of the gameboard 1 - 10
                    (j != 0) ? tableContents += `<th id ='${j}' class = 'game_td'>${j}</th>` :  tableContents += '<td></td>';
                }
            }
            tableContents += "</tr>";
        }

        //we draw the board it in the scene
        gameboardDiv.innerHTML = tableContents;

        return gameboardDiv;
    }

    /**
     * createScoreBoard
     * @param {* Array} scoreBoardArray
     * @param {* DOM} scoreBoardTableDiv
     */
    createScoreBoard(scoreBoardArray, scoreBoardTableDiv) {
        let tableContents = '<tr> <th>Name</th> <th>Victories</th> </tr>';
        scoreBoardArray.forEach((score) => {
            tableContents += `<tr> <td> ${score[0]} </td> <td> ${score[1]} </td> </tr>`;
        });

        scoreBoardTableDiv.innerHTML = tableContents;
    }

    /**
     * addShipToBoard
     * @param {* Object} ship - contains the details of the ship that
     * should be added in the gameboard
     */
    addShipToBoard(ship) {
        const sign = (ship.direction === 'horizontal') ? '==' : '||';
        ship.location.forEach((coordinate) => {
            const html = `<span class = "${ship.name}">${sign}</span>`;
            this.changeHTMLText(document.getElementById(coordinate[0] + '_' + coordinate[1]), html);
        });
    }

    /**
     * removeShipFromBoard
     * @param {* Array} coordinates 
     */
    removeShipFromBoard(coordinates) {
        coordinates.forEach((coordinate) => {
            this.changeHTMLText(document.getElementById(coordinate[0] + '_' + coordinate[1]), '');
        });
    }

    /**
     * hide - is used to hide any element from the stage
     * @param {* DOM | Array} divID  - we can pass in either
     * a DOM references or an Array of DOM references
     */
    hide(divID) {
        const domArray = (divID.constructor === Array) ? divID : [divID];      
        if (domArray.constructor === Array) {
            domArray.forEach((dom) => {
                dom.style.display = 'none';
            });
        }
    }

    /**
     * show - is used to show any element that is hidden in the stage
     * @param {* DOM} divID 
     */
    show(divID) {
        divID.style.display = 'block';
    }

    /**
     * selectShipFromTheTable
     * @param {* String} previousShipSelected - the name of the previous ship selected
     * @param {* String} newShipSelected - the name of the current ship to be selected
     * @param {* DOM} selectedShipLabel - the lable DOM element to be updated with the new ship name
     */
    selectShipFromTheTable(previousShipSelected, newShipSelected, selectedShipLabel) {
        if (previousShipSelected.length > 1) {
            //we deselect the previous selection
            this.deselectShipFromTable(previousShipSelected);
        }
        document.getElementById(newShipSelected).className = 'battle_ship_selected';
        const shipName = newShipSelected.charAt(0).toUpperCase() + newShipSelected.slice(1);
        
        this.changeHTMLText(selectedShipLabel, 'Place ' + shipName + ' here');

        return newShipSelected;
    }

    /**
     * deselectShipFromTable
     * @param {* String} shipName 
     */
    deselectShipFromTable(shipName) {
        document.getElementById(shipName).className = 'battle_ship_deselected';
    }

    /**
     * changeHTMLText
     * @param {*DOM} labelID 
     * @param {* INT} playerNr 
     */
    changeHTMLText(labelID, text) {
        labelID.innerHTML = text;
    }

    /**
     * revertShipDirection - changes the selected direction in the HTML
     * @param {* String} shipName 
     * @param {* String} newDirection 
     */
    revertShipDirection(shipName, newDirection) {
        switch(newDirection) {
            case 'horizontal':
                document.getElementById(shipName + '_vertical').checked = true;
                break;
            case 'vertical':
                document.getElementById(shipName + '_horizontal').checked = true;
                break;
        }
    }

    /**
     * resetAllShipsDirections - when we settup the second player
     * we have to reset all the ship directions that the first player 
     * might have changed
     */
    resetAllShipDirections(shipIDs) {
        shipIDs.forEach((id) => {
            document.getElementById(id).checked = true;
        });
    }

    /**
     * markTheHit - displays the hit in the board
     * @param {* Object} shipHit - the information about the hit and the ship
     */
    markTheHit(shipHit, coordinate, shooterName) {
        let html = '';

        if (shipHit.gotHit) {
            //we should color the box in the coordinate the ship got hit
            //with the color of the ship
            const sign = (shipHit.ship.direction === 'horizontal') ? '==' : '||';
            html = `<span><b><h4 class = "${shipHit.ship.name} targetHit"> ${sign} </h4></b></span>`;
        }
        else {
            //it was a miss
            html = `<span class = "missHit"><b><h4 class = "targetHit">X</h4></b></span>`;
        }

        this.changeHTMLText(document.getElementById(shooterName + '_' + coordinate[0] + '_' + coordinate[1]), html);
    }
}

module.exports = Stage;