// Import chai.
let chai = require('chai'),
    path = require('path');

// Tell chai that we'll be using the "should" style assertions.
chai.should();

// Import the Rectangle class.
let Player = require(path.join(__dirname, '..', 'models/player'));

describe('Player methods', () => {
    describe('Ship methods', () => {
        let player;
        let myShips;
        beforeEach(() => {
            // Create a new Player object before every test.
            player = new Player();

            //SHIPS WITH MOCK DATA
           myShips = [
                {
                    name : 'carrier',
                    size : 5,
                    location : [[1,1], [1,2], [1,3], [1,4], [1,5]],
                    damage : [],
                    direction : this.HORIZONTAL,
                    color: 'red'
                },
                {
                    name : 'battleship',
                    size : 4,
                    location : [[2, 1], [2, 2], [2, 3], [2, 4]],
                    damage : [],
                    direction : this.HORIZONTAL,
                    color: 'blue',
                },
                {
                    name : 'cruiser',
                    size : 3,
                    location : [[3, 1], [3, 2], [3, 3]],
                    damage : [],
                    direction : this.HORIZONTAL,
                    color: 'green'
                },
                {
                    name : 'submarine',
                    size : 3,
                    location : [[4, 1], [4, 2], [4, 3]],
                    damage : [],
                    direction : this.HORIZONTAL,
                    color: 'purple',
                },
                {
                    name : 'destroyer',
                    size : 2,
                    location : [[5, 1], [5, 2]],
                    damage : [],
                    direction : this.HORIZONTAL,
                    color: 'yellow'
                },
            ];
        });

        describe('getShipByName', () => {
            it('should contain the name of the ship', () => {
                let ship = player.getShipByName('carrier');
                ship[0].name.should.equal('carrier');
            });
        });
        
        describe('changeShipDirection', () => {
            it('should be vertical', () => {
                let directionChanged = player.changeShipDirection('carrier', 'vertical');
                directionChanged.should.be.true;
            });
        });

        describe('generateShipCoordinates', () => {
            it ('should generate coordinates [[1,1], [1,2], [1,3], [1,4], [1,5]]', () => {
                let obj = player.generateShipCoordinates([1,1], 5, 'horizontal');
                obj.coordinates.should.deep.equal([[1,1], [1,2], [1,3], [1,4], [1,5]]);
            });
            it ('should be invalid coordinates', () => {
                let obj = player.generateShipCoordinates([1,7], 5, 'horizontal');
                obj.status.should.equal('invalid');
            });
        });

        describe('allShipsPositioned', () => {
            it ('should have all the ships positioned on the game board', () => {
                player.setShips(myShips);
                const boolean = player.allShipsPositioned();
                boolean.should.be.true;
            });
        });

        describe('getHit', () => {
            it ('should hit the submarine ship', () => {
                const response = player.getHit([4, 1]);
            });
        });
    });

});
