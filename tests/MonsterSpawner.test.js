import { describe, it, expect } from 'vitest';
import { spawnWave } from '../src/systems/MonsterSpawner.js';

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('spawnWave', () => {
  it('produces the requested count of monsters', () => {
    const monsters = spawnWave({ wave: 1, count: 3, pool: ['slime'], rng: mulberry32(1) });
    expect(monsters).toHaveLength(3);
  });

  it('all monsters come from edge top/left/right (never bottom)', () => {
    const monsters = spawnWave({ wave: 1, count: 100, pool: ['slime'], rng: mulberry32(42) });
    for (const m of monsters) {
      expect(['top', 'left', 'right']).toContain(m.edge);
    }
  });

  it('spawn positions are outside grid on the matching edge', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const monsters = spawnWave({ wave: 1, count: 10, pool: ['slime'], rng: mulberry32(seed) });
      for (const m of monsters) {
        if (m.edge === 'top')   expect(m.position).toEqual({ row: -1, col: expect.any(Number) });
        if (m.edge === 'left')  expect(m.position).toEqual({ row: expect.any(Number), col: -1 });
        if (m.edge === 'right') expect(m.position).toEqual({ row: expect.any(Number), col: 5 });
      }
    }
  });

  it('assigns hp/attack/speed from monster type', () => {
    const monsters = spawnWave({ wave: 1, count: 1, pool: ['slime'], rng: mulberry32(1) });
    const m = monsters[0];
    expect(m.type).toBe('slime');
    expect(m.hp).toBe(10);
    expect(m.maxHp).toBe(10);
    expect(m.attack).toBe(2);
    expect(m.speed).toBe(1);
  });

  it('picks from pool randomly', () => {
    const monsters = spawnWave({ wave: 1, count: 50, pool: ['slime', 'orc'], rng: mulberry32(7) });
    const types = new Set(monsters.map((m) => m.type));
    expect(types.size).toBe(2);
  });
});
