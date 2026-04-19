// 所有數值公式的唯一來源。修改數值 → 先改這裡 → 跑測試。

export const GRID = {
  rows: 5,
  cols: 5,
  heroRows: [3, 4], // 英雄初始列（底部 2 排）
};

export const STEPS = {
  triggerThreshold: 5, // 累計步數達 5 觸發怪物生成
};

export const MERGE = {
  minGroup: 3, // 最少合成數
  maxGroup: 6, // 最多合成數
  // 群組大小 → 合成階級
  groupSizeToTier: {
    3: 'epic',
    4: 'legendary',
    5: 'mythic',
    6: 'secret',
  },
};

export const CASTLE = {
  maxHp: 500,
};

export const SPAWN = {
  // 波次 → 生成怪物數量
  monstersPerWave: (wave) => 2 + Math.floor(wave * 0.5),
  // 可從哪幾邊生成
  edges: ['top', 'left', 'right'],
};

export const TIER_POWER = {
  // 合成階級 → 攻擊力倍率
  base: 1,
  epic: 2,
  legendary: 4,
  mythic: 8,
  secret: 16,
};

export const COMBAT = {
  heroAttackIntervalMs: 1500,
  heroDamagePerPower: 10,
  heroStunMs: 2000,
  monsterStunIntervalMs: 1000,
};
