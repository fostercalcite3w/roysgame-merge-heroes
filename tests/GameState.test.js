import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../src/systems/GameState.js';
import { Grid } from '../src/systems/Grid.js';

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hero(cls, ele, tier = 'base') {
  return { id: `${ele}-${cls}`, attack_class: cls, element: ele, tier };
}

describe('GameState', () => {
  let gs;
  beforeEach(() => {
    gs = new GameState({ rng: mulberry32(42) });
    gs.start();
  });

  it('start() fills bottom 2 rows with 10 heroes', () => {
    let count = 0;
    gs.grid.forEachCell((r, c, h) => { if (h) count++; });
    expect(count).toBe(10);
  });

  it('has wave=1, castle hp=500, no monsters, no selection at start', () => {
    expect(gs.wave).toBe(1);
    expect(gs.castle.hp).toBe(500);
    expect(gs.monsters).toEqual([]);
    expect(gs.selection).toBeNull();
    expect(gs.phase).toBe('playing');
  });

  it('cursor defaults inside grid', () => {
    expect(gs.cursor.row).toBeGreaterThanOrEqual(0);
    expect(gs.cursor.row).toBeLessThan(5);
    expect(gs.cursor.col).toBeGreaterThanOrEqual(0);
    expect(gs.cursor.col).toBeLessThan(5);
  });

  it('moveCursor clamps to grid bounds', () => {
    gs.cursor = { row: 0, col: 0 };
    gs.moveCursor(-1, -1);
    expect(gs.cursor).toEqual({ row: 0, col: 0 });
    gs.cursor = { row: 4, col: 4 };
    gs.moveCursor(1, 1);
    expect(gs.cursor).toEqual({ row: 4, col: 4 });
    gs.cursor = { row: 2, col: 2 };
    gs.moveCursor(-1, 0);
    expect(gs.cursor).toEqual({ row: 1, col: 2 });
  });

  it('selectAtCursor picks hero if cursor on hero', () => {
    gs.cursor = { row: 4, col: 0 };
    gs.selectAtCursor();
    expect(gs.selection).toEqual({ row: 4, col: 0 });
  });

  it('selectAtCursor no-op if cursor on empty', () => {
    gs.cursor = { row: 0, col: 0 };
    gs.selectAtCursor();
    expect(gs.selection).toBeNull();
  });

  it('attemptMove moves hero to empty adjacent cell and increments step', () => {
    gs.selection = { row: 4, col: 0 };
    const heroBefore = gs.grid.get(4, 0);
    gs.grid.clear(3, 0);
    const result = gs.attemptMove(-1, 0);
    expect(result.moved).toBe(true);
    expect(gs.grid.get(3, 0)).toBe(heroBefore);
    expect(gs.grid.get(4, 0)).toBeNull();
    expect(gs.selection).toEqual({ row: 3, col: 0 });
    expect(gs.stepCounter.count).toBe(1);
  });

  it('attemptMove swaps with adjacent hero', () => {
    gs.selection = { row: 4, col: 0 };
    const a = gs.grid.get(4, 0);
    const b = gs.grid.get(4, 1);
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
    const result = gs.attemptMove(0, 1);
    expect(result.moved).toBe(true);
    expect(gs.grid.get(4, 0)).toBe(b);
    expect(gs.grid.get(4, 1)).toBe(a);
    expect(gs.selection).toEqual({ row: 4, col: 1 });
  });

  it('attemptMove returns {moved:false} when out of bounds', () => {
    gs.selection = { row: 4, col: 0 };
    const result = gs.attemptMove(0, -1);
    expect(result.moved).toBe(false);
    expect(gs.stepCounter.count).toBe(0);
  });

  it('attemptMove returns {moved:false} when no selection', () => {
    gs.selection = null;
    const result = gs.attemptMove(1, 0);
    expect(result.moved).toBe(false);
  });

  it('attemptMove sets triggered=true every 5th step', () => {
    gs.grid.clear(3, 0);
    gs.grid.clear(2, 0);
    gs.grid.clear(1, 0);
    gs.grid.clear(0, 0);
    gs.selection = { row: 4, col: 0 };
    for (let i = 0; i < 4; i++) {
      const r = gs.attemptMove(-1, 0);
      expect(r.triggered).toBe(false);
    }
    const r5 = gs.attemptMove(0, 1);
    expect(r5.moved).toBe(true);
    expect(r5.triggered).toBe(true);
    expect(gs.stepCounter.count).toBe(0);
  });

  it('processMerges runs until no more groups', () => {
    gs.grid = new Grid();
    gs.grid.set(4, 0, hero('sword', 'fire'));
    gs.grid.set(4, 1, hero('sword', 'water'));
    gs.grid.set(4, 2, hero('sword', 'grass'));
    const merges = gs.processMerges();
    expect(merges.length).toBeGreaterThanOrEqual(1);
    const center = gs.grid.get(4, 1);
    expect(center).toBeTruthy();
    expect(center.tier).toBe('epic');
    expect(center.attack_class).toBe('sword');
  });

  it('spawnNextWave adds monsters and increments wave', () => {
    gs.spawnNextWave();
    expect(gs.monsters.length).toBeGreaterThan(0);
    expect(gs.wave).toBe(2);
    for (const m of gs.monsters) {
      expect(['top', 'left', 'right']).toContain(m.edge);
    }
  });

  it('phase becomes gameover when castle defeated', () => {
    gs.castle.damage(500);
    gs.checkGameOver();
    expect(gs.phase).toBe('gameover');
  });
});
