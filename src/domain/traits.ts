export const TRAIT_KEYS = ['fur', 'eyes', 'expression', 'headwear', 'face', 'held', 'background'] as const;
export type TraitKey = (typeof TRAIT_KEYS)[number];

export interface TraitValue {
  id: string;
  label: string;
  /** Rare values only appear on SR and SSR Generated Cats. */
  rare?: boolean;
  /** Relative weight within its common or rare group (default 1). */
  weight?: number;
  /** Phrase used to build the cat's name, e.g. 「戴皇冠的」. */
  prefix?: string;
}

/** Trait value id for each Trait. */
export type Traits = Record<TraitKey, string>;

export const TRAIT_LABELS: Record<TraitKey, string> = {
  fur: '毛色',
  eyes: '眼睛',
  expression: '表情',
  headwear: '頭飾',
  face: '臉部',
  held: '手持物',
  background: '背景',
};

/**
 * Frozen as Generator Version 1. Any edit here, even appending a value, changes how existing
 * Cat Numbers look; new Traits need a new Generator Version (see ADR 0002).
 */
export const TRAITS: Record<TraitKey, TraitValue[]> = {
  fur: [
    { id: 'orange', label: '橘貓', weight: 3 },
    { id: 'black', label: '黑貓', weight: 2 },
    { id: 'white', label: '白貓', weight: 2 },
    { id: 'tabby', label: '灰虎斑', weight: 2 },
    { id: 'tuxedo', label: '賓士貓', weight: 2 },
    { id: 'calico', label: '三花貓', weight: 2 },
    { id: 'siamese', label: '暹羅貓' },
    { id: 'gold', label: '黃金貓', rare: true },
    { id: 'ghost', label: '幽靈貓', rare: true },
    { id: 'galaxy', label: '銀河貓', rare: true },
    { id: 'rainbow', label: '彩虹毛貓', rare: true },
  ],
  eyes: [
    { id: 'round', label: '圓眼', weight: 3 },
    { id: 'half', label: '半睜眼', prefix: '睡眼惺忪的' },
    { id: 'squint', label: '瞇瞇眼', prefix: '瞇瞇眼的' },
    { id: 'sparkle', label: '星星眼', prefix: '星星眼的' },
    { id: 'hetero', label: '異色瞳', rare: true, prefix: '異色瞳的' },
    { id: 'laser', label: '雷射眼', rare: true, prefix: '雷射眼的' },
  ],
  expression: [
    { id: 'smile', label: '微笑', weight: 2, prefix: '微笑的' },
    { id: 'blank', label: '面無表情', weight: 2, prefix: '放空的' },
    { id: 'pout', label: '嘟嘴', prefix: '嘟嘴的' },
    { id: 'yawn', label: '打哈欠', prefix: '打哈欠的' },
    { id: 'smirk', label: '奸笑', rare: true, prefix: '奸笑的' },
  ],
  headwear: [
    { id: 'none', label: '無', weight: 4 },
    { id: 'beanie', label: '毛帽', prefix: '戴毛帽的' },
    { id: 'ribbon', label: '蝴蝶結', prefix: '綁蝴蝶結的' },
    { id: 'party', label: '派對帽', prefix: '戴派對帽的' },
    { id: 'crown', label: '皇冠', rare: true, prefix: '戴皇冠的' },
    { id: 'halo', label: '天使光環', rare: true, prefix: '天使' },
    { id: 'wizard', label: '巫師帽', rare: true, prefix: '戴巫師帽的' },
  ],
  face: [
    { id: 'none', label: '無', weight: 4 },
    { id: 'blush', label: '腮紅', prefix: '害羞的' },
    { id: 'sunglasses', label: '墨鏡', rare: true, prefix: '戴墨鏡的' },
    { id: 'pixel', label: '像素眼鏡', rare: true, prefix: '戴像素眼鏡的' },
  ],
  held: [
    { id: 'none', label: '無', weight: 4 },
    { id: 'fish', label: '小魚', prefix: '叼著魚的' },
    { id: 'yarn', label: '毛線球', prefix: '抱毛線球的' },
    { id: 'boba', label: '珍珠奶茶', rare: true, prefix: '喝珍奶的' },
    { id: 'saber', label: '光劍', rare: true, prefix: '拿光劍的' },
  ],
  background: [
    { id: 'solid', label: '素色', weight: 2 },
    { id: 'dots', label: '點點' },
    { id: 'stripes', label: '條紋' },
    { id: 'cosmic', label: '宇宙', rare: true },
    { id: 'sunburst', label: '光芒', rare: true },
  ],
};

export function traitValue(key: TraitKey, id: string): TraitValue {
  return TRAITS[key].find((v) => v.id === id)!;
}
