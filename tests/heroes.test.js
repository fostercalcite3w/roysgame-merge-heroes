import { describe, it, expect } from 'vitest';
import { BASE_HEROES, ATTACK_CLASSES, ELEMENTS, TIERS } from '../src/data/heroes.js';

describe('heroes data', () => {
  it('defines 4 attack classes', () => {
    expect(ATTACK_CLASSES).toEqual(['sword', 'bow', 'magic', 'shield']);
  });

  it('defines 4 elements', () => {
    expect(ELEMENTS).toEqual(['fire', 'water', 'grass', 'elec']);
  });

  it('defines 4 tiers in order', () => {
    expect(TIERS).toEqual(['base', 'epic', 'legendary', 'mythic', 'secret']);
  });

  it('defines exactly 16 base heroes', () => {
    expect(BASE_HEROES).toHaveLength(16);
  });

  it('covers every class × element combination', () => {
    for (const cls of ATTACK_CLASSES) {
      for (const ele of ELEMENTS) {
        const match = BASE_HEROES.find(
          (h) => h.attack_class === cls && h.element === ele
        );
        expect(match, `missing ${cls}+${ele}`).toBeDefined();
      }
    }
  });

  it('every hero has unique id, base tier, and valid fields', () => {
    const ids = new Set();
    for (const h of BASE_HEROES) {
      expect(ids.has(h.id)).toBe(false);
      ids.add(h.id);
      expect(h.tier).toBe('base');
      expect(ATTACK_CLASSES).toContain(h.attack_class);
      expect(ELEMENTS).toContain(h.element);
      expect(typeof h.name).toBe('string');
      expect(h.name.length).toBeGreaterThan(0);
    }
  });
});
