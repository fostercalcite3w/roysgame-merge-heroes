export const ATTACK_CLASSES = ['sword', 'bow', 'magic', 'shield'];
export const ELEMENTS = ['fire', 'water', 'grass', 'elec'];
export const TIERS = ['base', 'epic', 'legendary', 'mythic', 'secret'];

const CLASS_NAMES = { sword: '劍士', bow: '弓手', magic: '法師', shield: '盾衛' };
const ELEM_NAMES = { fire: '火', water: '水', grass: '草', elec: '電' };

export const BASE_HEROES = ATTACK_CLASSES.flatMap((cls) =>
  ELEMENTS.map((ele) => ({
    id: `${ele}-${cls}`,
    name: `${ELEM_NAMES[ele]}${CLASS_NAMES[cls]}`,
    attack_class: cls,
    element: ele,
    tier: 'base',
  }))
);
