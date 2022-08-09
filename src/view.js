import PubSub from "pubsub-js";

const view = (()=> {
  const domLog = document.querySelector('.log');
  const domPlayerGrid = document.querySelector('#player-grid');
  const domEnemyGrid = document.querySelector('#enemy-grid');

  const attackHandler = (event) => 
    PubSub.publish('enemy cell attacked',
      {x: +event.target.dataset.x, y: +event.target.dataset.y});

  const renderGrid = (arrGrid, domGrid, clickable) => {
    const createCell = (i, j) => {
      const domCell = document.createElement('div');
      domCell.classList.add('cell');        
      domCell.dataset.x = i;
      domCell.dataset.y = j;

      if (clickable == true && arrGrid[i][j] === null) {
        domCell.classList.add('cell--clickable');
        domCell.addEventListener('click', attackHandler);
      } else if (arrGrid[i][j] === 'miss') {
        domCell.classList.add('cell--miss');
      } else if (arrGrid[i][j] === 'hit') {
        domCell.classList.add('cell--hit');
      }

      return domCell
    }

    domGrid.innerHTML = "";
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const domCell = createCell(i, j);
        domGrid.append(domCell);
      }
    }
  }

  const renderGrids = (msg, {playerGrid, enemyGrid}) => {
    renderGrid(playerGrid, domPlayerGrid);
    renderGrid(enemyGrid, domEnemyGrid, true);
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
  
  return { renderGrids, renderFleet }
})()

PubSub.subscribe('grids updated', view.renderGrids)
PubSub.subscribe('fleet updated', view.renderFleet)

export default view