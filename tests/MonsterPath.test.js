import { describe, it, expect } from 'vitest';
import { nextCell, hasReachedCastle } from '../src/systems/MonsterPath.js';
import { Grid } from '../src/systems/Grid.js';

function monster(row, col, edge) {
  return { id: 'm1', edge, position: { row, col } };
}

describe('MonsterPath', () => {
  it('top edge monster moves down one row', () => {
    const g = new Grid();
    expect(nextCell(monster(-1, 2, 'top'), g)).toEqual({ row: 0, col: 2 });
    expect(nextCell(monster(2, 2, 'top'), g)).toEqual({ row: 3, col: 2 });
  });

  it('left edge moves right until col=2 then down', () => {
    const g = new Grid();
    expect(nextCell(monster(2, -1, 'left'), g)).toEqual({ row: 2, col: 0 });
    expect(nextCell(monster(2, 0, 'left'), g)).toEqual({ row: 2, col: 1 });
    expect(nextCell(monster(2, 1, 'left'), g)).toEqual({ row: 2, col: 2 });
    expect(nextCell(monster(2, 2, 'left'), g)).toEqual({ row: 3, col: 2 });
  });

  it('right edge moves left until col=2 then down', () => {
    const g = new Grid();
    expect(nextCell(monster(1, 5, 'right'), g)).toEqual({ row: 1, col: 4 });
    expect(nextCell(monster(1, 3, 'right'), g)).toEqual({ row: 1, col: 2 });
    expect(nextCell(monster(1, 2, 'right'), g)).toEqual({ row: 2, col: 2 });
  });

  it('monster blocked by hero stays in place', () => {
    const g = new Grid();
    g.set(0, 2, { id: 'h', attack_class: 'sword', element: 'fire', tier: 'base' });
    expect(nextCell(monster(-1, 2, 'top'), g)).toEqual({ row: -1, col: 2 });
  });

  it('hasReachedCastle true when row >= 5', () => {
    expect(hasReachedCastle(monster(5, 2, 'top'))).toBe(true);
    expect(hasReachedCastle(monster(6, 2, 'top'))).toBe(true);
    expect(hasReachedCastle(monster(4, 2, 'top'))).toBe(false);
  });
});
