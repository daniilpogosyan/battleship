const { describe, test, expect } = require('@jest/globals')
const createShip = require('./createShip')

describe('create ships', () => {
  test.each([1, 2, 3, 4])('valid length',(length) => {
    expect(createShip(length).length).toBe(length)
  });

  test.each([0, -4, 3.5, -0.2])('invalid length',(length) => {
    expect(() => createShip(length)).toThrowError('Invalid ship length')
  });
})

describe('hit ships', () => {
  test('hit', () => {
    const ship = createShip(3);
    expect(ship.hit(0)).toBe(true);
    expect(ship.hit(1)).toBe(true);
    expect(ship.hit(2)).toBe(true);
  });

  test('with some missing shots', () => {
    const ship = createShip(3);
    expect(ship.hit(-1)).toBe(false);
    expect(ship.hit(0)).toBe(true);
    expect(ship.hit(1)).toBe(true);
    expect(ship.hit(2)).toBe(true);
    expect(ship.hit(3)).toBe(false);
  });

  test('with repeatitions', () => {
    const ship = createShip(3);
    expect(ship.hit(0)).toBe(true);
    expect(ship.hit(1)).toBe(true);
    expect(ship.hit(1)).toBe(false);
    expect(ship.hit(2)).toBe(true);
  });  
  
})


describe('sink ships', () => {
  test.each([1,2,3,4])('all hit', (length) => {
    const ship = createShip(length)
    for (let i = 0; i < length; i++) {
      expect(ship.isSunk()).toBe(false)
      ship.hit(i);
    }
    expect(ship.isSunk()).toBe(true)
  });
})

