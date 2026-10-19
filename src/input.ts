import { Vector2 } from 'three';

export interface Tap {
  /** Normalised device coordinates (-1..1, y up). */
  ndc: Vector2;
}

export interface DragHandler {
  move(dx: number, dy: number): void;
  end(dx: number, dy: number): void;
}

const TAP_SLOP = 12;

/**
 * Pointer input on the canvas: taps, drags, and the viewer tilt used by Foil.
 * Tilt comes from the device orientation when available, otherwise from the pointer position.
 */
export class Input {
  /** Smoothed tilt, each axis roughly -1..1. */
  readonly tilt = new Vector2();
  onTap?: (tap: Tap) => void;
  drag?: DragHandler;

  private targetTilt = new Vector2();
  private down?: { x: number; y: number; id: number };
  private lastOrientationAt = -Infinity;
  private orientationBase?: { beta: number; gamma: number };

  constructor(private el: HTMLElement) {
    el.addEventListener('pointerdown', (e) => this.onDown(e));
    el.addEventListener('pointermove', (e) => this.onMove(e));
    el.addEventListener('pointerup', (e) => this.onUp(e));
    el.addEventListener('pointercancel', () => this.cancelDrag());
    window.addEventListener('deviceorientation', (e) => this.onOrientation(e));
  }

  /** iOS requires an explicit permission prompt, triggered from a user gesture. */
  async requestMotionPermission() {
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof DOE?.requestPermission === 'function') {
      try {
        await DOE.requestPermission();
      } catch {
        // Denied or unavailable: fall back to pointer tilt.
      }
    }
  }

  update(dt: number) {
    this.tilt.lerp(this.targetTilt, Math.min(1, dt * 8));
  }

  private onDown(e: PointerEvent) {
    if (this.down) return;
    this.down = { x: e.clientX, y: e.clientY, id: e.pointerId };
    this.el.setPointerCapture(e.pointerId);
    this.pointerTilt(e);
  }

  private onMove(e: PointerEvent) {
    if (e.pointerType === 'mouse' || this.down) this.pointerTilt(e);
    if (this.down && e.pointerId === this.down.id) {
      this.drag?.move(e.clientX - this.down.x, e.clientY - this.down.y);
    }
  }

  private onUp(e: PointerEvent) {
    if (!this.down || e.pointerId !== this.down.id) return;
    const dx = e.clientX - this.down.x;
    const dy = e.clientY - this.down.y;
    this.down = undefined;
    this.drag?.end(dx, dy);
    if (Math.hypot(dx, dy) < TAP_SLOP) {
      const ndc = new Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      this.onTap?.({ ndc });
    }
    if (e.pointerType !== 'mouse' && !this.hasOrientation()) this.targetTilt.set(0, 0);
  }

  private cancelDrag() {
    this.down = undefined;
    this.drag?.end(0, 0);
  }

  private pointerTilt(e: PointerEvent) {
    if (this.hasOrientation()) return;
    this.targetTilt.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -((e.clientY / window.innerHeight) * 2 - 1),
    );
  }

  private hasOrientation(): boolean {
    return performance.now() - this.lastOrientationAt < 1000;
  }

  private onOrientation(e: DeviceOrientationEvent) {
    if (e.beta == null || e.gamma == null) return;
    this.lastOrientationAt = performance.now();
    // Tilt is measured relative to how the phone was first held.
    this.orientationBase ??= { beta: e.beta, gamma: e.gamma };
    const base = this.orientationBase;
    // Slowly re-centre so a changed grip doesn't leave the tilt stuck at an edge.
    base.beta += (e.beta - base.beta) * 0.01;
    base.gamma += (e.gamma - base.gamma) * 0.01;
    this.targetTilt.set(
      clamp((e.gamma - base.gamma) / 25),
      clamp(-(e.beta - base.beta) / 25),
    );
  }
}

function clamp(v: number): number {
  return Math.max(-1, Math.min(1, v));
}
