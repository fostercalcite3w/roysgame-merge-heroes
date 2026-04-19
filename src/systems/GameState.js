import { Grid } from './Grid.js';
import { Castle } from './Castle.js';
import { StepCounter } from './StepCounter.js';
import { generateInitialHeroes } from './initialSpawn.js';
import { findMergeGroups } from './MergeDetector.js';
import { executeMerge } from './MergeExecutor.js';
import { spawnWave } from './MonsterSpawner.js';
import { BASE_HEROES } from '../data/heroes.js';
import { getWave } from '../data/waves.js';

export class GameState {
  constructor({ rng = Math.random } = {}) {
    this.rng = rng;
    this.grid = new Grid();
    this.castle = new Castle();
    this.stepCounter = new StepCounter();
    this.wave = 1;
    this.monsters = [];
    this.selection = null;
    this.cursor = { row: 4, col: 2 };
    this.phase = 'playing';
    this.nowMs = 0;
    this.monsterStepMs = {};
  }

  start() {
    generateInitialHeroes(this.grid, BASE_HEROES, { rng: this.rng });
  }

  moveCursor(dr, dc) {
    const nr = clamp(this.cursor.row + dr, 0, this.grid.rows - 1);
    const nc = clamp(this.cursor.col + dc, 0, this.grid.cols - 1);
    this.cursor = { row: nr, col: nc };
  }

  selectAtCursor() {
    const h = this.grid.get(this.cursor.row, this.cursor.col);
    if (h) this.selection = { row: this.cursor.row, col: this.cursor.col };
  }

  selectAt(row, col) {
    const h = this.grid.get(row, col);
    if (h) {
      this.selection = { row, col };
      this.cursor = { row, col };
      return true;
    }
    return false;
  }

  deselect() {
    this.selection = null;
  }

  attemptMove(dr, dc) {
    if (!this.selection) return { moved: false, triggered: false, merges: [] };
    const fr = this.selection.row, fc = this.selection.col;
    const tr = fr + dr, tc = fc + dc;
    if (!this.grid.isInBounds(tr, tc)) {
      return { moved: false, triggered: false, merges: [] };
    }
    const a = this.grid.get(fr, fc);
    if (!a) return { moved: false, triggered: false, merges: [] };
    const b = this.grid.get(tr, tc);
    this.grid.set(fr, fc, b);
    this.grid.set(tr, tc, a);
    if (a.position) a.position = { row: tr, col: tc };
    if (b && b.position) b.position = { row: fr, col: fc };
    this.selection = { row: tr, col: tc };
    this.cursor = { row: tr, col: tc };

    const triggered = this.stepCounter.increment();
    const merges = this.processMerges();
    return { moved: true, triggered, merges };
  }

  processMerges() {
    const out = [];
    let guard = 0;
    while (guard++ < 20) {
      const groups = findMergeGroups(this.grid);
      if (groups.length === 0) break;
      const group = groups[0];
      const result = executeMerge(this.grid, group, { rng: this.rng });
      out.push({ group, result });
    }
    return out;
  }

  spawnNextWave() {
    const w = getWave(this.wave);
    const monsters = spawnWave({
      wave: w.wave,
      count: w.count,
      pool: w.pool,
      rng: this.rng,
    });
    this.monsters.push(...monsters);
    this.wave += 1;
  }

  checkGameOver() {
    if (this.castle.isDefeated()) {
      this.phase = 'gameover';
    }
  }

  // Task 10 接怪物移動 — 暫留簽名
  tickMonsters(dtMs) {
    return { damaged: [], removed: [] };
  }

  // Task 11 接戰鬥 — 暫留簽名
  tickCombat(dtMs) {
    return { hits: [], kills: [], stuns: [] };
  }

  _bumpNow(dtMs) {
    this.nowMs = (this.nowMs || 0) + dtMs;
  }
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
