import { SPAWN, GRID } from '../data/balance.js';
import { MONSTER_TYPES } from '../data/monsters.js';

let monsterIdCounter = 0;

export function spawnWave({ wave, count, pool, rng = Math.random }) {
  const monsters = [];
  for (let i = 0; i < count; i++) {
    const edge = SPAWN.edges[Math.floor(rng() * SPAWN.edges.length)];
    const typeId = pool[Math.floor(rng() * pool.length)];
    const def = MONSTER_TYPES[typeId];
    if (!def) throw new Error(`unknown monster type: ${typeId}`);

    let position;
    if (edge === 'top') {
      position = { row: -1, col: Math.floor(rng() * GRID.cols) };
    } else if (edge === 'left') {
      position = { row: Math.floor(rng() * GRID.rows), col: -1 };
    } else {
      position = { row: Math.floor(rng() * GRID.rows), col: GRID.cols };
    }

    monsters.push({
      id: `monster-${++monsterIdCounter}`,
      type: typeId,
      hp: def.hp,
      maxHp: def.hp,
      attack: def.attack,
      speed: def.speed,
      reward: def.reward,
      edge,
      position,
      wave,
    });
  }
  return monsters;
}
