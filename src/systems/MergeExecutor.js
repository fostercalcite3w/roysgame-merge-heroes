import { MERGE } from '../data/balance.js';

/**
 * 執行合成：清空群組所有格，中心格放升階英雄。
 * 中心格 = 群組中座標平均位置最近的格子。
 * 升階英雄：保留共同屬性，另一屬性從群組中隨機挑一。
 */
export function executeMerge(grid, group, { rng = Math.random } = {}) {
  const size = group.cells.size;
  const tier = MERGE.groupSizeToTier[Math.min(size, MERGE.maxGroup)];
  if (!tier) throw new Error(`invalid group size ${size}`);

  const heroes = [];
  let sumR = 0, sumC = 0;
  for (const key of group.cells) {
    const [r, c] = key.split(',').map(Number);
    heroes.push(grid.get(r, c));
    sumR += r; sumC += c;
  }
  const avgR = sumR / size, avgC = sumC / size;

  let centerKey, centerDist = Infinity;
  for (const key of group.cells) {
    const [r, c] = key.split(',').map(Number);
    const d = (r - avgR) ** 2 + (c - avgC) ** 2;
    if (d < centerDist) { centerDist = d; centerKey = key; }
  }
  const [cr, cc] = centerKey.split(',').map(Number);

  for (const key of group.cells) {
    const [r, c] = key.split(',').map(Number);
    grid.clear(r, c);
  }

  const { type, value } = group.attribute;
  const otherAttr = type === 'attack_class' ? 'element' : 'attack_class';
  const otherValues = heroes.map((h) => h[otherAttr]);
  const otherPick = otherValues[Math.floor(rng() * otherValues.length)];

  const attackClass = type === 'attack_class' ? value : otherPick;
  const element = type === 'element' ? value : otherPick;
  const mergedHero = {
    id: `${element}-${attackClass}-${tier}`,
    attack_class: attackClass,
    element,
    tier,
    position: { row: cr, col: cc },
  };
  grid.set(cr, cc, mergedHero);

  return { placedAt: { row: cr, col: cc }, tier, hero: mergedHero };
}
