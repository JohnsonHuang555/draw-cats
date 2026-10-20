/**
 * Cartoon art for every Card: hand-made specs for Meme Cats, and specs assembled from Traits for
 * Generated Cats. A real image in src/assets/cards/<card-id>.* replaces the cartoon (see textures.ts).
 */
import type { Card } from '../domain/cards';
import { rank } from '../domain/rarity';
import { drawCat, drawMemeBackground, type ArtArea } from './catKit';
import { drawTraitBackground, specFromTraits } from './generatedArt';
import { MEME_SPECS } from './memeArt';

export type { ArtArea };

/** Whether a Card's art moves. Only SR and above get motion. */
export function hasMotion(card: Card): boolean {
  return card.kind === 'meme' && !!MEME_SPECS[card.id]?.motion && rank(card.rarity) >= rank('SR');
}

/** `time` (seconds) poses a moving Card at that moment; leave it out for a still picture. */
export function drawCardArt(ctx: CanvasRenderingContext2D, card: Card, a: ArtArea, time?: number) {
  if (card.kind === 'generated') {
    drawTraitBackground(ctx, card, a);
    drawCat(ctx, specFromTraits(card), a);
  } else {
    drawMemeBackground(ctx, card.hue, card.id, a);
    const spec = MEME_SPECS[card.id];
    if (spec) drawCat(ctx, spec, a, hasMotion(card) ? time : undefined);
  }
}
