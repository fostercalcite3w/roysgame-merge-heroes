import { SPAWN } from './balance.js';

// 10 波 demo 配置：每波指定怪物類型池
export const WAVES = [
  { wave: 1, pool: ['slime'], count: SPAWN.monstersPerWave(1) },
  { wave: 2, pool: ['slime'], count: SPAWN.monstersPerWave(2) },
  { wave: 3, pool: ['slime', 'goblin'], count: SPAWN.monstersPerWave(3) },
  { wave: 4, pool: ['slime', 'goblin'], count: SPAWN.monstersPerWave(4) },
  { wave: 5, pool: ['goblin'], count: SPAWN.monstersPerWave(5) },
  { wave: 6, pool: ['goblin', 'orc'], count: SPAWN.monstersPerWave(6) },
  { wave: 7, pool: ['goblin', 'orc'], count: SPAWN.monstersPerWave(7) },
  { wave: 8, pool: ['orc'], count: SPAWN.monstersPerWave(8) },
  { wave: 9, pool: ['orc'], count: SPAWN.monstersPerWave(9) },
  { wave: 10, pool: ['orc'], count: SPAWN.monstersPerWave(10) },
];

export function getWave(n) {
  return WAVES[n - 1] ?? WAVES[WAVES.length - 1];
}
