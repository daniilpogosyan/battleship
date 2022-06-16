const { describe, test, expect } = require('@jest/globals')

const createGameboard = require('./createGameboard');
const createShip = require('../createShip/createShip');

const create2DArray = (size, val) => Array.from(
    Array(size), () => Array(size).fill(val));

test(`create empty gameboard`, () => {
  const mockGrid = create2DArray(10, null);
  const gameboard = createGameboard();
  expect(gameboard.getGrid()).toEqual(mockGrid);
});


describe('place ship', () => {
  // ships, if not hit, should not expose their coords to grid
  const emptyGrid = create2DArray(10, null);

  test('one ship, vertical', () => {
    const ship = {length: 3};
    const gameboard = createGameboard();

    expect(gameboard.placeShip(ship, {x: 3, y: 4}, 'vertical')).toBe(true);
    expect(gameboard.getGrid()).toEqual(emptyGrid);
  });

  test('one ship, horizontal', () => {
    const ship = {length: 3};
    const gameboard = createGameboard();

    expect(gameboard.placeShip(ship, {x: 1, y: 1}, 'horizontal')).toBe(true);
    expect(gameboard.getGrid()).toEqual(emptyGrid);
  });
    
  test('one ship, failure (out of bounds)', () => {
    const ship = {length: 3};
    const gameboard = createGameboard();

    expect(gameboard.placeShip(ship, {x: 11, y: 12}, 'vertical')).toEqual(false);
    expect(gameboard.placeShip(ship, {x: 0, y: -1}, 'vertical')).toEqual(false);
    expect(gameboard.placeShip(ship, {x: 8, y: 4}, 'horizontal')).toEqual(false);
    expect(gameboard.placeShip(ship, {x: 5, y: 9}, 'vertical')).toEqual(false);
    expect(gameboard.getGrid()).toEqual(emptyGrid);
  });

  
  test('two ships', () => {
    const ship1 = {length: 3};
    const ship2 = {length: 4};
    const gameboard = createGameboard();

    expect(gameboard.placeShip(ship1, {x:1, y: 0}, 'vertical')).toBe(true);
    expect(gameboard.placeShip(ship2, {x:4, y: 0}, 'horizontal')).toBe(true);
    expect(gameboard.getGrid()).toEqual(emptyGrid);
  });

  test('two ship, failure (ship crosses)', () => {
    const SucessfullyPlacedship = {length: 3};
    const anotherShip = {length: 2};
    const gameboard = createGameboard();
    
    gameboard.placeShip(SucessfullyPlacedship, {x: 5, y: 5}, 'vertical')
    expect(gameboard.placeShip(anotherShip, {x: 4, y: 5}, 'horizontal')).toBe(false);
    expect(gameboard.placeShip(anotherShip, {x: 5, y: 7}, 'vertical')).toBe(false);
    expect(gameboard.getGrid()).toEqual(emptyGrid);
  })

  test('two ship, failure (placing ship in a near-ship cells)', () => {
    const SucessfullyPlacedship = {length: 3};
    const anotherShip = {length: 2};
    const gameboard = createGameboard();

    gameboard.placeShip(SucessfullyPlacedship, {x: 5, y: 5}, 'vertical')
    expect(gameboard.placeShip(anotherShip, {x: 6, y: 5}, 'horizontal')).toBe(false);
    expect(gameboard.placeShip(anotherShip, {x: 6, y: 8}, 'horizontal')).toBe(false);
    expect(gameboard.placeShip(anotherShip, {x: 4, y: 6}, 'vertical')).toBe(false);
    expect(gameboard.placeShip(anotherShip, {x: 4, y: 6}, 'vertical')).toBe(false);
    expect(gameboard.getGrid()).toEqual(emptyGrid);
  })
});

describe('receive attack', () => {
  test('miss', () => {
    const gameboard = createGameboard();
    expect(gameboard.receiveAttack({x:3, y:4})).toBe('miss');

    const mockGrid = create2DArray(10, null);
    mockGrid[3][4] = 'miss';

    expect(gameboard.getGrid()).toEqual(mockGrid)
  });

  test('hit a ship', () => {
    const gameboard = createGameboard();
    const ship = createShip(2);
    gameboard.placeShip(ship, {x: 5, y: 3}, 'vertical');
    expect(gameboard.receiveAttack({x:5, y:3})).toBe('hit');

    const mockGrid = create2DArray(10, null);
    mockGrid[5][3] = 'hit';

    expect(ship.isSunk()).toBe(false);
    expect(gameboard.getGrid()).toEqual(mockGrid);
  });

  test('with repeatition', () => {
    const gameboard = createGameboard();
    const ship = createShip(2);
    gameboard.placeShip(ship, {x: 5, y: 3}, 'vertical');
    expect(gameboard.receiveAttack({x:1, y:1})).toBe('miss');
    expect(gameboard.receiveAttack({x:1, y:1})).toBe(false);
    
    expect(gameboard.receiveAttack({x:5, y:3})).toBe('hit');
    expect(gameboard.receiveAttack({x:5, y:3})).toBe(false);

    const mockGrid = create2DArray(10, null);
    mockGrid[1][1] = 'miss';
    mockGrid[5][3] = 'hit';

    expect(ship.isSunk()).toBe(false);
    expect(gameboard.getGrid()).toEqual(mockGrid);
  });

  test('with sinking', () => {
    const gameboard = createGameboard();
    const ship = createShip(2);
    gameboard.placeShip(ship, {x: 5, y: 3}, 'vertical');
    gameboard.receiveAttack({x: 5, y: 3});
    gameboard.receiveAttack({x: 5, y: 4});

    const mockGrid = create2DArray(10, null);
    mockGrid[4][2] = 'miss'; mockGrid[5][2] = 'miss'; mockGrid[6][2] = 'miss';
    mockGrid[4][3] = 'miss'; mockGrid[5][3] = 'hit';  mockGrid[6][3] = 'miss';
    mockGrid[4][4] = 'miss'; mockGrid[5][4] = 'hit';  mockGrid[6][4] = 'miss';
    mockGrid[4][5] = 'miss'; mockGrid[5][5] = 'miss'; mockGrid[6][5] = 'miss';

    expect(ship.isSunk()).toBe(true);
    expect(gameboard.getGrid()).toEqual(mockGrid);
  });

  test('invalid coords', () => {
    const gameboard = createGameboard();
    expect(gameboard.receiveAttack({x:50, y:2})).toBe(false);
    expect(gameboard.receiveAttack({x:6, y:-23})).toBe(false);
    expect(gameboard.receiveAttack({x:2.42, y:3})).toBe(false);

    const mockGrid = create2DArray(10, null);

    expect(gameboard.getGrid()).toEqual(mockGrid);
  })
});
