import { describe, it, expect } from 'vitest';
import { Castle } from '../src/systems/Castle.js';

describe('Castle', () => {
  it('starts at max hp 500', () => {
    const c = new Castle();
    expect(c.hp).toBe(500);
    expect(c.maxHp).toBe(500);
    expect(c.isDefeated()).toBe(false);
  });

  it('damage reduces hp', () => {
    const c = new Castle();
    c.damage(100);
    expect(c.hp).toBe(400);
  });

  it('hp cannot go below 0', () => {
    const c = new Castle();
    c.damage(999);
    expect(c.hp).toBe(0);
  });

  it('isDefeated true when hp = 0', () => {
    const c = new Castle();
    c.damage(500);
    expect(c.isDefeated()).toBe(true);
  });

  it('allows custom starting hp', () => {
    const c = new Castle(100);
    expect(c.hp).toBe(100);
    expect(c.maxHp).toBe(100);
  });
});
