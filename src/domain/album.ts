import { MEME_CATS, type Card } from './cards';
import { GENERATOR_VERSION, generateCat } from './generated';
import type { Copy } from './pull';
import { rank, type Rarity } from './rarity';

export interface AlbumEntry {
  cardId: string;
  count: number;
  /** Epoch ms when the first Copy arrived. */
  firstAt: number;
  /** Generated Cats only: the Generator Version the cat was obtained under. */
  generator?: number;
}

export type Album = Record<string, AlbumEntry>;

export interface Recorded {
  album: Album;
  /** Indexes of Copies that are New Cards (first Copy of a Card the Album didn't have). */
  newCopies: Set<number>;
}

/** Adds a Pull's Copies to the Album. Pure: returns a new Album. */
export function recordPull(album: Album, copies: Copy[], now: number): Recorded {
  const next: Album = { ...album };
  const newCopies = new Set<number>();
  for (const copy of copies) {
    const card = copy.card;
    const existing = next[card.id];
    if (existing) {
      next[card.id] = { ...existing, count: existing.count + 1 };
    } else {
      newCopies.add(copy.index);
      next[card.id] = {
        cardId: card.id,
        count: 1,
        firstAt: now,
        ...(card.kind === 'generated' ? { generator: GENERATOR_VERSION } : {}),
      };
    }
  }
  return { album: next, newCopies };
}

/** Rebuilds the Card an entry refers to, or undefined if it no longer exists. */
export function cardOf(entry: AlbumEntry): Card | undefined {
  const match = /^cat-(\d+)$/.exec(entry.cardId);
  if (match) {
    // Only Generator Version 1 exists; a future version would branch on entry.generator here.
    return generateCat(Number(match[1]));
  }
  return MEME_CATS.find((c) => c.id === entry.cardId);
}

export interface AlbumSlot {
  card: Card;
  /** 0 when not owned (Meme Cats only). */
  count: number;
}

/** Every Meme Cat, owned or not, in pool order. */
export function memeSlots(album: Album): AlbumSlot[] {
  return MEME_CATS.map((card) => ({ card, count: album[card.id]?.count ?? 0 }));
}

/** Owned Generated Cats, highest Rarity first, then by Cat Number. */
export function generatedSlots(album: Album, rarity?: Rarity): AlbumSlot[] {
  const slots: AlbumSlot[] = [];
  for (const entry of Object.values(album)) {
    const card = cardOf(entry);
    if (card?.kind !== 'generated') continue;
    if (rarity && card.rarity !== rarity) continue;
    slots.push({ card, count: entry.count });
  }
  return slots.sort((a, b) => {
    const byRarity = rank(b.card.rarity) - rank(a.card.rarity);
    if (byRarity !== 0) return byRarity;
    return a.card.kind === 'generated' && b.card.kind === 'generated' ? a.card.number - b.card.number : 0;
  });
}
