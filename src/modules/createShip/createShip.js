function createShip(length) {
  if (length < 1 || length % 1 !== 0) {
    throw new Error('Invalid ship length')
  }
  const shipBlocks = Array(length).fill('ok');

  const hit = (blockIndex) => {
    if (shipBlocks[blockIndex] === 'ok')  {
      shipBlocks[blockIndex] = 'hit';
      return true
    }
    return false
  };

  const isSunk = () => shipBlocks.every(block => block == 'hit');

  return { length, hit, isSunk }
}

module.exports = createShip