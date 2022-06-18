function createPlayer (name, enemyGameboard) {

  const toCellsArray = () => Array.from(enemyGameboard.getGrid(),
    (row, i) => Array.from(row,
    (cell, j) => ({coords:{x: i, y: j}, val:cell})))
    .flat()
  
  const getRandomCell = () => {
    const availableCells = toCellsArray()
    .filter(cell => (cell.val === null));
    const cellIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells[cellIndex]
  }
  
  const attack = (coords = getRandomCell().coords) => 
    enemyGameboard.receiveAttack(coords);


  const getName = () => name
  return { attack, getName }
}

module.exports = createPlayer