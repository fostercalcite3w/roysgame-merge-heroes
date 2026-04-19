import { STEPS } from '../data/balance.js';

export class StepCounter {
  constructor(threshold = STEPS.triggerThreshold) {
    this.threshold = threshold;
    this.count = 0;
  }

  increment() {
    this.count += 1;
    if (this.count >= this.threshold) {
      this.count = 0;
      return true;
    }
    return false;
  }

  reset() {
    this.count = 0;
  }
}
