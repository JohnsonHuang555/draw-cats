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

const meme = (
  id: string,
  name: string,
  title: string,
  rarity: Rarity,
  hue: number,
): MemeCat => ({
  kind: 'meme',
  id,
  name,
  title,
  rarity,
  hue,
});

/**
 * Ranked by fame within each Rarity. Naming rule: a well-known English meme name if there is one,
 * otherwise the Chinese name; the Chinese nickname leads the title for English-named cats.
 * Ids are stable (the Album stores them); names can change freely.
 */
export const MEME_CATS: MemeCat[] = [
  // SSR
  meme('ssr-oiia', 'OIIA Cat', '旋轉貓・OIIA OIIA！', 'SSR', 280),
  meme('ssr-bongo', 'Bongo Cat', '拍桌貓・什麼都能打成鼓', 'SSR', 200),
  meme('ssr-longcat', 'Longcat', '長貓・長～～～～貓', 'SSR', 150),
  // SR
  meme('sr-nyan', 'Nyan Cat', '彩虹貓・飛越宇宙', 'SR', 235),
  meme('sr-chipi', 'Chipi Chipi Cat', 'Chipi Chipi Chapa Chapa', 'SR', 290),
  meme('sr-happy', 'Happy Cat', 'Happy Happy Happy～', 'SR', 45),
  meme('r-maxwell', 'Maxwell the Cat', '臭貓・慢慢轉圈圈', 'SR', 230),
  meme('r-huh', 'Huh Cat', '蛤貓・蛤？', 'SR', 180),
  meme('r-no', 'No Cat', 'NO.', 'SR', 10),
  meme('sr-pop', 'Pop Cat', '啵啵貓・啵！', 'SR', 340),
  meme('sr-ceiling', 'Ceiling Cat', '天花板貓・一直在看著你', 'SR', 30),
  meme('sr-thumbsup', 'Crying Cat Thumbs Up', '哭哭比讚貓・我沒事', 'SR', 205),
  meme('sr-thurston', 'Thurston Waffles', '長嘯貓・嗷嗚——', 'SR', 320),
  meme('sr-fresh', '新鮮哥', '你看什麼看', 'SR', 20),
  meme('sr-bingus', 'Bingus', '沒毛也很可愛', 'SR', 15),
  meme('sr-sideeye', 'Side Eye Cat', '斜眼貓・你確定？', 'SR', 260),
  // R
  meme('ssr-grumpy', 'Grumpy Cat', '不爽貓・我不要。', 'R', 0),
  meme('ssr-floppa', 'Big Floppa', '大佛洛帕・浴缸裡的大人物', 'R', 25),
  meme('ssr-cheez', 'Cheezburger Cat', 'I CAN HAS CHEEZBURGER?', 'R', 40),
  meme('r-smudge', 'Smudge', '沙拉貓・我又沒吃你的沙拉', 'R', 100),
  meme('r-keyboard', 'Keyboard Cat', '鍵盤貓・演奏完畢請下台', 'R', 220),
  meme('r-banana', '香蕉貓', '嗚嗚嗚嗚嗚', 'R', 50),
  meme('r-vibing', 'Vibing Cat', '搖頭貓・節奏感滿分', 'R', 260),
  meme('r-mamaliele', '罵罵咧咧貓', '碎碎念停不下來', 'R', 40),
  meme('r-mengbi', '矇逼哥', '？？？', 'R', 30),
  meme('r-wet', 'Cat Wet', '淋濕貓・我好濕', 'R', 200),
  meme('r-yamero', 'Yamero Cat', '不要啊！', 'R', 300),
  meme('r-lilbub', 'Lil Bub', '永遠吐舌頭', 'R', 300),
  // N
  meme('n-polite', 'Polite Cat', '有禮貌貓・不好意思打擾了', 'N', 330),
  meme('n-sad', '被罵悲傷貓', '我只是肚子餓…', 'N', 210),
  meme('n-scream', '尖叫小貓', '啊啊啊啊啊！', 'N', 150),
  meme('n-shocked', '震驚貓', '真的假的？', 'N', 120),
  meme('n-zoning', 'Zoning Out Cat', '優雅貓・正在放空中', 'N', 30),
  meme('n-wajaja', 'Wajaja Cat', '大笑貓・WAJAJAJA', 'N', 50),
  meme('n-chips', 'Cat Eating Chips', '吃薯片貓・這包是我的', 'N', 200),
  meme('n-staring', 'Staring Cat', '紅溫貓・盯——', 'N', 15),
  meme('n-sleep', 'Sleep Cat', '睡覺貓・別吵我', 'N', 240),
  meme('n-barbara', 'Angry Cat Barbara', '生氣貓・你再說一次', 'N', 10),
  meme('n-clip', '筷子貓', '您好，我吃一點', 'N', 20),
  meme('n-luna', 'Luna', '吃東西貓・嚼嚼嚼', 'N', 30),
];

export function memesOf(rarity: Rarity): MemeCat[] {
  return MEME_CATS.filter((c) => c.rarity === rarity);
}
