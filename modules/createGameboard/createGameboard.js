function createGameboard () {
  const grid = Array.from(Array(10), () => Array(10).fill(null));

  const getGrid = () => {
    return Array.from(grid, (arr1D) => [...arr1D])
  }

  
  const cellAvailable = (coords) => {
    if (grid[coords.x]?.[coords.y] !== null) return false

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (grid[coords.x + i]?.[coords.y + j] !== undefined
            && grid[coords.x + i]?.[coords.y + j] !== null)
          return false 
      }
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

    const wouldbeShipBlocks = [];
    for (let offset = 0; offset < ship.length; offset++) {
      const cell = addOffset(offset);
      if (!cellAvailable(cell)) return false
      wouldbeShipBlocks.push(cell);
    }

    wouldbeShipBlocks.forEach(block => grid[block.x][block.y] = {
      ship: ship,
      origin: origin
    })
    return true
  }


  return { getGrid, placeShip }
}

module.exports = createGameboard;