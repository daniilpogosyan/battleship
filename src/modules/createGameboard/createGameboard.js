function createGameboard () {
  const grid = Array.from(Array(10), () => Array(10).fill(null));
  const fleet = [];

  const getGrid = () => {
    return Array.from(grid, (arr1D) => [...arr1D])
  }

  const coordsExist = (coords) => (
    coords.x < 10 && coords.x >= 0
    && coords.y < 10 && coords.y >= 0
  )

  const findShipFrom = (targetCoords) => {
    return fleet.find(unit => 
      unit.coords.some((coords) =>
        coords.x === targetCoords.x && coords.y === targetCoords.y));
  }

  const getAdjacentCoords = (coords) => {
    const adjacentCoords = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const currentCoords = {x: coords.x + i, y: coords.y + j};
        if (coordsExist(currentCoords) && (i !==0 || j !== 0))
            adjacentCoords.push({x: coords.x + i, y: coords.y + j});
      }
    }
    return adjacentCoords;
  }
  
  const cellAvailable = (coords) => {
    if (grid[coords.x]?.[coords.y] !== null) return false
    const adjacentCoords = getAdjacentCoords(coords);
    for (let adjacentCoord of adjacentCoords) {
      if(findShipFrom(adjacentCoord))
        return false
    }
    return true
  }


  const placeShip = (ship, origin, position) => {
    const addOffset = (() => {
      if (position == 'horizontal') {
        return (offset) => ({
          x: origin.x + offset,
          y: origin.y    
        })
      } else if (position == 'vertical') {
        return (offset) => ({
          x: origin.x,
          y: origin.y + offset    
        })
      }
    })();

    const wouldbeShipCoords = [];
    for (let offset = 0; offset < ship.length; offset++) {
      const coords = addOffset(offset);
      if (!cellAvailable(coords)) return false
      wouldbeShipCoords.push(coords);
    }

    fleet.push({
      coords: wouldbeShipCoords,
      ship: ship
    });

    return true
  }

  const placeShipRandomly = (ship) => {   
    const pullRandomItemFrom = (arr) =>
       arr.splice(Math.random() * arr.length, 1)[0];

    const availableCells = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const coords = {x: x, y: y};
        if (cellAvailable(coords))
          availableCells.push(coords)
      }
    }
    

    let shipIsPlaced = false;
    do {
      const positions = ['vertical', 'horizontal'];
      const origin = pullRandomItemFrom(availableCells);
      shipIsPlaced = placeShip(ship, origin, pullRandomItemFrom(positions));
      if (!shipIsPlaced)
        shipIsPlaced = placeShip(ship, origin, pullRandomItemFrom(positions));
    } while (!shipIsPlaced || ((!shipIsPlaced) && availableCells.length > 0))

    return shipIsPlaced
  }

  const revealAdjacentCells = (coords)  => {
    const adjacentCoords = getAdjacentCoords(coords);
    for (let coords of adjacentCoords) {
      if (grid[coords.x]?.[coords.y] === null)
        grid[coords.x][coords.y] = 'miss';
    }
  }

  const receiveAttack = (coords) => {
    if (grid[coords.x]?.[coords.y] === null) {
      let mark;
      const targetedUnit = findShipFrom(coords);
      if (targetedUnit) {
        targetedUnit.ship.hit(
          (coords.y - targetedUnit.coords[0].y)
          + (coords.x - targetedUnit.coords[0].x)
        );
        if (targetedUnit.ship.isSunk()) 
          targetedUnit.coords.forEach(revealAdjacentCells);
        mark = 'hit';
      } else {
        mark = 'miss';
      }
      grid[coords.x][coords.y] = mark;
      return mark
    } else 
      return false
  }

  const fleetIsSunk = () => fleet.every(unit => unit.ship.isSunk())

  return { getGrid, placeShip, receiveAttack, fleetIsSunk, placeShipRandomly }
}

module.exports = createGameboard;