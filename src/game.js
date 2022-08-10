const createGameBoard = require('./modules/createGameboard/createGameboard');
const createShip = require('./modules/createShip/createShip');
const createPlayer = require('./modules/createPlayer/createPlayer');
import PubSub from 'pubsub-js';

const game = (() => {
  const fleetConfig = [
    {
      length: 4,
      count: 1
    },
    {
      length: 3,
      count: 2
    },
    {
      length: 2,
      count: 3
    },
    {
      length: 1,
      count: 4
    }
  ];

  function placeShipsDefault(gameboard) {
    for (let shipTypeIndex = 0; shipTypeIndex < fleetConfig.length; shipTypeIndex++) {
      const shipType = fleetConfig[shipTypeIndex];
      for(let shipCount = 0; shipCount < shipType.count; shipCount++) {
        gameboard.placeShipRandomly(createShip(shipType.length))    
      }
    }
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
      PubSub.publish('gameover', player.getName())
    }
    enemy.attack();
    if (playerGameboard.fleetIsSunk()) {
      console.log(`gameover, enemy win`)
      PubSub.publish('gameover', enemy.getName())
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