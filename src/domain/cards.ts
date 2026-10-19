import type { Rarity } from './rarity';
import type { Traits } from './traits';

interface CardBase {
  id: string;
  name: string;
  /** Catchphrase (Meme Cat) or Cat Number label (Generated Cat), shown under the name. */
  title: string;
  rarity: Rarity;
  /** Base hue (0-360) for the art background. */
  hue: number;
}

export interface MemeCat extends CardBase {
  kind: 'meme';
}

export interface GeneratedCat extends CardBase {
  kind: 'generated';
  number: number;
  traits: Traits;
}

export type Card = MemeCat | GeneratedCat;

const meme = (id: string, name: string, title: string, rarity: Rarity, hue: number): MemeCat => ({
  kind: 'meme',
  id,
  name,
  title,
  rarity,
  hue,
});

/** Ranked by fame: 2025 Meme of the Year and all-time icons at the top. */
export const MEME_CATS: MemeCat[] = [
  meme('ssr-oiia', 'OIIA 貓', 'OIIA OIIA 轉不停', 'SSR', 280),
  meme('ssr-grumpy', '不爽貓', '我不要。', 'SSR', 0),
  meme('sr-nyan', '彩虹貓', '拖著彩虹飛越宇宙', 'SR', 235),
  meme('sr-chipi', 'Chipi Chipi 貓', 'Chipi Chipi Chapa Chapa', 'SR', 290),
  meme('sr-happy', 'Happy 貓', 'Happy Happy Happy～', 'SR', 45),
  meme('sr-pop', 'Pop 貓', '啵！', 'SR', 340),
  meme('r-huh', 'Huh 貓', '蛤？', 'R', 180),
  meme('r-maxwell', '臭貓', '慢慢地轉圈圈', 'R', 230),
  meme('r-smudge', '沙拉貓', '我又沒吃你的沙拉', 'R', 100),
  meme('r-keyboard', '鍵盤貓', '演奏完畢，請下台', 'R', 220),
  meme('r-banana', '香蕉貓', '嗚嗚嗚嗚嗚', 'R', 50),
  meme('r-vibing', '搖頭貓', '節奏感滿分', 'R', 260),
  meme('n-polite', '有禮貌貓', '不好意思打擾了', 'N', 330),
  meme('n-sad', '被罵悲傷貓', '我只是肚子餓…', 'N', 210),
  meme('n-scream', '尖叫小貓', '啊啊啊啊啊！', 'N', 150),
  meme('n-shocked', '震驚貓', '真的假的？', 'N', 120),
  meme('n-zoning', '優雅貓', '正在放空中', 'N', 30),
  meme('n-wajaja', '大笑貓', 'WAJAJAJA', 'N', 50),
  meme('n-chips', '吃薯片貓', '這包是我的', 'N', 200),
  meme('n-staring', '紅溫貓', '盯——', 'N', 15),
];

export function memesOf(rarity: Rarity): MemeCat[] {
  return MEME_CATS.filter((c) => c.rarity === rarity);
}
