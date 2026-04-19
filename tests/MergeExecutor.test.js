import { describe, it, expect } from 'vitest';
import { Grid } from '../src/systems/Grid.js';
import { executeMerge } from '../src/systems/MergeExecutor.js';

function hero(cls, ele, tier = 'base') {
  return { id: `${ele}-${cls}`, attack_class: cls, element: ele, tier };
}

describe('executeMerge', () => {
  it('merges group of 3 into tier epic at center cell', () => {
    const g = new Grid();
    g.set(4, 0, hero('sword', 'fire'));
    g.set(4, 1, hero('sword', 'water'));
    g.set(4, 2, hero('sword', 'grass'));
    const group = {
      attribute: { type: 'attack_class', value: 'sword' },
      cells: new Set(['4,0','4,1','4,2']),
    };
    const result = executeMerge(g, group);

    expect(g.get(4, 0)).toBeNull();
    expect(g.get(4, 2)).toBeNull();
    const merged = g.get(4, 1);
    expect(merged.tier).toBe('epic');
    expect(merged.attack_class).toBe('sword');
    expect(result.placedAt).toEqual({ row: 4, col: 1 });
    expect(result.tier).toBe('epic');
  });

  it('4 → legendary, 5 → mythic, 6 → secret', () => {
    const sizes = { 4: 'legendary', 5: 'mythic', 6: 'secret' };
    for (const [sizeStr, expectedTier] of Object.entries(sizes)) {
      const size = Number(sizeStr);
      const g = new Grid();
      const cells = new Set();
      // 5 cols max → size=6 從 row 3 col 0 繞回來，形成 L 形
      for (let i = 0; i < size; i++) {
        const r = i < 5 ? 4 : 3;
        const c = i < 5 ? i : i - 5;
        g.set(r, c, hero('sword', 'fire'));
        cells.add(`${r},${c}`);
      }
      const group = { attribute: { type: 'attack_class', value: 'sword' }, cells };
      const result = executeMerge(g, group);
      expect(result.tier).toBe(expectedTier);
    }
  });

  it('preserves the merged hero attributes based on shared attribute', () => {
    const g = new Grid();
    g.set(4, 0, hero('sword', 'fire'));
    g.set(4, 1, hero('bow', 'fire'));
    g.set(4, 2, hero('magic', 'fire'));
    const group = {
      attribute: { type: 'element', value: 'fire' },
      cells: new Set(['4,0','4,1','4,2']),
    };
    executeMerge(g, group);
    const merged = g.get(4, 1);
    expect(merged.element).toBe('fire');
    expect(['sword','bow','magic']).toContain(merged.attack_class);
  });
});
