import { describe, it, expect } from 'vitest';
import { Grid } from '../src/systems/Grid.js';
import { findMergeGroups } from '../src/systems/MergeDetector.js';

function hero(cls, ele) {
  return { id: `${ele}-${cls}`, attack_class: cls, element: ele, tier: 'base' };
}

describe('findMergeGroups', () => {
  it('finds no groups on empty grid', () => {
    expect(findMergeGroups(new Grid())).toEqual([]);
  });

  it('finds horizontal 3 same class', () => {
    const g = new Grid();
    g.set(4, 0, hero('sword', 'fire'));
    g.set(4, 1, hero('sword', 'water'));
    g.set(4, 2, hero('sword', 'grass'));
    const groups = findMergeGroups(g);
    expect(groups).toHaveLength(1);
    expect(groups[0].attribute).toEqual({ type: 'attack_class', value: 'sword' });
    expect(groups[0].cells.size).toBe(3);
  });

  it('finds vertical 3 same element', () => {
    const g = new Grid();
    g.set(2, 2, hero('sword', 'fire'));
    g.set(3, 2, hero('bow', 'fire'));
    g.set(4, 2, hero('magic', 'fire'));
    const groups = findMergeGroups(g);
    expect(groups).toHaveLength(1);
    expect(groups[0].attribute.value).toBe('fire');
  });

  it('finds L-shaped group', () => {
    const g = new Grid();
    g.set(3, 0, hero('sword', 'fire'));
    g.set(4, 0, hero('bow', 'fire'));
    g.set(4, 1, hero('magic', 'fire'));
    const groups = findMergeGroups(g);
    expect(groups).toHaveLength(1);
    expect(groups[0].cells.size).toBe(3);
  });

  it('ignores groups smaller than 3', () => {
    const g = new Grid();
    g.set(4, 0, hero('sword', 'fire'));
    g.set(4, 1, hero('sword', 'water'));
    expect(findMergeGroups(g)).toEqual([]);
  });

  it('detects group of 6 (max tier)', () => {
    const g = new Grid();
    for (let c = 0; c < 5; c++) g.set(4, c, hero('sword', 'fire'));
    g.set(3, 0, hero('sword', 'water'));
    const groups = findMergeGroups(g);
    const swordGroup = groups.find((g) => g.attribute.value === 'sword');
    const fireGroup = groups.find((g) => g.attribute.value === 'fire');
    expect(swordGroup.cells.size).toBe(6);
    expect(fireGroup.cells.size).toBe(5);
  });

  it('does not double-report same group under both attributes when all match', () => {
    const g = new Grid();
    g.set(4, 0, hero('sword', 'fire'));
    g.set(4, 1, hero('sword', 'fire'));
    g.set(4, 2, hero('sword', 'fire'));
    const groups = findMergeGroups(g);
    expect(groups).toHaveLength(2);
  });
});
