const { describe, test, expect } = require('@jest/globals')
const createShip = require('./createShip')

// since ship will not expose their coordinates,  to check whether
// a ship was placed correctly, we need to hit it 
describe('hit ships', () => {
  test('single block ship', () => {
    const ship = createShip({ x: 5, y: 3 }, 1, 'vertical');
    expect(ship.hit({ x: 4, y: 3 })).toBeFalsy();
    expect(ship.hit({ x: 4, y: 4 })).toBeFalsy();
    expect(ship.hit({ x: 5, y: 3 })).toBeTruthy();
  });

  test('vertical multiple block ship', () => {
    const ship = createShip({ x: 5, y: 3 }, 3, 'vertical');
    expect(ship.hit({ x: 5, y: 4 })).toBeTruthy();
    expect(ship.hit({ x: 5, y: 5 })).toBeTruthy();
    expect(ship.hit({ x: 5, y: 3 })).toBeTruthy();
    expect(ship.hit({ x: 5, y: 2 })).toBeFalsy();
  });

  test('horizontal multiple block ship', () => {
    const ship = createShip({ x: 5, y: 3 }, 4, 'horizontal');
    expect(ship.hit({ x: 5, y: 3 })).toBeTruthy();
    expect(ship.hit({ x: 6, y: 3 })).toBeTruthy();
    expect(ship.hit({ x: 7, y: 3 })).toBeTruthy();
    expect(ship.hit({ x: 8, y: 3 })).toBeTruthy();
    expect(ship.hit({ x: 5, y: 4 })).toBeFalsy();
    expect(ship.hit({ x: 4, y: 3 })).toBeFalsy();
  });

  
  test('ship position omitted', () => {
    const ship = createShip({ x: 5, y: 3 }, 2);
    expect(ship.hit({ x: 5, y: 3 })).toBeTruthy();
    expect(ship.hit({ x: 6, y: 3 })).toBeTruthy();
    expect(ship.hit({ x: 5, y: 4 })).toBeFalsy();
    expect(ship.hit({ x: 5, y: 4 })).toBeFalsy();
  });
  
})


describe('sink ships', () => {
  test('single block ship', () => {
    const ship = createShip({ x: 5, y: 3 }, 1, 'vertical');
    expect(ship.isSunk()).toBeFalsy();
    ship.hit({ x: 5, y: 3 })
    expect(ship.isSunk()).toBeTruthy();
  });

  test('vertical multiple block ship', () => {
    const ship = createShip({ x: 5, y: 3 }, 3, 'vertical');
    expect(ship.isSunk()).toBeFalsy();
    ship.hit({ x: 5, y: 4 })
    expect(ship.isSunk()).toBeFalsy();
    ship.hit({ x: 5, y: 5 })
    expect(ship.isSunk()).toBeFalsy();
    ship.hit({ x: 5, y: 3 })
    expect(ship.isSunk()).toBeTruthy();    
  });

  test('horizontal multiple block ship', () => {
    const ship = createShip({ x: 5, y: 3 }, 3, 'horizontal');
    expect(ship.isSunk()).toBeFalsy();
    ship.hit({ x: 5, y: 3 })
    expect(ship.isSunk()).toBeFalsy();
    ship.hit({ x: 6, y: 3 })
    expect(ship.isSunk()).toBeFalsy();
    ship.hit({ x: 7, y: 3 })
    expect(ship.isSunk()).toBeTruthy();
  });
})

