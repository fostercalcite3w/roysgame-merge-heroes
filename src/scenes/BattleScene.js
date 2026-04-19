import Phaser from 'phaser';
import { GameState } from '../systems/GameState.js';
import { ELEMENT_COLORS, CLASS_ICONS, TIER_BADGES, LAYOUT } from '../data/visuals.js';

export class BattleScene extends Phaser.Scene {
  constructor() { super('BattleScene'); }

  create() {
    this.gameState = new GameState();
    this.gameState.start();

    this.heroSprites = new Map();
    this.cellSprites = [];
    this.cursorRect = null;
    this.selectionRect = null;

    this.drawLayout();
    this.renderAll();
    this.drawCursor();
    this.drawSelection();

    this.bindKeyboard();

    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', () => {
      this.scale.off('resize', this.onResize, this);
    });
  }

  bindKeyboard() {
    const on = (kc, fn) => this.input.keyboard.on(`keydown-${kc}`, fn);
    on('W', () => this.onDirection(-1, 0));
    on('S', () => this.onDirection(1, 0));
    on('A', () => this.onDirection(0, -1));
    on('D', () => this.onDirection(0, 1));
    on('UP', () => this.onDirection(-1, 0));
    on('DOWN', () => this.onDirection(1, 0));
    on('LEFT', () => this.onDirection(0, -1));
    on('RIGHT', () => this.onDirection(0, 1));
    on('SPACE', () => this.onSelect());
    on('ENTER', () => this.onSelect());
    on('ESC', () => {
      this.gameState.deselect();
      this.drawSelection();
    });
  }

  onDirection(dr, dc) {
    if (this.gameState.phase !== 'playing') return;
    if (this.gameState.selection) {
      const result = this.gameState.attemptMove(dr, dc);
      if (result.moved) this.animateMoveAndMerges(result);
    } else {
      this.gameState.moveCursor(dr, dc);
      this.drawCursor();
    }
  }

  onSelect() {
    if (this.gameState.phase !== 'playing') return;
    if (this.gameState.selection) {
      this.gameState.deselect();
    } else {
      this.gameState.selectAtCursor();
    }
    this.drawSelection();
    this.drawCursor();
  }

  animateMoveAndMerges(result) {
    // Task 7 會加平滑 tween；此版直接 renderAll
    this.renderAll();
    this.drawCursor();
    this.drawSelection();
    if (result.merges.length > 0) {
      // 合成已在 attemptMove 內完成，這裡只重畫
      this.renderAll();
      this.drawSelection();
      this.drawCursor();
    }
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

  drawCursor() {
    const L = this.getLayout();
    const { row, col } = this.gameState.cursor;
    const { x, y } = this.cellCenter(row, col);
    if (!this.cursorRect) {
      this.cursorRect = this.add.rectangle(x, y, L.cellSize - 8, L.cellSize - 8, 0x000000, 0)
        .setStrokeStyle(3, LAYOUT.cursorStroke, 1)
        .setDepth(5);
    } else {
      this.cursorRect.setPosition(x, y);
      this.cursorRect.setSize(L.cellSize - 8, L.cellSize - 8);
    }
  }

  drawSelection() {
    const L = this.getLayout();
    if (!this.gameState.selection) {
      if (this.selectionRect) this.selectionRect.setVisible(false);
      return;
    }
    const { row, col } = this.gameState.selection;
    const { x, y } = this.cellCenter(row, col);
    if (!this.selectionRect) {
      this.selectionRect = this.add.rectangle(x, y, L.cellSize - 8, L.cellSize - 8, LAYOUT.selectFill, 0.28)
        .setStrokeStyle(3, LAYOUT.selectStroke, 1)
        .setDepth(6);
    } else {
      this.selectionRect.setPosition(x, y);
      this.selectionRect.setSize(L.cellSize - 8, L.cellSize - 8);
      this.selectionRect.setVisible(true);
    }
  }

  onResize() {
    this.drawLayout();
    this.renderAll();
    this.drawCursor();
    this.drawSelection();
  }
}
