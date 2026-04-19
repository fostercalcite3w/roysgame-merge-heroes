import Phaser from 'phaser';
import './ui/styles.css';

class TitleScene extends Phaser.Scene {
  constructor() { super('TitleScene'); }
  create() {
    const { width, height } = this.scale;
    this.add.text(width * 0.5, height * 0.5, '合成王', {
      fontFamily: 'Noto Sans TC, sans-serif',
      fontSize: `${Math.floor(height * 0.15)}px`,
      color: '#ffd56b',
    }).setOrigin(0.5);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: document.body,
  backgroundColor: '#0f1020',
  scene: [TitleScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
  },
  render: { antialias: true, pixelArt: false, roundPixels: false },
};

const game = new Phaser.Game(config);

let refreshTimer = null;
const delayedRefresh = () => {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => { if (game.scale) game.scale.refresh(); }, 300);
};
window.addEventListener('resize', delayedRefresh);
if (screen.orientation?.addEventListener) {
  screen.orientation.addEventListener('change', delayedRefresh);
} else {
  window.addEventListener('orientationchange', delayedRefresh);
}
