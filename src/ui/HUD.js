export class HUD {
  constructor() {
    this.root = document.getElementById('hud');
    this.waveEl = document.getElementById('hud-wave');
    this.hpFillEl = document.getElementById('hud-hp-fill');
    this.hpTextEl = document.getElementById('hud-hp-text');
    this.stepEl = document.getElementById('hud-step');
  }

  show() { this.root?.classList.add('is-open'); }
  hide() { this.root?.classList.remove('is-open'); }

  update({ wave, hp, maxHp, step, stepThreshold }) {
    if (this.waveEl) this.waveEl.textContent = `第 ${wave} 波`;
    if (this.hpTextEl) this.hpTextEl.textContent = `${hp} / ${maxHp}`;
    if (this.hpFillEl) {
      const pct = Math.max(0, Math.min(100, Math.round((hp / maxHp) * 100)));
      this.hpFillEl.style.width = `${pct}%`;
    }
    if (this.stepEl) this.stepEl.textContent = `步數 ${step} / ${stepThreshold}`;
  }
}
