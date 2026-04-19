import { describe, it, expect } from 'vitest';
import { Grid } from '../src/systems/Grid.js';

describe('Grid', () => {
  it('creates a 5x5 grid with all cells empty by default', () => {
    const g = new Grid();
    expect(g.rows).toBe(5);
    expect(g.cols).toBe(5);
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        expect(g.get(r, c)).toBeNull();
      }
    }
  });

  it('set + get returns the same hero', () => {
    const g = new Grid();
    const hero = { id: 'fire-sword' };
    g.set(0, 0, hero);
    expect(g.get(0, 0)).toBe(hero);
  });

  it('isEmpty reflects cell state', () => {
    const g = new Grid();
    expect(g.isEmpty(2, 2)).toBe(true);
    g.set(2, 2, { id: 'x' });
    expect(g.isEmpty(2, 2)).toBe(false);
  });

  it('isInBounds checks row/col are valid', () => {
    const g = new Grid();
    expect(g.isInBounds(0, 0)).toBe(true);
    expect(g.isInBounds(4, 4)).toBe(true);
    expect(g.isInBounds(-1, 0)).toBe(false);
    expect(g.isInBounds(5, 0)).toBe(false);
    expect(g.isInBounds(0, -1)).toBe(false);
    expect(g.isInBounds(0, 5)).toBe(false);
  });

  it('clear(r,c) empties a cell', () => {
    const g = new Grid();
    g.set(1, 1, { id: 'x' });
    g.clear(1, 1);
    expect(g.get(1, 1)).toBeNull();
  });

  it('forEachCell iterates all 25 cells in row-major order', () => {
    const g = new Grid();
    const visited = [];
    g.forEachCell((r, c, hero) => visited.push([r, c, hero]));
    expect(visited).toHaveLength(25);
    expect(visited[0]).toEqual([0, 0, null]);
    expect(visited[24]).toEqual([4, 4, null]);
  });
});
