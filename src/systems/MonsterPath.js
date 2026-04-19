import { GRID } from '../data/balance.js';

const CENTER_COL = Math.floor(GRID.cols / 2);

export function nextCell(monster, grid) {
  const { row, col } = monster.position;
  let target;
  if (monster.edge === 'top') {
    target = { row: row + 1, col };
  } else if (monster.edge === 'left') {
    if (col < CENTER_COL) target = { row, col: col + 1 };
    else target = { row: row + 1, col };
  } else if (monster.edge === 'right') {
    if (col > CENTER_COL) target = { row, col: col - 1 };
    else target = { row: row + 1, col };
  } else {
    target = { row: row + 1, col };
  }
  if (target.row >= 0 && target.row < grid.rows && target.col >= 0 && target.col < grid.cols) {
    if (grid.get(target.row, target.col)) return { row, col };
  }
  return target;
}

export function hasReachedCastle(monster) {
  return monster.position.row >= GRID.rows;
}
