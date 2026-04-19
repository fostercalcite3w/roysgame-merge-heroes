// 所有視覺常數集中於此。改色／改 icon 來這裡。

export const ELEMENT_COLORS = {
  fire:  { fill: 0xff6b6b, stroke: 0xc44141, text: '#fff0f0' },
  water: { fill: 0x6bb6ff, stroke: 0x3c7fcc, text: '#eef6ff' },
  grass: { fill: 0x6bd98a, stroke: 0x3ea85c, text: '#eefff0' },
  elec:  { fill: 0xffe76b, stroke: 0xc4a840, text: '#2d2a0f' },
};

export const CLASS_ICONS = {
  sword:  '🗡',
  bow:    '🏹',
  magic:  '🔮',
  shield: '🛡',
};

export const TIER_BADGES = {
  base:       { label: '',   color: '#ffffff', ring: null },
  epic:       { label: '史', color: '#c389ff', ring: 0xc389ff },
  legendary:  { label: '傳', color: '#ffd56b', ring: 0xffd56b },
  mythic:     { label: '神', color: '#ff9f6b', ring: 0xff6b3c },
  secret:     { label: '秘', color: '#7afff2', ring: 0x7afff2 },
};

export const MONSTER_SKIN = {
  slime:  { emoji: '🟢', fill: 0x89d960, stroke: 0x4f8a33 },
  goblin: { emoji: '👺', fill: 0xa88565, stroke: 0x6c5038 },
  orc:    { emoji: '👹', fill: 0x8d5660, stroke: 0x5a3139 },
};

export const LAYOUT = {
  heroScale: 0.78,
  cursorStroke: 0xffe76b,
  selectFill:  0x7ac6ff,
  selectStroke:0xffffff,
  gridFill:    0x1f2140,
  gridStroke:  0x3e4380,
  castleFill:  0x5a3f2a,
};

export const ANIM = {
  moveMs: 180,
  mergeShrinkMs: 220,
  mergePopMs: 260,
  projectileMs: 260,
  monsterStepMs: 900,
};
