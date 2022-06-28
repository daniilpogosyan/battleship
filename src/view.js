import PubSub from "pubsub-js";

const view = (()=> {
  const domLog = document.querySelector('.log');
  const domPlayerGrid = document.querySelector('#player-grid');
  const domEnemyGrid = document.querySelector('#enemy-grid');

  const attackHandler = (event) => 
    PubSub.publish('enemy cell attacked',
      {x: +event.target.dataset.x, y: +event.target.dataset.y});

  const renderGrid = (msg, {playerGrid, enemyGrid}) => {
    const grids = new Map();
    grids.set(playerGrid, domPlayerGrid);
    grids.set(enemyGrid, domEnemyGrid);

    for (const [arrGrid, domGrid] of grids) {
      domGrid.innerHTML = "";
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const domCell = document.createElement('div');
          domCell.classList.add('cell');        
          domCell.dataset.x = i;
          domCell.dataset.y = j;
          if (arrGrid[i][j] === null && arrGrid === enemyGrid) {
            domCell.classList.add('cell--clickable');
            domCell.addEventListener('click', attackHandler);
          } else if (arrGrid[i][j] === 'miss') {
            domCell.classList.add('cell--miss');
          } else if (arrGrid[i][j] === 'hit') {
            domCell.classList.add('cell--hit');
          }
          domGrid.append(domCell);
        }
      }
    }
  }


  const renderFleet = (msg, fleetCoords) => {
    fleetCoords.forEach(coords => coords
      .forEach(({x, y}) => {
        const domCell = domPlayerGrid.querySelector(
          `[data-x='${x}'][data-y='${y}']`
        );
      domCell.classList.add('cell--ship');
      }))
  }

  const announceWinner = (winnerName) => {
    domLog.textContent = `${winnerName} won!`;
  }
  const disableEnemyGrid = () => {
    domEnemyGrid.querySelectorAll('.cell--clickable')
      .forEach(domCell => {
        domCell.removeEventListener('click', attackHandler);
        domCell.classList.remove('cell--clickable');
      })
  }
  PubSub.subscribe('gameover', (msg, winner) => {
    announceWinner(winner);
    disableEnemyGrid();
  })
  
  return { renderGrid, renderFleet }
})()

PubSub.subscribe('grids updated', view.renderGrid)
PubSub.subscribe('fleet updated', view.renderFleet)

export default view