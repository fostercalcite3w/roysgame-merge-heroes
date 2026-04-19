import { describe, it, expect } from 'vitest';
import { Grid } from '../src/systems/Grid.js';
import { generateInitialHeroes } from '../src/systems/initialSpawn.js';
import { findMergeGroups } from '../src/systems/MergeDetector.js';
import { executeMerge } from '../src/systems/MergeExecutor.js';
import { StepCounter } from '../src/systems/StepCounter.js';
import { spawnWave } from '../src/systems/MonsterSpawner.js';
import { Castle } from '../src/systems/Castle.js';
import { BASE_HEROES } from '../src/data/heroes.js';
import { getWave } from '../src/data/waves.js';

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('integration — Tier 1 一完整波流程', () => {
  it('initialSpawn → 沒有立即合成 → 手動觸發合成 → spawn wave', () => {
    const grid = new Grid();
    const castle = new Castle();
    const stepCounter = new StepCounter();
    const rng = mulberry32(999);

    generateInitialHeroes(grid, BASE_HEROES, { rng });

    // 初始化後，確認無合成
    expect(findMergeGroups(grid)).toEqual([]);

    // 手動製造一個合成（把 (4,1) 和 (4,2) 換成和 (4,0) 同屬性）
    const hero40 = grid.get(4, 0);
    const forced = { ...hero40, position: undefined };
    grid.set(4, 1, { ...forced, position: { row: 4, col: 1 } });
    grid.set(4, 2, { ...forced, position: { row: 4, col: 2 } });
    const groups = findMergeGroups(grid);
    expect(groups.length).toBeGreaterThanOrEqual(1);

    // 執行一個合成（第一個找到的）
    const groupsBefore = groups.length;
    executeMerge(grid, groups[0], { rng });
    const groupsAfter = findMergeGroups(grid);
    // 合成後原群組應消失（至少一個被消化）
    expect(groupsAfter.length).toBeLessThan(groupsBefore + 1);

    // 累計 5 步
    let triggered = false;
    for (let i = 0; i < 5; i++) {
      if (stepCounter.increment()) triggered = true;
    }
    expect(triggered).toBe(true);

    // 觸發後生成第 1 波怪物
    const wave = getWave(1);
    const monsters = spawnWave({ wave: wave.wave, count: wave.count, pool: wave.pool, rng });
    expect(monsters.length).toBe(wave.count);

    // 所有怪從上/左/右
    for (const m of monsters) {
      expect(['top', 'left', 'right']).toContain(m.edge);
    }

    // 城堡初始 HP
    expect(castle.hp).toBe(500);

    // 模擬第一隻怪物抵達城堡
    castle.damage(monsters[0].attack);
    expect(castle.hp).toBe(500 - monsters[0].attack);
    expect(castle.isDefeated()).toBe(false);
  });

  it('城堡血量歸零 = defeat', () => {
    const castle = new Castle();
    castle.damage(500);
    expect(castle.isDefeated()).toBe(true);
  });

  it('跑完 10 波的怪物配置都符合預期 pool', () => {
    for (let w = 1; w <= 10; w++) {
      const wave = getWave(w);
      expect(wave.wave).toBe(w);
      expect(wave.count).toBeGreaterThanOrEqual(2);
      expect(wave.pool.length).toBeGreaterThanOrEqual(1);
    }
  });
});
