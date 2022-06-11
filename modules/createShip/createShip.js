function createShip(origin, length, position = 'horizontal') {
  const shipBlocks = [];

  const createShipBlock = (coord) => ({
    coords: {
      x: coord.x,
      y: coord.y
    },
    hit: false
  })
  
  const addOffset = (() => {
    if (position == 'horizontal') 
    return (offset) => ({
      x: origin.x + offset,
      y: origin.y    
    })
    
    else if (position == 'vertical') 
    return (offset) => ({
      x: origin.x,
      y: origin.y + offset    
    })
  })();
  
  for (let offset = 0; offset < length; offset++) {
    const shipBlock = createShipBlock(addOffset(offset))
    shipBlocks.push(shipBlock)
  }


  const hit = (coords) => {
    const target = shipBlocks.find((block) => {
      return (block.coords.x == coords.x 
           && block.coords.y == coords.y)
    });

    if (target) {
      target.hit = true;
      return true
    }
    return false
  };

  const isSunk = () => shipBlocks.every(block => block.hit == true);

  const getShipBlocks = () => {
    return JSON.parse(JSON.stringify(shipBlocks))
  }

  return { hit, isSunk, getShipBlocks }
}

module.exports = createShip