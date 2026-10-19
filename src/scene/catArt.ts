/**
 * Cartoon art for every Card: hand-made specs for Meme Cats, and specs assembled from Traits for
 * Generated Cats. A real image in src/assets/cards/<card-id>.* replaces the cartoon (see textures.ts).
 */
import type { Card } from '../domain/cards';
import { drawCat, drawMemeBackground, type ArtArea } from './catKit';
import { drawTraitBackground, specFromTraits } from './generatedArt';
import { MEME_SPECS } from './memeArt';

export type { ArtArea };

export function drawCardArt(ctx: CanvasRenderingContext2D, card: Card, a: ArtArea) {
  if (card.kind === 'generated') {
    drawTraitBackground(ctx, card, a);
    drawCat(ctx, specFromTraits(card), a);
  } else {
    drawMemeBackground(ctx, card.hue, card.id, a);
    const spec = MEME_SPECS[card.id];
    if (spec) drawCat(ctx, spec, a);
  }
}
