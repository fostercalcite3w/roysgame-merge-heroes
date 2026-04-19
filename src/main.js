import Phaser from 'phaser';
import './ui/styles.css';
import { TitleScene } from './scenes/TitleScene.js';
import { BattleScene } from './scenes/BattleScene.js';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: document.body,
  backgroundColor: '#0f1020',
  scene: [TitleScene, BattleScene],
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
