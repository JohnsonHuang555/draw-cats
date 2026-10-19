import type { Rarity } from './rarity';

export interface Card {
  id: string;
  name: string;
  /** The meme's catchphrase or origin, shown under the name. */
  title: string;
  rarity: Rarity;
  /** Base hue (0-360) for the art background. */
  hue: number;
}

export const CARD_POOL: Card[] = [
  { id: 'n-banana', name: '香蕉貓', title: '嗚嗚嗚嗚嗚', rarity: 'N', hue: 50 },
  { id: 'n-crying', name: '哭哭貓', title: '眼眶泛淚的那一刻', rarity: 'N', hue: 210 },
  { id: 'n-polite', name: '禮貌貓', title: '不好意思打擾了', rarity: 'N', hue: 330 },
  { id: 'n-huh', name: '蛤貓', title: '蛤？', rarity: 'N', hue: 180 },
  { id: 'n-bingus', name: '賓格斯', title: '沒毛也很可愛', rarity: 'N', hue: 15 },
  { id: 'n-chipi', name: '奇比奇比貓', title: 'Chipi Chipi Chapa Chapa', rarity: 'N', hue: 290 },
  { id: 'n-ceiling', name: '天花板貓', title: '一直在看著你', rarity: 'N', hue: 30 },
  { id: 'n-shocked', name: '驚嚇貓', title: '嚇到毛都豎起來', rarity: 'N', hue: 120 },
  { id: 'r-bongo', name: '拍桌貓', title: '什麼都能打成鼓', rarity: 'R', hue: 200 },
  { id: 'r-pop', name: '啵啵貓', title: '啵！', rarity: 'R', hue: 340 },
  { id: 'r-vibing', name: '點頭貓', title: '節奏感滿分', rarity: 'R', hue: 260 },
  { id: 'r-longcat', name: '長貓', title: '長～～～～～貓', rarity: 'R', hue: 150 },
  { id: 'r-maxwell', name: '麥克斯韋', title: '慢慢地轉圈圈', rarity: 'R', hue: 230 },
  { id: 'r-happy', name: '哈皮貓', title: 'Happy Happy Happy～', rarity: 'R', hue: 45 },
  { id: 'sr-keyboard', name: '鍵盤貓', title: '演奏完畢，請下台', rarity: 'SR', hue: 220 },
  { id: 'sr-smudge', name: '沙拉貓', title: '我又沒吃你的沙拉', rarity: 'SR', hue: 100 },
  { id: 'sr-oiia', name: '歐伊亞旋轉貓', title: 'OIIA OIIA 轉不停', rarity: 'SR', hue: 280 },
  { id: 'sr-floppa', name: '大佛洛帕', title: '浴缸裡的大人物', rarity: 'SR', hue: 25 },
  { id: 'ssr-nyan', name: '彩虹貓', title: '拖著彩虹飛越宇宙', rarity: 'SSR', hue: 235 },
  { id: 'ssr-grumpy', name: '不爽貓', title: '我不要。', rarity: 'SSR', hue: 0 },
];

export function cardsOf(rarity: Rarity): Card[] {
  return CARD_POOL.filter((c) => c.rarity === rarity);
}
