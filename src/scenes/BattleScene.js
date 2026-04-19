import Phaser from 'phaser';
import { GameState } from '../systems/GameState.js';
import { ELEMENT_COLORS, CLASS_ICONS, TIER_BADGES, LAYOUT } from '../data/visuals.js';
import { TouchOverlay } from '../ui/TouchOverlay.js';

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
    this.touchOverlay = new TouchOverlay({
      onCellTap: (row, col) => this.onCellTap(row, col),
    });
    this.touchOverlay.show();
    this.relayoutTouch();

    this.scale.on('resize', this.onResize, this);
    this.scale.on('resize', this.relayoutTouch, this);
    this.events.once('shutdown', () => {
      this.scale.off('resize', this.onResize, this);
      this.scale.off('resize', this.relayoutTouch, this);
      this.touchOverlay?.destroy();
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
      this.lastMoveFrom = `${this.gameState.selection.row},${this.gameState.selection.col}`;
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
    const { merges } = result;
    const fromKey = this.lastMoveFrom;
    const toKey = this.gameState.selection
      ? `${this.gameState.selection.row},${this.gameState.selection.col}`
      : null;

    this.renderAll();
    if (fromKey && toKey) this.tweenMoveSprites(fromKey, toKey);

    this.drawSelection();
    this.drawCursor();

    if (merges.length > 0) {
      this.time.delayedCall(150, () => this.playMergeAnimations(merges));
    }
  }

  tweenMoveSprites(fromKey, toKey) {
    const [fr, fc] = fromKey.split(',').map(Number);
    const [tr, tc] = toKey.split(',').map(Number);

    const toSprite = this.heroSprites.get(toKey);
    const fromSprite = this.heroSprites.get(fromKey);

    if (toSprite) {
      const fromPos = this.cellCenter(fr, fc);
      const toPos = this.cellCenter(tr, tc);
      toSprite.container.setPosition(fromPos.x, fromPos.y);
      this.tweens.add({
        targets: toSprite.container,
        x: toPos.x,
        y: toPos.y,
        duration: 180,
        ease: 'Cubic.easeOut',
      });
    }
    if (fromSprite) {
      const fromPos = this.cellCenter(tr, tc);
      const toPos = this.cellCenter(fr, fc);
      fromSprite.container.setPosition(fromPos.x, fromPos.y);
      this.tweens.add({
        targets: fromSprite.container,
        x: toPos.x,
        y: toPos.y,
        duration: 180,
        ease: 'Cubic.easeOut',
      });
    }
  }

  playMergeAnimations(merges) {
    for (const { result } of merges) {
      const { row, col } = result.placedAt;
      const key = `${row},${col}`;
      const sprite = this.heroSprites.get(key);
      if (!sprite) continue;

      const { x, y } = this.cellCenter(row, col);
      const tierColor = this.getTierColor(result.hero.tier);
      const cellSize = this.getLayout().cellSize;

      const flash = this.add.circle(x, y, cellSize * 0.55, tierColor, 0.85).setDepth(20);
      this.tweens.add({
        targets: flash,
        alpha: 0,
        scale: 1.8,
        duration: 360,
        ease: 'Cubic.easeOut',
        onComplete: () => flash.destroy(),
      });
      this.tweens.add({
        targets: sprite.container,
        scale: 1.18,
        duration: 120,
        yoyo: true,
        ease: 'Sine.easeInOut',
      });
      this.playMergeParticles(x, y, tierColor);
    }
    this.time.delayedCall(420, () => {
      this.renderAll();
      this.drawSelection();
      this.drawCursor();
    });
  }

  playMergeParticles(x, y, colorInt) {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dx = Math.cos(angle) * 6;
      const dy = Math.sin(angle) * 6;
      const p = this.add.circle(x, y, 5, colorInt, 1).setDepth(22);
      this.tweens.add({
        targets: p,
        x: x + dx * 14,
        y: y + dy * 14,
        alpha: 0,
        duration: 480,
        ease: 'Cubic.easeOut',
        onComplete: () => p.destroy(),
      });
    }
  }

  getTierColor(tier) {
    const map = {
      epic: 0xc389ff,
      legendary: 0xffd56b,
      mythic: 0xff9f6b,
      secret: 0x7afff2,
      base: 0xffffff,
    };
    return map[tier] ?? 0xffffff;
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
      if (this.touchOverlay) this.touchOverlay.highlightSelected(-1, -1);
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
    if (this.touchOverlay) this.touchOverlay.highlightSelected(row, col);
  }

  relayoutTouch() {
    if (!this.touchOverlay) return;
    const L = this.getLayout();
    const canvas = this.game.canvas;
    const rect = canvas.getBoundingClientRect();
    this.touchOverlay.layout({
      cellSize: L.cellSize,
      originX: L.originX,
      originY: L.originY,
      canvasRect: rect,
      scaleMode: { width: 1280, height: 720 },
    });
  }

  onCellTap(row, col) {
    if (this.gameState.phase !== 'playing') return;
    const sel = this.gameState.selection;
    if (!sel) {
      if (this.gameState.selectAt(row, col)) {
        this.drawSelection();
        this.drawCursor();
      }
      return;
    }
    const dr = row - sel.row, dc = col - sel.col;
    if (dr === 0 && dc === 0) {
      this.gameState.deselect();
      this.drawSelection();
      return;
    }
    if (Math.abs(dr) + Math.abs(dc) !== 1) {
      this.gameState.deselect();
      this.drawSelection();
      return;
    }
    this.lastMoveFrom = `${sel.row},${sel.col}`;
    const result = this.gameState.attemptMove(dr, dc);
    if (result.moved) this.animateMoveAndMerges(result);
  }

  onResize() {
    this.drawLayout();
    this.renderAll();
    this.drawCursor();
    this.drawSelection();
    this.relayoutTouch();
  }
}
