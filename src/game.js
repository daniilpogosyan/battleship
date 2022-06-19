const createGameBoard = require('./modules/createGameboard/createGameboard');
const createShip = require('./modules/createShip/createShip');
const createPlayer = require('./modules/createPlayer/createPlayer');
import PubSub from 'pubsub-js';

const game = (() => {
  function placeShipsDefault(gameboard) {
    gameboard.placeShip(createShip(1), {x: 1, y: 1}, 'vertical');
    gameboard.placeShip(createShip(2), {x: 7, y: 2}, 'vertical');
    gameboard.placeShip(createShip(2), {x: 7, y: 6}, 'vertical');
    gameboard.placeShip(createShip(3), {x: 4, y: 1}, 'vertical');
    gameboard.placeShip(createShip(4), {x: 1, y: 6}, 'horizontal');
  }

  const playerGameboard = createGameBoard();
  placeShipsDefault(playerGameboard);

  const enemyGameboard = createGameBoard();
  placeShipsDefault(enemyGameboard);

  const player = createPlayer('ME', enemyGameboard)
  const enemy = createPlayer('BOT', playerGameboard)


  function playTurn (coords) {
    const validAttack = player.attack(coords);
    if (!validAttack)  return

    if (enemyGameboard.fleetIsSunk()) {
      console.log(`gameover, you win`)        
    }
    enemy.attack();
    if (playerGameboard.fleetIsSunk()) {
      console.log(`gameover, enemy win`)
    }

    PubSub.publish('grids updated',
    {playerGrid: playerGameboard.getGrid(), enemyGrid: enemyGameboard.getGrid()})
  }

  PubSub.publish('grids updated',
    {playerGrid: playerGameboard.getGrid(), enemyGrid: enemyGameboard.getGrid()})

  PubSub.subscribe('enemy cell attacked', (msg, coords) => game.playTurn(coords))

  return { playTurn }
})();

export default game;