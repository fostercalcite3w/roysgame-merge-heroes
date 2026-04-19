import { MERGE } from '../data/balance.js';

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const ATTRS = ['attack_class', 'element'];

/**
 * 找出所有 size >= MERGE.minGroup 的同屬性相鄰群組。
 * 回傳：[{ attribute: {type, value}, cells: Set<"r,c"> }]
 *
 * 每 attribute 獨立掃一遍；每次 BFS 只針對單一 (attr, value) 連通成分，
 * 並用自己內部的 visited 避免重覆走過已探索過的格子。
 * 外層用 groupedCells 避免同一群組從其他起點再被重新發現。
 */
export function findMergeGroups(grid) {
  const groups = [];
  for (const attr of ATTRS) {
    const groupedCells = new Set();
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const key = `${r},${c}`;
        if (groupedCells.has(key)) continue;
        const hero = grid.get(r, c);
        if (!hero) continue;
        const group = bfs(grid, r, c, attr, hero[attr]);
        if (group.size >= MERGE.minGroup) {
          for (const k of group) groupedCells.add(k);
          groups.push({
            attribute: { type: attr, value: hero[attr] },
            cells: group,
          });
        }
      }
    }
  }
  return groups;
}

function bfs(grid, startR, startC, attr, value) {
  const group = new Set();
  const visited = new Set();
  const queue = [[startR, startC]];
  while (queue.length) {
    const [r, c] = queue.shift();
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);
    const hero = grid.get(r, c);
    if (!hero || hero[attr] !== value) continue;
    group.add(key);
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (!grid.isInBounds(nr, nc)) continue;
      if (visited.has(`${nr},${nc}`)) continue;
      queue.push([nr, nc]);
    }
  }
  return group;
}
