import { GRID } from '../data/balance.js';

export function generateInitialHeroes(grid, heroPool, { rng = Math.random, maxRetries = 1000 } = {}) {
  if (!heroPool.length) throw new Error('heroPool empty');

  const heroRows = GRID.heroRows;
  const positions = [];
  for (const r of heroRows) {
    for (let c = 0; c < grid.cols; c++) positions.push([r, c]);
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    for (const [r, c] of positions) grid.clear(r, c);

    let ok = true;
    for (const [r, c] of positions) {
      const shuffled = [...heroPool].sort(() => rng() - 0.5);
      let placed = false;
      for (const hero of shuffled) {
        grid.set(r, c, { ...hero, position: { row: r, col: c } });
        if (!wouldFormMatch(grid, r, c)) {
          placed = true;
          break;
        }
        grid.clear(r, c);
      }
      if (!placed) { ok = false; break; }
    }
    if (ok) return;
  }
  throw new Error('無法在 maxRetries 內找到合法初始佈局');
}

function wouldFormMatch(grid, r, c) {
  const hero = grid.get(r, c);
  if (!hero) return false;
  for (const attr of ['attack_class', 'element']) {
    if (countAdjacentSameAttr(grid, r, c, attr, hero[attr]) >= 3) return true;
  }
  return false;
}

function countAdjacentSameAttr(grid, r, c, attr, value) {
  const visited = new Set([`${r},${c}`]);
  const queue = [[r, c]];
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  let count = 0;
  while (queue.length) {
    const [cr, cc] = queue.shift();
    const cur = grid.get(cr, cc);
    if (!cur || cur[attr] !== value) continue;
    count += 1;
    for (const [dr, dc] of dirs) {
      const nr = cr + dr, nc = cc + dc;
      const k = `${nr},${nc}`;
      if (visited.has(k)) continue;
      visited.add(k);
      queue.push([nr, nc]);
    }
  }
  return count;
}
