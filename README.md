# Battleship-App
It's a simple JavaScript test application

# Game Instructions
Battleship (also Battleships or Sea Battle) is a guessing game for two players. It is played on ruled grids (paper or board) on which the players' fleets of ships (including battleships)are marked. The locations of the fleet are concealed from the other player.Players alternate turns calling "shots" at the other player's ships, and the objective of the game is to destroy the opposing player's fleet. - <b><i>Wikipedia.org</i></b>
When 'Start Game' button is clicked the players should take turn in setting up their information, including their name and the position of their ships. You can position your ships by CLICKING on one of the ships in the left table and then clicking at the position you would like to put that ship in the right table i.e.in the Game Board.
When the two players have entered their data then they are ready to play by taking turns. The first player that will succeed in destroying all the shipts of his/her opponent will be the winner <b> Enjoy!</b>

# Development Instructions
I have used JavaScript (ES6 standards) to build this single page web application without any framework such as AngularJS or ReactJS. The <b>index.html</b> file holds all the views (separated into different DIVS) which are controlled (showed or hidden) by the <b>index.js</b> file which is also the main entry point for this application.
The application code is located inside the <b>js</b> folder. As we stated, <b><i>index.js</i></b> is the controller of the app, i.e. the entry point of the app. The folder <b>models</b> contains three classes the <b>Player</b> class in which we handle the creation of the players including their ships. In the other class <b>Stage</b> we controll the visual side of the application. We draw the gameBoards and visualize the user interactions. And lastly, we have the <b>Scoreboard</b> class which is used to store and retrieve the Score Board informations. In in the <b>js</b> folder we also have a <b>test</b> folder. The tests can be run from your console.Navigate to the project and then inside the <b>js</b> folder. Then type the command <b><u>mocha</u></b>

NOTE: Since this application is built using <b>ES6</b> standards the application cannot run in all the browsers. However, there are ways to solve that problem. <b>Babel</b> is a transpiler which takes the ES6 code and converts it into a JavaScript code that can run in all the browsers(almost). But, for the sake of this test assingment I haven't used <b>Babel</b>.</i>


