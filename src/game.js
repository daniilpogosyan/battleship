const createGameBoard = require('./modules/createGameboard/createGameboard');
const createShip = require('./modules/createShip/createShip');
const createPlayer = require('./modules/createPlayer/createPlayer');
import PubSub from 'pubsub-js';

const game = (() => {
  function placeShipsDefault(gameboard) {
    gameboard.placeShipRandomly(createShip(4))
    gameboard.placeShipRandomly(createShip(2))
    gameboard.placeShipRandomly(createShip(3))
    gameboard.placeShipRandomly(createShip(3))
    gameboard.placeShipRandomly(createShip(2))
    gameboard.placeShipRandomly(createShip(2))
    gameboard.placeShipRandomly(createShip(1))
    gameboard.placeShipRandomly(createShip(1))
    gameboard.placeShipRandomly(createShip(1))
    gameboard.placeShipRandomly(createShip(1))
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

    PubSub.publishSync('grids updated',
    {playerGrid: playerGameboard.getGrid(), enemyGrid: enemyGameboard.getGrid()})

    PubSub.publishSync('fleet updated', playerGameboard.getFleetCoords())
  }

  PubSub.publishSync('grids updated',
    {playerGrid: playerGameboard.getGrid(), enemyGrid: enemyGameboard.getGrid()})
  PubSub.publishSync('fleet updated', playerGameboard.getFleetCoords())

  PubSub.subscribe('enemy cell attacked', (msg, coords) => game.playTurn(coords))

  return { playTurn }
})();

export default game;