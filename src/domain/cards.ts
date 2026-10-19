import type { Rarity } from './rarity';

export interface Card {
  id: string;
  name: string;
  title: string;
  rarity: Rarity;
  /** Base hue (0-360) for the placeholder art. */
  hue: number;
  /** Glyph drawn at the centre of the placeholder art. */
  glyph: string;
}

export const CARD_POOL: Card[] = [
  { id: 'n-slime', name: '史萊姆', title: '黏呼呼的旅伴', rarity: 'N', hue: 140, glyph: '◉' },
  { id: 'n-rat', name: '倉庫鼠', title: '偷吃起司的慣犯', rarity: 'N', hue: 30, glyph: '◆' },
  { id: 'n-bat', name: '洞穴蝙蝠', title: '倒掛的觀察者', rarity: 'N', hue: 270, glyph: '▼' },
  { id: 'n-mushroom', name: '跳跳菇', title: '森林地面的居民', rarity: 'N', hue: 0, glyph: '♣' },
  { id: 'n-crab', name: '沙灘蟹', title: '橫著走的哨兵', rarity: 'N', hue: 15, glyph: '✦' },
  { id: 'n-wisp', name: '小燭火', title: '迷途的火光', rarity: 'N', hue: 45, glyph: '✧' },
  { id: 'n-golem', name: '石塊人偶', title: '笨重的守門者', rarity: 'N', hue: 200, glyph: '■' },
  { id: 'n-frog', name: '雨蛙', title: '下雨天的歌手', rarity: 'N', hue: 110, glyph: '●' },
  { id: 'r-knight', name: '見習騎士', title: '盾比人還大', rarity: 'R', hue: 210, glyph: '⛨' },
  { id: 'r-archer', name: '林間射手', title: '百步穿楊', rarity: 'R', hue: 160, glyph: '➶' },
  { id: 'r-alchemist', name: '鍊金學徒', title: '炸過三次實驗室', rarity: 'R', hue: 290, glyph: '⚗' },
  { id: 'r-bard', name: '流浪詩人', title: '歌聲能讓狼停步', rarity: 'R', hue: 330, glyph: '♪' },
  { id: 'r-monk', name: '山門武僧', title: '一拳碎石', rarity: 'R', hue: 25, glyph: '☯' },
  { id: 'r-thief', name: '夜行盜賊', title: '影子裡的笑聲', rarity: 'R', hue: 250, glyph: '☾' },
  { id: 'sr-dragoon', name: '蒼龍騎士', title: '與飛龍締約之人', rarity: 'SR', hue: 220, glyph: '✠' },
  { id: 'sr-oracle', name: '月影神諭', title: '看見三日後的雨', rarity: 'SR', hue: 280, glyph: '☽' },
  { id: 'sr-forge', name: '熔爐巨匠', title: '鍛造星鐵之手', rarity: 'SR', hue: 10, glyph: '⚒' },
  { id: 'sr-tide', name: '潮汐歌姬', title: '海浪為她伴奏', rarity: 'SR', hue: 190, glyph: '❂' },
  { id: 'ssr-starfall', name: '星落魔女', title: '將流星摘入掌心', rarity: 'SSR', hue: 260, glyph: '✶' },
  { id: 'ssr-sunking', name: '曜日之王', title: '黎明由他宣告', rarity: 'SSR', hue: 42, glyph: '☀' },
];

export function cardsOf(rarity: Rarity): Card[] {
  return CARD_POOL.filter((c) => c.rarity === rarity);
}
