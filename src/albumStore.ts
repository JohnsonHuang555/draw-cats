import { recordPull, type Album } from './domain/album';
import type { Copy } from './domain/pull';

const KEY = 'draw-card-game:album';

interface SaveFile {
  version: 1;
  entries: Album;
}

/**
 * The player's Album, persisted in this browser's localStorage. Storage can be unavailable
 * (private mode, blocked site data); the Album then lives only for this session.
 */
export class AlbumStore {
  album: Album;

  constructor() {
    this.album = load();
  }

  /** Records a Pull and returns the indexes of its New Cards. */
  record(copies: Copy[]): Set<number> {
    const { album, newCopies } = recordPull(this.album, copies, Date.now());
    this.album = album;
    this.save();
    return newCopies;
  }

  clear() {
    this.album = {};
    this.save();
  }

  private save() {
    const file: SaveFile = { version: 1, entries: this.album };
    try {
      localStorage.setItem(KEY, JSON.stringify(file));
    } catch {
      // Storage unavailable: keep the Album in memory only.
    }
  }
}

function load(): Album {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const file = JSON.parse(raw) as SaveFile;
    return file.version === 1 && file.entries ? file.entries : {};
  } catch {
    return {};
  }
}
