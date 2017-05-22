'use strict';

class Player {
    
    constructor() {

        //players name
        this.name = '';
        
        /**
         * boolean to keep in check if the user has finished placing his ships
         */
        this.ready = false;
        
        /**
         * two different orientations the ships can be placed in
         */
        this.HORIZONTAL = 'horizontal';
        this.VERTICAL   = 'vertical';

        /**
         * we track all the coordinates that are taken so that we
         * won't have to loop always through all the ships and check
         * if a certain coordinate is free
         */
        this.takenCoordinates = [];

        /**
         * since the ships are defined by the game rules 
         * every player has the same ships but locations can change
         * we initialize them with the default direction - horizontal
         */
        this.ships = [
            {
                name : 'carrier',
                size : 5,
                location : [],
                damage : [],
                direction : this.HORIZONTAL
            },
            {
                name : 'battleship',
                size : 4,
                location : [],
                damage : [],
                direction : this.HORIZONTAL
            },
            {
                name : 'cruiser',
                size : 3,
                location : [],
                damage : [],
                direction : this.HORIZONTAL
            },
            {
                name : 'submarine',
                size : 3,
                location : [],
                damage : [],
                direction : this.HORIZONTAL
            },
            {
                name : 'destroyer',
                size : 2,
                location : [],
                damage : [],
                direction : this.HORIZONTAL
            },
        ];
    }

    /**
     * setName
     * @param {* String} name - player name
     */
    setName(name) {
        this.name = name;
    }

    /**
     * getName
     * @return {* String} name - player name
     */
    getName() {
        return this.name;
    }

    /**
     * setShips
     * @param {* Array} ships 
     */
    setShips(ships) {
        this.ships = ships;
    }

    /**
     * getShips
     * @return {* Array} ships
     */
    getShips() {
        return this.ships;
    }

    /**
     * getShipByName
     * @param {* String} shipName
     * @return {* Array} ships - in this case an array with one ship object
     */
    getShipByName(shipName) {
        return this.ships.filter((ship) => {
            return (ship.name === shipName);
        });
    }

    /**
     * getCoordinatesOfShip
     * @param {* String} shipName
     * @return {* Array} coordninates - of the ship we are looking for
     */
    getCoordinatesOfShip(shipName) {
        let coordinates = [];
        this.ships.filter((ship) => {
            if (ship.name === shipName) {
                coordinates = ship.location;
            }
        });

        return coordinates;
    }

    /**
     * generateShipCoordinates
     * @param {* Array} startCoord - the coordinates where the ship starts
     * i.e. the coordinate or the square at which the player clicked
     * @param {* Int} size  - the size of the ship
     * @param {* String} direction - horizontal or vertical
     * @param {* Boolean} addToTakenCoordinatesArray - adds the coordinates to the array
     * that keep track of the coordinates that are taken
     * @return {* Object} response - contains info if the ship can be placed in the board
     * i.e. the coordinates of the ship dont go out or overlap with another ship
     * and the full coordinates of the ship to be placed IF the placement is valid
     */
    generateShipCoordinates(startCoord, size, direction, addToTakenCoordinatesArray = false) {
        let response = {}; //prepare an object that will hold the response

        const shipsStart = (direction === this.HORIZONTAL) ? startCoord[1] : startCoord[0];
        const shipsEnd = parseInt(shipsStart) + (parseInt(size) - 1);
        //NOTE : 10 shouldnt be written as this because if we have to change the size
        //of the game board then we will have to manually come here and update the nr 10
        if (shipsEnd <= 10) {
            //the coordinates dont go outside the board game / box
            response.status = 'valid';
            let coordinates = [];
            //could be written more efficiently
            for (let i = shipsStart; i <= shipsEnd; i ++) {
                if (direction === this.HORIZONTAL) {
                    coordinates.push([startCoord[0], i]);
                    if (addToTakenCoordinatesArray)
                        this.takenCoordinates.push([startCoord[0], i]);
                }
                else {
                    coordinates.push([i, startCoord[1]]);
                    if (addToTakenCoordinatesArray)
                        this.takenCoordinates.push([i, startCoord[1]]);
                }
            }
            response.coordinates = coordinates;
        }
        else {
            response.status = 'invalid';
        }
        
        return response; 
    }

