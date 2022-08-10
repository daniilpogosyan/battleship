const createGameBoard = require('./modules/createGameboard/createGameboard');
const createShip = require('./modules/createShip/createShip');
const createPlayer = require('./modules/createPlayer/createPlayer');
import PubSub from 'pubsub-js';

const game = (() => {
  const fleetTemplate = [
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

  function placeShipsDefault(gameboard, fleetToPlace) {
    for (let shipTypeIndex = 0; shipTypeIndex < fleetToPlace.length; shipTypeIndex++) {
      const shipType = fleetToPlace[shipTypeIndex];
      while(fleetToPlace[shipTypeIndex].count > 0) {
        gameboard.placeShipRandomly(createShip(shipType.length))
        fleetToPlace[shipTypeIndex].count--;
      }
    }
  }

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

  const resetAvailableFleet = (gameboard, availableFleet) => {
    availableFleet.splice(0, availableFleet.length);
    fleetTemplate.forEach(shipType => {
      const addedshipType = {
        count: shipType.count,
        length: shipType.length
      };
      availableFleet.push(addedshipType);
    });
    gameboard.clearFleet();
  }

  const playerGameboard = createGameBoard();
  const playerAvailableFleet = [];
  resetAvailableFleet(playerGameboard, playerAvailableFleet);
  PubSub.publish('available fleet updated', playerAvailableFleet);
  

  const enemyGameboard = createGameBoard();
  const enemyAvailableFleet = [];
  resetAvailableFleet(enemyGameboard, enemyAvailableFleet);
  placeShipsDefault(enemyGameboard, enemyAvailableFleet);

  const player = createPlayer('ME', enemyGameboard);
  const enemy = createPlayer('BOT', playerGameboard);

  
  PubSub.subscribe('ship will be placed', (msg, {length, origin, position}) => {
    const shipType = playerAvailableFleet.find(shiptype => shiptype.length === length);
    if (shipType.count === 0) {
      console.log(`no ${length}-celled ship left.`)
      return
    }
    
    const ship = createShip(length);
    if (playerGameboard.placeShip(ship, origin, position)) {
      PubSub.publish('fleet updated', playerGameboard.getFleetCoords());
      PubSub.publish('available fleet updated', playerAvailableFleet);
      shipType.count--;
    }
  });

  PubSub.publish('available fleet updated', playerAvailableFleet);
  PubSub.publishSync('grids updated',
    {playerGrid: playerGameboard.getGrid(), enemyGrid: enemyGameboard.getGrid()})
  PubSub.publishSync('fleet updated', playerGameboard.getFleetCoords())

  PubSub.subscribe('enemy cell attacked', (msg, coords) => game.playTurn(coords))

  return { playTurn }
})();

export default game;