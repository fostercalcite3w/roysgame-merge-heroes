import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
  constructor() { super('TitleScene'); }

  create() {
    const overlay = document.getElementById('title-screen');
    const startBtn = document.getElementById('title-start');
    if (!overlay || !startBtn) {
      console.warn('title-screen elements missing');
      return;
    }
    overlay.classList.add('is-open');

    const handleStart = () => {
      overlay.classList.remove('is-open');
      startBtn.removeEventListener('click', handleStart);
      this.input.keyboard.off('keydown-ENTER', handleStart);
      this.input.keyboard.off('keydown-SPACE', handleStart);
      this.scene.start('BattleScene');
    };

    startBtn.addEventListener('click', handleStart);
    this.input.keyboard.on('keydown-ENTER', handleStart);
    this.input.keyboard.on('keydown-SPACE', handleStart);

    this.events.once('shutdown', () => {
      overlay.classList.remove('is-open');
      startBtn.removeEventListener('click', handleStart);
    });
  }
}