    /**
     * getHit - when one player shoots we check on the other player
     * if he/she got hit
     * @param {* Array} hitCoordinates
     * @return {* Object} response - information if it was a hit or not
     * plus we return the ship that was hit
     */
    getHit(hitCoordinates) {
       let response = {};
       response.gotHit = false;
       this.ships.filter((ship) => {
           ship.location.forEach((coordinate) => {
               if (coordinate.toString() == hitCoordinates.toString().trim()) {
                   response.gotHit = true;
                   response.ship = ship;
                   //the ship was hit so we should record the damage
                   ship.damage.push(hitCoordinates)
                   response.hasAWinner = this.checkForWinner();
                   return false; //break the loop
               }
           });
       });

       return response;
    }

    /**
     * changeShipDirection
     * @param {* String} shipName 
     * @param {* String} newDirection
     * @return {* Object} shipInfo 
     */
    changeShipDirection(shipName, newDirection) {
        let directionChanged = false;
        this.ships.filter((ship) => {
            if (ship.name === shipName) {
                if (ship.location.length == 0) {
                    //if ship hasn't been placed in the board
                    //we can change its position
                    ship.direction = newDirection;
                    directionChanged = true;
                    return false; //to break from the loop
                }
            }
        });

        return directionChanged;
    }

    /**
     * hasShipAt - checks if another ship is already withint these coordinates
     * @param {* Int} row 
     * @param {* Int} column 
     * @param {* String} selectedShip 
     */
    hasShipAt(row, column, selectedShip = null) {
        let positionTaken = false;
        const ship = this.getShipByName(selectedShip);
        const response = this.generateShipCoordinates([row, column], ship[0].size, ship[0].direction);
        if (response.status === 'valid') {
            //the ship coordinates dont go outside the game board
            response.coordinates.forEach((coordinate) => {
                this.takenCoordinates.filter((takenCord) => {
                    if (coordinate.toString().trim() === takenCord.toString().trim()) {
                        positionTaken = true;
                        return false; //to break from the loop
                    }
                });
            });
        }

        return positionTaken;
    }

    /**
     * placeShipAt - puts the ship at the specified coordinates
     * @param {* String} shipName 
     * @param {* Array} coordinates 
     */
    placeShipAt(shipName, coordinates) {
        let newShip = [];
        this.ships.filter((ship) => {
            if (ship.name === shipName) {
                //we generate the coordinates where the ship should be placed and we assign it to the ship
                const response = this.generateShipCoordinates(coordinates, ship.size, ship.direction, true);
                if (response.status === 'valid') {
                    ship.location = response.coordinates;
                    newShip = ship;
                    return false; //break the loop
                }
            }
        });

        return newShip;
    }

    /**
     * allShipsPositioned - checks if the player has positioned all his/her ships in the board game
     * @return {* Boolean} 
     */
    allShipsPositioned() {
        let shipsNotPositioned = this.ships.filter((ship) => {
            return (ship.location.toString().length === 0); //get all ships with no location
        });
        
        return (shipsNotPositioned.length > 0) ? false : true;
    }

    setReady() {
        this.ready = true;
    }

    /**
     * isReady
     * @return {* Boolean} whether the user has placed all his ships is ready
     */
    isReady() {
        return this.ready;
    }

     /**
     * we have to check for each ship of the player who is being attacked
     * if the damage array is the same with the location array for all the ships
     * it means all the ships have been damaged and the player has lost
     */
    checkForWinner() {
        let weHaveAWinner = false;
        const shipsNotDestroyed = this.ships.filter((ship) => {
            return (ship.location.length !==  ship.damage.length);
        });

        if (shipsNotDestroyed.length === 0)
            weHaveAWinner = true;

        return weHaveAWinner;
    }
}

module.exports = Player;