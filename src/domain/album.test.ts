import { describe, expect, it } from 'vitest';
import { cardOf, generatedSlots, memeSlots, recordPull, type Album } from './album';
import { MEME_CATS } from './cards';
import { GENERATOR_VERSION, generateCat, numbersOf } from './generated';
import type { Copy } from './pull';

const copies = (...cards: Copy['card'][]): Copy[] => cards.map((card, index) => ({ index, card }));
const grumpy = MEME_CATS.find((c) => c.id === 'ssr-grumpy')!;
const cat = generateCat(42);

describe('Album', () => {
  it('records Copies and counts duplicates', () => {
    const { album } = recordPull({}, copies(grumpy, cat, grumpy), 1000);
    expect(album['ssr-grumpy'].count).toBe(2);
    expect(album['cat-42'].count).toBe(1);
    expect(album['ssr-grumpy'].firstAt).toBe(1000);
  });

  it('marks only the first Copy of a Card the Album did not have as a New Card', () => {
    const first = recordPull({}, copies(grumpy, cat, grumpy), 1);
    expect([...first.newCopies]).toEqual([0, 1]);

    const second = recordPull(first.album, copies(cat, generateCat(7)), 2);
    expect([...second.newCopies]).toEqual([1]);
    expect(second.album['cat-42'].firstAt).toBe(1);
  });

  it('does not mutate the Album it was given', () => {
    const album: Album = {};
    recordPull(album, copies(grumpy), 1);
    expect(album).toEqual({});
  });

  it('records the Generator Version for Generated Cats only', () => {
    const { album } = recordPull({}, copies(grumpy, cat), 1);
    expect(album['cat-42'].generator).toBe(GENERATOR_VERSION);
    expect(album['ssr-grumpy'].generator).toBeUndefined();
  });

  it('rebuilds Cards from entries', () => {
    const { album } = recordPull({}, copies(grumpy, cat), 1);
    expect(cardOf(album['cat-42'])).toEqual(cat);
    expect(cardOf(album['ssr-grumpy'])).toBe(grumpy);
    expect(cardOf({ cardId: 'gone', count: 1, firstAt: 0 })).toBeUndefined();
  });

  it('lists every Meme Cat, with 0 for unowned ones', () => {
    const { album } = recordPull({}, copies(grumpy), 1);
    const slots = memeSlots(album);
    expect(slots).toHaveLength(MEME_CATS.length);
    expect(slots.find((s) => s.card.id === 'ssr-grumpy')!.count).toBe(1);
    expect(slots.filter((s) => s.count === 0)).toHaveLength(MEME_CATS.length - 1);
  });

  it('lists owned Generated Cats, highest Rarity first, filterable by Rarity', () => {
    const ssr = generateCat(numbersOf('SSR')[0]);
    const n1 = generateCat(numbersOf('N')[1]);
    const n0 = generateCat(numbersOf('N')[0]);
    const { album } = recordPull({}, copies(n1, ssr, grumpy, n0), 1);
    expect(generatedSlots(album).map((s) => s.card.id)).toEqual([ssr.id, n0.id, n1.id]);
    expect(generatedSlots(album, 'N')).toHaveLength(2);
  });
});
