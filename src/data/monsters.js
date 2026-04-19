// Tier 1: 普通怪 3 種，依波數混用
export const MONSTER_TYPES = {
  slime: {
    id: 'slime',
    name: '史萊姆',
    hp: 10,
    attack: 2,
    speed: 1, // 格/秒
    reward: { coin: 1, puzzleChance: 0.05 },
  },
  goblin: {
    id: 'goblin',
    name: '哥布林',
    hp: 20,
    attack: 5,
    speed: 1,
    reward: { coin: 2, puzzleChance: 0.1 },
  },
  orc: {
    id: 'orc',
    name: '獸人',
    hp: 40,
    attack: 10,
    speed: 0.8,
    reward: { coin: 4, puzzleChance: 0.15 },
  },
};
