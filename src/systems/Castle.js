import { CASTLE } from '../data/balance.js';

export class Castle {
  constructor(maxHp = CASTLE.maxHp) {
    this.maxHp = maxHp;
    this.hp = maxHp;
  }

  damage(amount) {
    this.hp = Math.max(0, this.hp - amount);
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  isDefeated() {
    return this.hp <= 0;
  }
}
