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

/**
 * Ranked by fame within each Rarity. Naming rule: a well-known English meme name if there is one,
 * otherwise the Chinese name; the Chinese nickname leads the title for English-named cats.
 * Ids are stable (the Album stores them); names can change freely.
 */
export const MEME_CATS: MemeCat[] = [
  // SSR
  meme('ssr-oiia', 'OIIA Cat', '旋轉貓・OIIA OIIA！', 'SSR', 280),
  meme('ssr-grumpy', 'Grumpy Cat', '不爽貓・我不要。', 'SSR', 0),
  meme('ssr-bongo', 'Bongo Cat', '拍桌貓・什麼都能打成鼓', 'SSR', 200),
  meme('ssr-floppa', 'Big Floppa', '大佛洛帕・浴缸裡的大人物', 'SSR', 25),
  meme('ssr-longcat', 'Longcat', '長貓・長～～～～貓', 'SSR', 150),
  meme('ssr-cheez', 'Cheezburger Cat', 'I CAN HAS CHEEZBURGER?', 'SSR', 40),
  // SR
  meme('sr-nyan', 'Nyan Cat', '彩虹貓・飛越宇宙', 'SR', 235),
  meme('sr-chipi', 'Chipi Chipi Cat', 'Chipi Chipi Chapa Chapa', 'SR', 290),
  meme('sr-happy', 'Happy Cat', 'Happy Happy Happy～', 'SR', 45),
  meme('sr-pop', 'Pop Cat', '啵啵貓・啵！', 'SR', 340),
  meme('sr-ceiling', 'Ceiling Cat', '天花板貓・一直在看著你', 'SR', 30),
  meme('sr-thumbsup', 'Crying Cat Thumbs Up', '哭哭比讚貓・我沒事', 'SR', 205),
  meme('sr-thurston', 'Thurston Waffles', '長嘯貓・嗷嗚——', 'SR', 320),
  meme('sr-fresh', '新鮮哥', '你看什麼看', 'SR', 20),
  meme('sr-stepan', 'Stepan', '紅酒貓・優雅的午後', 'SR', 350),
  meme('sr-bingus', 'Bingus', '沒毛也很可愛', 'SR', 15),
  meme('sr-sideeye', 'Side Eye Cat', '斜眼貓・你確定？', 'SR', 260),
  meme('sr-larry', 'Larry the Cat', '唐寧街首席捕鼠官', 'SR', 220),
  // R
  meme('r-huh', 'Huh Cat', '蛤貓・蛤？', 'R', 180),
  meme('r-maxwell', 'Maxwell the Cat', '臭貓・慢慢轉圈圈', 'R', 230),
  meme('r-smudge', 'Smudge', '沙拉貓・我又沒吃你的沙拉', 'R', 100),
  meme('r-keyboard', 'Keyboard Cat', '鍵盤貓・演奏完畢請下台', 'R', 220),
  meme('r-banana', '香蕉貓', '嗚嗚嗚嗚嗚', 'R', 50),
  meme('r-vibing', 'Vibing Cat', '搖頭貓・節奏感滿分', 'R', 260),
  meme('r-dj', 'DJ Cat', '打碟貓・Drop the beat', 'R', 280),
  meme('r-driver', 'Driver Cat', '開車貓・繫好安全帶', 'R', 190),
  meme('r-mamaliele', '罵罵咧咧貓', '碎碎念停不下來', 'R', 40),
  meme('r-mengbi', '矇逼哥', '？？？', 'R', 30),
  meme('r-wet', 'Cat Wet', '淋濕貓・我好濕', 'R', 200),
  meme('r-yamero', 'Yamero Cat', '不要啊！', 'R', 300),
  meme('r-no', 'No Cat', 'NO.', 'R', 10),
  meme('r-ak', 'AK Cat', '全副武裝', 'R', 90),
  meme('r-lilbub', 'Lil Bub', '永遠吐舌頭', 'R', 300),
  meme('r-gracie', 'Gracie', '呆貓・腦袋空空', 'R', 230),
  meme('r-apple', '蘋果貓', '嗚嗚嗚（蘋果版）', 'R', 0),
  meme('r-dance', '跳舞貓', '戴貝雷帽的舞者', 'R', 170),
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
  meme('n-hungry', '好餓喔貓', '好餓喔……', 'N', 330),
  meme('n-corn', 'Corn Cat', '吃玉米貓・啃啃啃', 'N', 55),
  meme('n-mic', 'Mic Cat', '麥克風貓・唱給你聽', 'N', 300),
  meme('n-backpack', 'Backpack Kitten', '背包小貓・出發囉', 'N', 100),
  meme('n-belyash', 'Belyash', '嘔吐貓・噁——', 'N', 80),
  meme('n-bowl', '敲碗貓', '飯呢？', 'N', 40),
  meme('n-nails', 'Nail File Cat', '修指甲貓・保養中', 'N', 280),
  meme('n-eyeroll', '翻白眼吐舌貓', '……', 'N', 260),
  meme('n-loki', 'Office Cat Loki', '辦公貓・加班中', 'N', 210),
  meme('n-service', '客服貓', '您好，很高興為您服務', 'N', 130),
  meme('n-clip', '夾子貓', '說話好可愛', 'N', 20),
  meme('n-laundry', 'Laundry Cat', '洗衣貓・晾衣服中', 'N', 190),
  meme('n-luna', 'Luna', '吃東西貓・嚼嚼嚼', 'N', 30),
  meme('n-cowdance', '跳舞奶牛貓', '扭來扭去', 'N', 180),
];

export function memesOf(rarity: Rarity): MemeCat[] {
  return MEME_CATS.filter((c) => c.rarity === rarity);
}
