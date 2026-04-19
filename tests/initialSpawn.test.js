import { describe, it, expect } from 'vitest';
import { generateInitialHeroes } from '../src/systems/initialSpawn.js';
import { Grid } from '../src/systems/Grid.js';
import { BASE_HEROES } from '../src/data/heroes.js';

function findAdjacentSameAttribute(grid) {
  const visited = new Set();
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const h = grid.get(r, c);
      if (!h) continue;
      for (const attr of ['attack_class', 'element']) {
        const key = `${r},${c},${attr}`;
        if (visited.has(key)) continue;
        const group = [];
        const queue = [[r, c]];
        const seen = new Set([`${r},${c}`]);
        while (queue.length) {
          const [cr, cc] = queue.shift();
          const cur = grid.get(cr, cc);
          if (!cur || cur[attr] !== h[attr]) continue;
          group.push([cr, cc]);
          visited.add(`${cr},${cc},${attr}`);
          for (const [dr, dc] of dirs) {
            const nr = cr + dr, nc = cc + dc;
            const k = `${nr},${nc}`;
            if (seen.has(k)) continue;
            seen.add(k);
            queue.push([nr, nc]);
          }
        }
        if (group.length >= 3) return { attr, group };
      }
    }
  }
  return null;
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('generateInitialHeroes', () => {
  it('fills bottom 2 rows (rows 3 and 4) with 10 heroes', () => {
    const g = new Grid();
    generateInitialHeroes(g, BASE_HEROES);
    let count = 0;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (g.get(r, c)) {
          count += 1;
          expect([3, 4]).toContain(r);
        }
      }
    }
    expect(count).toBe(10);
  });

  it('never creates an initial 3+ adjacent same-attribute group (seeded)', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const g = new Grid();
      const rng = mulberry32(seed);
      generateInitialHeroes(g, BASE_HEROES, { rng });
      const match = findAdjacentSameAttribute(g);
      expect(match, `seed ${seed} produced match ${JSON.stringify(match)}`).toBeNull();
    }
  });

  it('throws if heroPool empty', () => {
    const g = new Grid();
    expect(() => generateInitialHeroes(g, [])).toThrow();
  });
});
