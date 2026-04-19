import Phaser from 'phaser';

export class BattleScene extends Phaser.Scene {
  constructor() { super('BattleScene'); }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width * 0.5, height * 0.5, width, height, 0x151632);
    this.add.text(width * 0.5, height * 0.5, '戰鬥場景建構中 (Task 5 會填入格子)', {
      fontFamily: 'Noto Sans TC, sans-serif',
      fontSize: '24px',
      color: '#c5c9ff',
    }).setOrigin(0.5);
  }
}
