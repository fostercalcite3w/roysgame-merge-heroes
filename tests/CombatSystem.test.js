import { describe, it, expect, beforeEach } from 'vitest';
import { CombatSystem } from '../src/systems/CombatSystem.js';
import { Grid } from '../src/systems/Grid.js';

function makeState(heroes = [], monsters = []) {
  const grid = new Grid();
  for (const h of heroes) grid.set(h.position.row, h.position.col, h);
  return { grid, monsters: [...monsters], nowMs: 0 };
}

function hero(row, col, tier = 'base', cls = 'sword', ele = 'fire') {
  return { id: `h-${row}-${col}`, attack_class: cls, element: ele, tier, position: { row, col }, stun_until: 0 };
}

function monster(id, row, col, hp = 10, attack = 2, speed = 1) {
  return { id, type: 'slime', hp, maxHp: hp, attack, speed, edge: 'top', position: { row, col }, stun_until: 0 };
}

describe('CombatSystem', () => {
  let cs;
  beforeEach(() => { cs = new CombatSystem(); });

  it('hero shoots nearest monster every interval', () => {
    const state = makeState([hero(4, 0)], [monster('m1', 0, 0, 10)]);
    const res = cs.tick(state, 1500);
    expect(res.hits.length).toBe(1);
    expect(res.hits[0].damage).toBe(10);
    expect(res.hits[0].monsterId).toBe('m1');
    expect(state.monsters[0].hp).toBe(0);
  });

  it('dead monsters get removed from state', () => {
    const state = makeState([hero(4, 0)], [monster('m1', 0, 0, 10)]);
    cs.tick(state, 1500);
    const res2 = cs.tick(state, 1);
    expect(state.monsters).toHaveLength(0);
    expect(res2.kills).toContain('m1');
  });

  it('tier epic deals 20 damage (2 × 10)', () => {
    const h = hero(4, 0, 'epic');
    const state = makeState([h], [monster('m1', 0, 0, 40)]);
    cs.tick(state, 1500);
    expect(state.monsters[0].hp).toBe(20);
  });

  it('stunned hero does not attack', () => {
    const h = hero(4, 0);
    h.stun_until = 5000;
    const state = makeState([h], [monster('m1', 0, 0, 10)]);
    state.nowMs = 100;
    cs.tick(state, 1500);
    expect(state.monsters[0].hp).toBe(10);
  });

  it('monster sharing hero cell stuns hero', () => {
    const h = hero(4, 0);
    const state = makeState([h], [monster('m1', 4, 0, 10)]);
    const res = cs.tick(state, 1000);
    expect(res.stuns.length).toBeGreaterThanOrEqual(1);
    expect(h.stun_until).toBeGreaterThan(0);
  });

  it('no heroes = no attacks', () => {
    const state = makeState([], [monster('m1', 0, 0, 10)]);
    const res = cs.tick(state, 1500);
    expect(res.hits).toEqual([]);
  });

  it('no monsters = no attacks', () => {
    const state = makeState([hero(4, 0)], []);
    const res = cs.tick(state, 1500);
    expect(res.hits).toEqual([]);
  });

  it('distance-based nearest target selection', () => {
    const state = makeState(
      [hero(4, 2)],
      [monster('far', 0, 0, 10), monster('near', 3, 2, 10)],
    );
    cs.tick(state, 1500);
    const near = state.monsters.find((m) => m.id === 'near');
    const far = state.monsters.find((m) => m.id === 'far');
    expect(near.hp).toBe(0);
    expect(far.hp).toBe(10);
  });
});
