import Phaser from 'phaser';
import { GameState } from '../systems/GameState.js';
import { ELEMENT_COLORS, CLASS_ICONS, TIER_BADGES, LAYOUT } from '../data/visuals.js';

export class BattleScene extends Phaser.Scene {
  constructor() { super('BattleScene'); }

  create() {
    this.gameState = new GameState();
    this.gameState.start();

    this.heroSprites = new Map(); // key "r,c" → { container, rect, icon, badge }
    this.cellSprites = [];

    this.drawLayout();
    this.renderAll();

    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.onResize, this));
  }

  getLayout() {
    const w = this.scale.width, h = this.scale.height;
    const cellSize = Math.floor(Math.min(w * 0.55, h * 0.75) / 5);
    const gridW = cellSize * 5;
    const gridH = cellSize * 5;
    const originX = Math.round(w * 0.5 - gridW * 0.5);
    const originY = Math.round(h * 0.5 - gridH * 0.5 - h * 0.03);
    return { cellSize, gridW, gridH, originX, originY };
  }

  cellCenter(row, col) {
    const L = this.getLayout();
    return {
      x: L.originX + col * L.cellSize + L.cellSize / 2,
      y: L.originY + row * L.cellSize + L.cellSize / 2,
    };
  }

  drawLayout() {
    const L = this.getLayout();
    for (const s of this.cellSprites) s.destroy();
    this.cellSprites = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const { x, y } = this.cellCenter(r, c);
        const rect = this.add.rectangle(x, y, L.cellSize - 4, L.cellSize - 4, LAYOUT.gridFill)
          .setStrokeStyle(2, LAYOUT.gridStroke, 0.85)
          .setDepth(0);
        this.cellSprites.push(rect);
      }
    }
  }

  renderAll() {
    for (const v of this.heroSprites.values()) v.container.destroy();
    this.heroSprites.clear();
    this.gameState.grid.forEachCell((r, c, hero) => {
      if (!hero) return;
      this.renderHero(r, c, hero);
    });
  }

  renderHero(row, col, hero) {
    const L = this.getLayout();
    const { x, y } = this.cellCenter(row, col);
    const size = Math.floor(L.cellSize * LAYOUT.heroScale);
    const color = ELEMENT_COLORS[hero.element] ?? ELEMENT_COLORS.fire;
    const tierInfo = TIER_BADGES[hero.tier] ?? TIER_BADGES.base;

    const container = this.add.container(x, y).setDepth(10);
    const rect = this.add.rectangle(0, 0, size, size, color.fill, 1)
      .setStrokeStyle(3, color.stroke, 1);
    container.add(rect);

    const iconText = this.add.text(0, -size * 0.06,
      CLASS_ICONS[hero.attack_class] ?? '?', {
        fontFamily: 'Noto Sans TC, sans-serif',
        fontSize: `${Math.floor(size * 0.55)}px`,
        color: color.text,
      }).setOrigin(0.5);
    container.add(iconText);

    let badge = null;
    if (tierInfo.label) {
      badge = this.add.text(size * 0.36, -size * 0.36, tierInfo.label, {
        fontFamily: 'Noto Sans TC, sans-serif',
        fontSize: `${Math.floor(size * 0.22)}px`,
        color: tierInfo.color,
        fontStyle: 'bold',
      }).setOrigin(0.5);
      container.add(badge);
    }
    if (tierInfo.ring) {
      const ring = this.add.rectangle(0, 0, size + 6, size + 6, 0x000000, 0)
        .setStrokeStyle(3, tierInfo.ring, 1);
      container.addAt(ring, 0);
    }

    this.heroSprites.set(`${row},${col}`, { container, rect, icon: iconText, badge });
  }

  onResize() {
    this.drawLayout();
    this.renderAll();
  }
}
