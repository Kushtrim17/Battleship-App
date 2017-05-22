'use strict'

class Scoreboard {

    constructor() {

        /**
         * the cookie format ==> "scoreboard:[['name', score], ['name, score]........]"
         */
        this.scoreBoard = document.cookie;
    }

    /**
     * getScoreBoard - returns sorted score ranking
     * @return {* Array} - an array with the scores arranged 
     * from the highest
     */
    getScoreBoard() {
        let scoreArray = [];
        let scoreData = JSON.parse(this.scoreBoard).scoreboard;

        if (scoreData.length > 0) {
            while (scoreData.length > 0) {
                let tmpHighestScore = 0;
                let indexToRemove = 0;
                for (let i = 0; i <= scoreData.length; i++) {
                    if (scoreData[i] !== undefined) {
                        if (scoreData[i][1] > tmpHighestScore) {
                            tmpHighestScore = scoreData[i][1];
                            indexToRemove = i;
                        }
                    }
                }

                scoreArray.push(scoreData[indexToRemove]);
                scoreData.splice(indexToRemove, 1);
            }
        }

        return scoreArray;
    }

    /**
     * updateScoreBoard
     * @param {* String} winnerName 
     */
    updateScoreBoard(winnerName) {
        let scoreBoard = this.getScoreBoard();
        if (scoreBoard.length == 0) {
            //there is no player in the scoreboard yet
            //we have to create the cookie
            const scoreBoardObj = {scoreboard: [[winnerName, 1]]};
            document.cookie = JSON.stringify(scoreBoardObj);
        }
        else {
            let userFound = false;
            scoreBoard.filter((score) => {
                if (score[0].toUpperCase() === winnerName.toUpperCase()) {
                    //the winner already exists in our winners data
                    //so we just increase his win frequency by one more
                    score[1] += 1;
                    userFound = true;
                    return false; //to break the loop
                }
            });
            
            if (!userFound) {
                //the player has never won before this is his/hers first time
                scoreBoard.push([winnerName, 1]);
            }

            //re-save the data into the cookie
            document.cookie = JSON.stringify({scoreboard : scoreBoard});
        }
    }
}