import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  init(data) {
    this.victory = data?.victory ?? false;
    this.wavesReached = data?.waves ?? 0;
  }

  create() {
    const overlay = document.getElementById('gameover-screen');
    const title = document.getElementById('gameover-title');
    const waves = document.getElementById('gameover-waves');
    const btn = document.getElementById('gameover-restart');
    const hud = document.getElementById('hud');
    const touch = document.getElementById('touch-overlay');

    hud?.classList.remove('is-open');
    touch?.classList.remove('is-open');

    if (!overlay || !title || !waves || !btn) return;

    title.textContent = this.victory ? '通關成功！' : '城堡陷落！';
    title.style.color = this.victory ? '#7afff2' : '#ff9f9f';
    waves.textContent = this.victory
      ? `打穿 10 波 — 你守住了城堡 🏰`
      : `撐到第 ${this.wavesReached} 波`;
    overlay.classList.add('is-open');

    const handleRestart = () => {
      overlay.classList.remove('is-open');
      btn.removeEventListener('click', handleRestart);
      this.input.keyboard.off('keydown-ENTER', handleRestart);
      this.input.keyboard.off('keydown-SPACE', handleRestart);
      this.scene.start('BattleScene');
    };

    btn.addEventListener('click', handleRestart);
    this.input.keyboard.on('keydown-ENTER', handleRestart);
    this.input.keyboard.on('keydown-SPACE', handleRestart);

    this.events.once('shutdown', () => {
      overlay.classList.remove('is-open');
      btn.removeEventListener('click', handleRestart);
    });
  }
}
