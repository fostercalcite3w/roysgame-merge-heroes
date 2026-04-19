import { GRID } from '../data/balance.js';

export class Grid {
  constructor(rows = GRID.rows, cols = GRID.cols) {
    this.rows = rows;
    this.cols = cols;
    this.cells = Array.from({ length: rows }, () => Array(cols).fill(null));
  }

  get(r, c) {
    if (!this.isInBounds(r, c)) return null;
    return this.cells[r][c];
  }

  set(r, c, hero) {
    if (!this.isInBounds(r, c)) return;
    this.cells[r][c] = hero;
  }

  clear(r, c) {
    this.set(r, c, null);
  }

  isEmpty(r, c) {
    return this.get(r, c) === null;
  }

  isInBounds(r, c) {
    return r >= 0 && r < this.rows && c >= 0 && c < this.cols;
  }

  forEachCell(fn) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        fn(r, c, this.cells[r][c]);
      }
    }
  }
}
