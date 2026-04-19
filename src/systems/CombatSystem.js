import { COMBAT, TIER_POWER } from '../data/balance.js';

export class CombatSystem {
  constructor() {
    this.heroAttackMs = new Map();
    this.monsterStunMs = new Map();
    this.pendingKills = new Set();
  }

  tick(state, dtMs) {
    const hits = [];
    const kills = [];
    const stuns = [];

    if (this.pendingKills.size) {
      const dead = new Set(this.pendingKills);
      state.monsters = state.monsters.filter((m) => {
        if (!dead.has(m.id)) return true;
        kills.push(m.id);
        this.monsterStunMs.delete(m.id);
        return false;
      });
      this.pendingKills.clear();
    }

    state.grid.forEachCell((r, c, hero) => {
      if (!hero) return;
      if ((hero.stun_until || 0) > state.nowMs) return;
      const acc = (this.heroAttackMs.get(hero.id) || 0) + dtMs;
      if (acc < COMBAT.heroAttackIntervalMs) {
        this.heroAttackMs.set(hero.id, acc);
        return;
      }
      this.heroAttackMs.set(hero.id, acc - COMBAT.heroAttackIntervalMs);
      const target = nearestMonster(state.monsters, r, c);
      if (!target) return;
      const damage = (TIER_POWER[hero.tier] || 1) * COMBAT.heroDamagePerPower;
      target.hp = Math.max(0, target.hp - damage);
      hits.push({
        heroId: hero.id,
        monsterId: target.id,
        damage,
        from: { row: r, col: c },
        to: { ...target.position },
      });
      if (target.hp === 0) this.pendingKills.add(target.id);
    });

    for (const m of state.monsters) {
      if (m.hp <= 0) continue;
      const occupyingHero = state.grid.get(m.position.row, m.position.col);
      if (!occupyingHero) {
        this.monsterStunMs.delete(m.id);
        continue;
      }
      const acc = (this.monsterStunMs.get(m.id) || 0) + dtMs;
      if (acc >= COMBAT.monsterStunIntervalMs) {
        this.monsterStunMs.set(m.id, acc - COMBAT.monsterStunIntervalMs);
        occupyingHero.stun_until = state.nowMs + COMBAT.heroStunMs;
        stuns.push({ heroId: occupyingHero.id, monsterId: m.id, until: occupyingHero.stun_until });
      } else {
        this.monsterStunMs.set(m.id, acc);
      }
    }

    return { hits, kills, stuns };
  }
}

function nearestMonster(monsters, r, c) {
  let best = null;
  let bestD = Infinity;
  for (const m of monsters) {
    if (m.hp <= 0) continue;
    const d = (m.position.row - r) ** 2 + (m.position.col - c) ** 2;
    if (d < bestD) {
      bestD = d;
      best = m;
    }
  }
  return best;
}
