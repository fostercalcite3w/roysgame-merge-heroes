import { describe, it, expect } from 'vitest';
import { StepCounter } from '../src/systems/StepCounter.js';

describe('StepCounter', () => {
  it('starts at 0', () => {
    expect(new StepCounter().count).toBe(0);
  });

  it('returns false until threshold reached', () => {
    const s = new StepCounter(5);
    for (let i = 0; i < 4; i++) {
      expect(s.increment()).toBe(false);
    }
    expect(s.count).toBe(4);
  });

  it('returns true on 5th step and resets to 0', () => {
    const s = new StepCounter(5);
    for (let i = 0; i < 4; i++) s.increment();
    expect(s.increment()).toBe(true);
    expect(s.count).toBe(0);
  });

  it('uses default threshold from balance.js (5)', () => {
    const s = new StepCounter();
    for (let i = 0; i < 4; i++) s.increment();
    expect(s.increment()).toBe(true);
  });

  it('reset() clears count', () => {
    const s = new StepCounter();
    s.increment();
    s.reset();
    expect(s.count).toBe(0);
  });
});
