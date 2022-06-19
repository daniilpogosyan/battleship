const { describe, test, expect } = require('@jest/globals');
const createPlayer = require('./createPlayer');


test("get player's name", () => {
  const player = createPlayer('John Doe', null)
  expect(player.getName()).toBe('John Doe')
});

describe('attack', () => {
  const createMockGameboard = () => ({
    grid: [
      [null, 'ship', null, 'miss'],
      [null, 'ship', null, 'miss'],
      ['miss', null, null, 'miss'],
      ['miss', 'hit', null, null]
    ],
    receiveAttack: jest.fn(function(coords) {
      if (this.grid[coords.x]?.[coords.y] === null) {
          this.grid[coords.x][coords.y] = 'miss'
          return true
      }
      return false
    }),
    getGrid: function() {return this.grid}
  })

  test('specific cell', () => {
    const mockGameboard = createMockGameboard();
    const player = createPlayer('username', mockGameboard);
    const target = {x: 1, y: 2};
    const nullBefore =
      mockGameboard.getGrid()[target.x][target.y] === null;
    expect(player.attack(target)).toBe(true);
    const missAfter = 
      mockGameboard.getGrid()[target.x][target.y] === 'miss';
    expect(nullBefore && missAfter).toBe(true);
  });
  
  test("attack random available cells", () => {
    const mockGameboard = createMockGameboard();
    const numsOfNull = mockGameboard.getGrid().reduce((nulls, row) => 
      nulls + row.reduce((rowNulls, val) => val === null ? rowNulls + 1: rowNulls, 0), 0);
    const player = createPlayer('username', mockGameboard);
    
    while(mockGameboard.receiveAttack.mock.calls.length < numsOfNull) {
      expect(player.attack()).toBe(true);
    }
    expect(mockGameboard.getGrid().some(row => row.some(val => val === null))).toBe(false);
  })
})