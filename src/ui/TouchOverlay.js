export class TouchOverlay {
  constructor({ onCellTap }) {
    this.onCellTap = onCellTap;
    this.root = document.getElementById('touch-overlay');
    if (!this.root) return;
    this.cells = [];
    this.build();
  }

  build() {
    this.root.innerHTML = '';
    this.cells = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const el = document.createElement('div');
        el.className = 'touch-cell';
        el.dataset.row = String(r);
        el.dataset.col = String(c);
        const handler = (e) => {
          e.preventDefault();
          this.onCellTap(r, c);
        };
        el.addEventListener('touchstart', handler, { passive: false });
        el.addEventListener('click', handler);
        this.root.appendChild(el);
        this.cells.push(el);
      }
    }
  }

  show() { this.root?.classList.add('is-open'); }
  hide() { this.root?.classList.remove('is-open'); }

  layout({ cellSize, originX, originY, canvasRect, scaleMode }) {
    if (!this.cells.length) return;
    const scaleX = canvasRect.width / scaleMode.width;
    const scaleY = canvasRect.height / scaleMode.height;
    const px = (v) => v * scaleX;
    const py = (v) => v * scaleY;

    for (const el of this.cells) {
      const r = Number(el.dataset.row), c = Number(el.dataset.col);
      const left = canvasRect.left + px(originX + c * cellSize);
      const top  = canvasRect.top  + py(originY + r * cellSize);
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      el.style.width = `${px(cellSize)}px`;
      el.style.height = `${py(cellSize)}px`;
    }
  }

  highlightSelected(row, col) {
    for (const el of this.cells) {
      const r = Number(el.dataset.row), c = Number(el.dataset.col);
      el.classList.toggle('is-selected', r === row && c === col);
    }
  }

  destroy() {
    this.hide();
    if (this.root) this.root.innerHTML = '';
    this.cells = [];
  }
}
