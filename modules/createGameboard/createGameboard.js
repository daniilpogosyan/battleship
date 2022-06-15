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

  const getAdjacentCells = (coords) => {
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

    const adjacentCoords = getAdjacentCells(coords);
    for (let coords of adjacentCoords) {
        if (grid[coords.x]?.[coords.y] === 'ship')
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
      const cell = addOffset(offset);
      if (!cellAvailable(cell)) return false
      wouldbeShipCoords.push(cell);
    }

    wouldbeShipCoords.forEach(coords => grid[coords.x][coords.y] = 'ship');

    fleet.push({
      coords: wouldbeShipCoords,
      ship: ship
    });

    return true
  }


  return { getGrid, placeShip }
}

module.exports = createGameboard;