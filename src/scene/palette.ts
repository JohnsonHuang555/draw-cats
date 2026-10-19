import { Color } from 'three';
import type { Rarity } from '../domain/rarity';

export const RARITY_HEX: Record<Rarity, number> = {
  N: 0xdfe6f0,
  R: 0x3d9bff,
  SR: 0xb35cff,
  SSR: 0xffc53d,
};

export const RARITY_CSS: Record<Rarity, string> = {
  N: '#dfe6f0',
  R: '#3d9bff',
  SR: '#b35cff',
  SSR: '#ffc53d',
};

export function rarityColor(rarity: Rarity): Color {
  return new Color(RARITY_HEX[rarity]);
}

/** Foil strength by Rarity: only SR (light) and SSR (strong) have Foil. */
export const FOIL_STRENGTH: Record<Rarity, number> = {
  N: 0,
  R: 0,
  SR: 0.5,
  SSR: 1,
};
