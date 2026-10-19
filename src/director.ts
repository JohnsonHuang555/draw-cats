import gsap from 'gsap';
import { Color, Raycaster, Vector3, type Object3D } from 'three';
import type { Sfx } from './audio/sfx';
import { createPull, type PullKind, type PullResult } from './domain/pull';
import { rank, type Rarity } from './domain/rarity';
import type { Input, Tap } from './input';
import { CARD_H, CARD_W, CardView } from './scene/card';
import { Backdrop, Dimmer, Rays } from './scene/effects';
import { PACK_H, PACK_W, PackView, TEAR_Y } from './scene/pack';
import { RARITY_CSS, rarityColor } from './scene/palette';
import { Particles, rainbow } from './scene/particles';
import { BASE_BLOOM, type Stage } from './scene/stage';
import type { Overlay, SummaryAction } from './ui/overlay';

type Mode = 'idle' | 'tear' | 'advance' | 'summary';

interface Slot {
  x: number;
  y: number;
  scale: number;
}

interface Ambient {
  at: Vector3;
  radius: number;
  rate: number;
  color: () => Color;
  carry: number;
}

const IDLE_TINT = new Color(0x3a2a8a);
const HOME_PACK_COLOR = new Color(0x9a8cff);
const PACK_GLOW: Record<Rarity, number> = { N: 0.35, R: 0.6, SR: 0.85, SSR: 1.15 };
const AMBIENT_RATE: Record<Rarity, number> = { N: 0, R: 4, SR: 12, SSR: 30 };
const BURST_COUNT: Record<Rarity, number> = { N: 25, R: 60, SR: 160, SSR: 320 };
const STACK_Z = 0.3;
const REVEAL_Z = 1.2;
const TRAY_Z = -1;
const SHOWCASE_Z = 2;

const delay = (seconds: number) => new Promise<void>((resolve) => gsap.delayedCall(seconds, resolve));

/** One-shot promise slot: `wait()` resolves on the next `fire()`. */
class Waiter<T> {
  private resolve?: (value: T) => void;
  wait(): Promise<T> {
    return new Promise((r) => (this.resolve = r));
  }
  fire(value: T) {
    const r = this.resolve;
    this.resolve = undefined;
    r?.(value);
  }
}

/**
 * Runs the Pull flow end to end: Pack + Pack Hint → Tear (and Fake-out) → deal → Reveals (Card Hints,
 * SSR Showcase, Reveal All) → Summary. Owns every scene object that belongs to a Pull.
 */
export class Director {
  private pack?: PackView;
  private cards: CardView[] = [];
  private slots: Slot[] = [];
  private readonly rays = new Rays();
  private readonly dimmer = new Dimmer();
  private readonly backdrop = new Backdrop();
  private readonly particles: Particles;
  private readonly advance = new Waiter<'tap' | 'skip'>();
  private readonly raycaster = new Raycaster();
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private mode: Mode = 'idle';
  private skipping = false;
  private busy = false;
  private ambient: Ambient | null = null;
  private inspecting: CardView | null = null;
  private autoTear?: () => void;

  constructor(
    private stage: Stage,
    private input: Input,
    private overlay: Overlay,
    private sfx: Sfx,
  ) {
    const { scene } = stage;
    this.particles = new Particles(stage.renderer.getPixelRatio());
    this.rays.mesh.position.set(0, 0.2, 1.5);
    this.dimmer.mesh.position.z = 0.8;
    scene.add(this.backdrop.stars, this.backdrop.nebula, this.backdrop.nebula2);
    scene.add(this.dimmer.mesh, this.rays.mesh, this.particles.points);

    stage.add((dt, time) => this.update(dt, time));
    stage.onQualityDrop = () => {
      this.particles.budget = 0.5;
      this.particles.setPixelRatio(1);
    };
    window.addEventListener('resize', () => this.onResize());

    overlay.onPull = (kind) => void this.run(kind);
    overlay.onRevealAll = () => {
      this.skipping = true;
      overlay.showRevealAll(false);
      this.advance.fire('skip');
    };
    overlay.onMute = (muted) => sfx.setMuted(muted);
    input.onTap = (tap) => this.onTap(tap);

    this.showHome();
  }

  // ---------------------------------------------------------------- flow

  private async run(kind: PullKind) {
    if (this.busy) return;
    this.busy = true;
    this.sfx.unlock();
    this.sfx.click();
    void this.input.requestMotionPermission();
    this.overlay.showHome(false);

    let next: SummaryAction = kind;
    while (next !== 'home') {
      const result = createPull(next, {
        forceRarity: this.overlay.dev.forceSSR ? 'SSR' : undefined,
        forceFakeOut: this.overlay.dev.forceFakeOut,
      });
      await this.presentPack(result);
      await this.tear(result);
      await this.deal(result);
      await this.revealAll();
      next = await this.summary();
      await this.clearCards();
    }
    this.showHome();
    this.busy = false;
  }

  private showHome() {
    this.backdrop.tint.copy(IDLE_TINT);
    const pack = this.ensurePack();
    gsap.to(pack.color, { r: HOME_PACK_COLOR.r, g: HOME_PACK_COLOR.g, b: HOME_PACK_COLOR.b, duration: 0.5 });
    gsap.to(pack, { glowStrength: 0.3, duration: 0.5 });
    this.overlay.showHome(true);
  }

  private async presentPack(result: PullResult) {
    const pack = this.ensurePack();
    const hint = rarityColor(result.packHint);
    this.backdrop.tint.copy(hint).multiplyScalar(0.55);
    this.sfx.whoosh();

    const pop = pack.root.scale.x * 1.08;
    const tl = gsap.timeline();
    tl.to(pack.root.rotation, { y: Math.PI * 2, duration: 1, ease: 'power3.inOut' }, 0)
      .to(pack.root.scale, { x: pop, y: pop, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0)
      .to(pack.color, { r: hint.r, g: hint.g, b: hint.b, duration: 0.4 }, 0.5)
      .to(pack, { glowStrength: PACK_GLOW[result.packHint], duration: 0.6 }, 0.5)
      .call(() => {
        this.sfx.packHint(result.packHint);
        this.particles.burst(this.worldOf(pack.root), {
          count: 30 + rank(result.packHint) * 30,
          color: hint,
          speed: 3,
          spread: new Vector3(PACK_W * 0.4, PACK_H * 0.4, 0.1),
          gravity: 0.5,
        });
        this.setAmbient(pack.root, PACK_W * 0.6, AMBIENT_RATE[result.packHint], hint, result.packHint === 'SSR');
      }, [], 0.6);
    await tl;
    pack.root.rotation.y = 0;
  }

  private async tear(result: PullResult) {
    const pack = this.pack!;
    this.overlay.setPrompt('← 左右滑動，撕開卡包 →');
    this.mode = 'tear';

    await new Promise<void>((resolve) => {
      const threshold = Math.min(window.innerWidth * 0.5, 280);
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        this.input.drag = undefined;
        this.autoTear = undefined;
        resolve();
      };
      this.input.drag = {
        move: (dx) => {
          if (done) return;
          gsap.killTweensOf(pack, 'tearProgress');
          if (Math.abs(dx) > 4) pack.tearDirection = dx >= 0 ? 1 : -1;
          pack.tearProgress = Math.min(1, Math.abs(dx) / threshold);
          if (pack.tearProgress >= 1) finish();
        },
        end: () => {
          if (!done) gsap.to(pack, { tearProgress: 0, duration: 0.35, ease: 'back.out(2)' });
        },
      };
      // A plain tap tears the Pack for you, for players who don't think to swipe.
      this.autoTear = () => {
        this.autoTear = undefined;
        gsap.to(pack, { tearProgress: 1, duration: 0.45, ease: 'power2.in', onComplete: finish });
      };
    });

    this.mode = 'idle';
    this.overlay.setPrompt(null);
    this.ambient = null;
    pack.torn = true;
    const dir = pack.tearDirection;
    const opening = pack.root.localToWorld(new Vector3(0, TEAR_Y, 0.1));
    const hint = rarityColor(result.packHint);

    this.sfx.tear();
    gsap.to(pack.top.position, { x: dir * 4, y: '+=4.5', duration: 1, ease: 'power2.out' });
    gsap.to(pack.top.rotation, { z: dir * 1.8, duration: 1, ease: 'power2.out' });
    gsap.to(pack.beam.scale, { y: 1, duration: 0.4, ease: 'expo.out' });
    gsap.to(pack.beamMaterial, { opacity: 0.9, duration: 0.2 });
    gsap.to(pack, { glowStrength: '+=0.5', duration: 0.3 });
    this.particles.burst(opening, {
      count: 110,
      color: hint,
      speed: 6,
      direction: new Vector3(0, 1.3, 0),
      spread: new Vector3(PACK_W * 0.4, 0.05, 0.1),
      gravity: -2.5,
    });
    this.overlay.flash(RARITY_CSS[result.packHint], 0.3, 0.5);
    this.shake(0.08, 0.35);
    this.bloomSpike(0.6, 0.8);

    if (!result.fakeOut) {
      await delay(0.6);
      return;
    }

    // Fake-out: the Pack Hint lied. Hold a beat, then crack to SSR.
    await delay(0.8);
    const gold = rarityColor('SSR');
    this.sfx.fakeOut();
    this.overlay.flash('#ffffff', 0.95, 1.1);
    this.shake(0.35, 0.8);
    this.bloomSpike(1.4, 1.6);
    this.backdrop.tint.copy(gold).multiplyScalar(0.6);
    gsap.to(pack.color, { r: gold.r, g: gold.g, b: gold.b, duration: 0.12 });
    gsap.to(pack, { glowStrength: 1.9, duration: 0.2 });
    gsap.to(pack.beam.scale, { x: 1.8, duration: 0.5, ease: 'expo.out' });
    this.rays.uniforms.color.value.copy(gold);
    this.rays.mesh.position.set(opening.x, opening.y, -0.5);
    gsap.fromTo(this.rays.uniforms.opacity, { value: 0 }, { value: 1.2, duration: 0.3 });
    this.particles.burst(opening, {
      count: 360,
      color: () => (Math.random() < 0.5 ? gold : rainbow()),
      speed: 10,
      size: 0.22,
      gravity: -1,
      life: 1.6,
    });
    this.setAmbient(pack.root, PACK_W * 0.7, AMBIENT_RATE.SSR, gold, true);
    await delay(1.3);
    this.ambient = null;
  }

  private async deal(result: PullResult) {
    const pack = this.pack!;
    const opening = pack.root.localToWorld(new Vector3(0, TEAR_Y, 0));
    const n = result.copies.length;
    const stackScale = this.centerScale(STACK_Z) * 0.8;

    this.cards = result.copies.map((copy) => {
      const card = new CardView(copy);
      card.root.position.set(opening.x, opening.y - 0.8, -0.1);
      card.root.scale.setScalar(pack.root.scale.x * 0.85);
      this.stage.scene.add(card.root);
      return card;
    });
    this.slots = this.gridLayout(n);

    const tl = gsap.timeline();
    this.cards.forEach((card, i) => {
      tl.to(card.root.position, { y: opening.y + 1.6 + i * 0.05, duration: 0.45, ease: 'power2.out' }, i * 0.06);
      tl.call(() => this.sfx.deal(), [], i * 0.06);
    });
    const out = 0.45 + n * 0.06;
    tl.to(pack.root.position, { y: -9, duration: 0.6, ease: 'power2.in' }, out)
      .to(pack, { opacity: 0, glowStrength: 0, duration: 0.5 }, out)
      .to(pack.beamMaterial, { opacity: 0, duration: 0.5 }, out)
      .to(this.rays.uniforms.opacity, { value: 0, duration: 0.6 }, out);
    this.cards.forEach((card, i) => {
      const depth = n - 1 - i;
      tl.to(
        card.root.position,
        { x: 0, y: 0.1 + depth * 0.015, z: STACK_Z + depth * 0.012, duration: 0.5, ease: 'power3.inOut' },
        out + 0.15 + depth * 0.04,
      );
      tl.to(card.root.scale, { x: stackScale, y: stackScale, z: stackScale, duration: 0.5 }, '<');
      tl.to(card.root.rotation, { z: (Math.random() - 0.5) * 0.12, duration: 0.5 }, '<');
    });
    await tl;
    pack.dispose();
    this.pack = undefined;
  }

  private async revealAll() {
    const multi = this.cards.length > 1;
    this.skipping = false;
    this.overlay.showRevealAll(multi);
    this.overlay.setPrompt('點擊翻開');
    let waitedFirst = false;

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      const ssr = card.copy.card.rarity === 'SSR';

      if (!waitedFirst) {
        waitedFirst = true;
        await this.waitAdvance();
      }
      if (this.skipping && !ssr) {
        this.overlay.setPrompt(null);
        this.quickToTray(card, this.slots[i]);
        await delay(0.09);
        continue;
      }

      this.overlay.setPrompt(null);
      await this.revealOne(card, multi);
      if (!ssr && !this.skipping) {
        this.overlay.setPrompt(i < this.cards.length - 1 ? '點擊下一張' : '點擊查看結果');
        await this.waitAdvance();
        this.overlay.setPrompt(null);
      }
      if (multi) this.toTray(card, this.slots[i]);
    }

    this.overlay.showRevealAll(false);
    this.overlay.setPrompt(null);
    await delay(0.35);
  }

  private async revealOne(card: CardView, multi: boolean) {
    const rarity = card.copy.card.rarity;
    const color = rarityColor(rarity);
    const at = new Vector3(0, 0.15, REVEAL_Z);
    const scale = this.centerScale(REVEAL_Z);
    card.tiltAmount = 0.35;

    this.sfx.deal();
    await gsap
      .timeline()
      .to(card.root.position, { x: at.x, y: at.y, z: at.z, duration: 0.4, ease: 'power3.out' }, 0)
      .to(card.root.scale, { x: scale, y: scale, z: scale, duration: 0.4, ease: 'power3.out' }, 0)
      .to(card.root.rotation, { z: 0, duration: 0.4 }, 0);

    // Card Hint: SR and above shake and gather light before flipping.
    if (rank(rarity) >= rank('SR')) {
      const ssr = rarity === 'SSR';
      const duration = ssr ? 1.4 : 0.85;
      const gatherColor = ssr ? () => (Math.random() < 0.6 ? color : rainbow()) : color;
      this.sfx.charge(rarity, duration);
      gsap.to(card.auraMaterial, { opacity: ssr ? 1 : 0.75, duration });
      gsap.to(card.uniforms.glow, { value: 0.2, duration });
      const waves = 7;
      for (let k = 0; k < waves; k++) {
        gsap.delayedCall((k * duration) / waves, () =>
          this.particles.gather(at, { count: ssr ? 45 : 22, color: gatherColor, radius: 3.2 * scale, duration: duration * 0.7 }),
        );
      }
      const shake = { p: 0 };
      await gsap.to(shake, {
        p: 1,
        duration,
        ease: 'power1.in',
        onUpdate: () => {
          const amp = shake.p * (ssr ? 0.09 : 0.05);
          card.flipper.rotation.z = Math.sin(shake.p * duration * 70) * amp;
          card.flipper.position.x = Math.sin(shake.p * duration * 53) * amp * 0.6;
        },
      });
      card.flipper.rotation.z = 0;
      card.flipper.position.x = 0;
    }

    // Reveal: flip, then burst.
    this.sfx.flip();
    const tl = gsap.timeline();
    tl.to(card.flipper.rotation, { y: 0, duration: 0.5, ease: 'power3.inOut' }, 0)
      .to(card.root.scale, { x: scale * 1.12, y: scale * 1.12, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0)
      .call(() => this.onRevealBurst(card, at, color), [], 0.24);
    await tl;

    if (rarity === 'SSR') await this.showcase(card, multi);
  }

  private onRevealBurst(card: CardView, at: Vector3, color: Color) {
    const rarity = card.copy.card.rarity;
    const ssr = rarity === 'SSR';
    this.sfx.reveal(rarity);
    this.particles.burst(at, {
      count: BURST_COUNT[rarity],
      color: ssr ? () => (Math.random() < 0.5 ? color : rainbow()) : color,
      speed: 3 + rank(rarity) * 2,
      size: 0.14 + rank(rarity) * 0.03,
      gravity: -1.2,
      life: 1 + rank(rarity) * 0.25,
      spread: new Vector3(CARD_W * 0.3, CARD_H * 0.3, 0.1),
    });
    gsap.fromTo(card.uniforms.glow, { value: 0.5 + rank(rarity) * 0.15 }, { value: 0, duration: 0.9 });
    const auraRest = rank(rarity) >= rank('SR') ? 0.45 : 0;
    gsap.fromTo(card.auraMaterial, { opacity: 0.4 + rank(rarity) * 0.25 }, { opacity: auraRest, duration: 1.2 });
    if (rarity === 'SR') {
      this.overlay.flash(RARITY_CSS.SR, 0.35, 0.6);
      this.bloomSpike(0.8, 0.8);
    }
    if (ssr) {
      this.overlay.flash('#ffffff', 0.9, 1);
      this.shake(0.25, 0.6);
      this.bloomSpike(1.8, 1.4);
    }
  }

  /** SSR Showcase: dim the world, rays behind the card, caption, and full viewer tilt. */
  private async showcase(card: CardView, multi: boolean) {
    this.overlay.showRevealAll(false);
    const gold = rarityColor('SSR');
    const view = this.stage.viewSize(SHOWCASE_Z);
    const scale = Math.min(1.35, (view.w * 0.8) / CARD_W, (view.h * 0.58) / CARD_H);
    const y = view.h * 0.06;

    this.rays.uniforms.color.value.copy(gold);
    this.rays.mesh.position.set(0, y, SHOWCASE_Z - 0.4);
    gsap.to(this.dimmer.material, { opacity: 0.8, duration: 0.6 });
    gsap.to(this.rays.uniforms.opacity, { value: 1, duration: 0.8 });
    gsap.to(card.root.position, { x: 0, y, z: SHOWCASE_Z, duration: 0.7, ease: 'power3.out' });
    gsap.to(card.root.scale, { x: scale, y: scale, z: scale, duration: 0.7, ease: 'power3.out' });
    card.tiltAmount = 1;
    this.setAmbient(card.root, CARD_W * scale * 0.7, 25, gold, true);
    this.overlay.showCaption(card.copy.card);

    await delay(0.8);
    this.overlay.setPrompt('拖曳欣賞・點擊繼續');
    while ((await this.waitAdvance(false)) !== 'tap');

    this.overlay.setPrompt(null);
    this.overlay.showCaption(null);
    this.ambient = null;
    card.tiltAmount = 0.35;
    gsap.to(this.dimmer.material, { opacity: 0, duration: 0.4 });
    gsap.to(this.rays.uniforms.opacity, { value: 0, duration: 0.4 });
    if (multi && !this.skipping) this.overlay.showRevealAll(true);
  }

  private toTray(card: CardView, slot: Slot) {
    card.tiltAmount = 0.1;
    gsap.to(card.root.position, { x: slot.x, y: slot.y, z: TRAY_Z, duration: 0.5, ease: 'power3.inOut' });
    gsap.to(card.root.scale, { x: slot.scale, y: slot.scale, z: slot.scale, duration: 0.5, ease: 'power3.inOut' });
    gsap.to(card.root.rotation, { z: 0, duration: 0.5 });
    gsap.to(card.uniforms.brightness, { value: 0.55, duration: 0.5 });
    gsap.to(card.auraMaterial, { opacity: rank(card.copy.card.rarity) >= rank('SR') ? 0.25 : 0, duration: 0.5 });
  }

  /** Reveal All: a non-SSR card flips on its way to its slot, without a Card Hint. */
  private quickToTray(card: CardView, slot: Slot) {
    this.sfx.flip();
    this.toTray(card, slot);
    gsap.to(card.flipper.rotation, { y: 0, duration: 0.45, ease: 'power2.inOut' });
    gsap.delayedCall(0.45, () =>
      this.particles.burst(new Vector3(slot.x, slot.y, TRAY_Z), {
        count: BURST_COUNT[card.copy.card.rarity] * 0.3,
        color: rarityColor(card.copy.card.rarity),
        speed: 2,
        size: 0.1,
      }),
    );
  }

  private async summary(): Promise<SummaryAction> {
    this.layoutSummary(0.6);
    this.cards.forEach((card) => {
      card.tiltAmount = 0.2;
      gsap.to(card.uniforms.brightness, { value: 1, duration: 0.5 });
    });
    this.overlay.showSummary(true);
    this.mode = 'summary';

    const action = await new Promise<SummaryAction>((resolve) => {
      this.overlay.onSummary = (a) => resolve(a);
    });
    this.overlay.onSummary = undefined;
    this.sfx.click();
    this.mode = 'idle';
    if (this.inspecting) this.uninspect();
    this.overlay.showSummary(false);
    return action;
  }

  private layoutSummary(duration: number) {
    this.slots = this.gridLayout(this.cards.length);
    this.cards.forEach((card, i) => {
      if (card === this.inspecting) return;
      const s = this.slots[i];
      gsap.to(card.root.position, { x: s.x, y: s.y, z: 0, duration, ease: 'power3.inOut', delay: i * 0.03 });
      gsap.to(card.root.scale, { x: s.scale, y: s.scale, z: s.scale, duration, ease: 'power3.inOut', delay: i * 0.03 });
    });
  }

  private inspect(card: CardView) {
    this.inspecting = card;
    this.sfx.flip();
    const z = SHOWCASE_Z + 0.5;
    const view = this.stage.viewSize(z);
    const scale = Math.min(1.3, (view.w * 0.85) / CARD_W, (view.h * 0.7) / CARD_H);
    card.tiltAmount = 1;
    gsap.to(this.dimmer.material, { opacity: 0.75, duration: 0.4 });
    gsap.to(card.root.position, { x: 0, y: 0, z, duration: 0.5, ease: 'power3.out' });
    gsap.to(card.root.scale, { x: scale, y: scale, z: scale, duration: 0.5, ease: 'power3.out' });
  }

  private uninspect() {
    const card = this.inspecting!;
    this.inspecting = null;
    const s = this.slots[this.cards.indexOf(card)];
    card.tiltAmount = 0.2;
    gsap.to(this.dimmer.material, { opacity: 0, duration: 0.4 });
    gsap.to(card.root.position, { x: s.x, y: s.y, z: 0, duration: 0.45, ease: 'power3.inOut' });
    gsap.to(card.root.scale, { x: s.scale, y: s.scale, z: s.scale, duration: 0.45, ease: 'power3.inOut' });
  }

  private async clearCards() {
    const cards = this.cards;
    this.cards = [];
    await Promise.all(
      cards.map((card, i) =>
        gsap.to(card.root.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.3, delay: i * 0.02, ease: 'back.in(2)' }),
      ),
    );
    cards.forEach((c) => c.dispose());
  }

  // ---------------------------------------------------------------- input

  private onTap(tap: Tap) {
    if (this.mode === 'tear') this.autoTear?.();
    else if (this.mode === 'advance') this.advance.fire('tap');
    else if (this.mode === 'summary') {
      if (this.inspecting) {
        this.uninspect();
        return;
      }
      this.raycaster.setFromCamera(tap.ndc, this.stage.camera);
      const hits = this.raycaster.intersectObjects(this.cards.map((c) => c.front));
      const hit = hits[0] && this.cards.find((c) => c.front === hits[0].object);
      if (hit) this.inspect(hit);
    }
  }

  private async waitAdvance(allowSkip = true): Promise<'tap' | 'skip'> {
    if (allowSkip && this.skipping) return 'skip';
    this.mode = 'advance';
    const result = await this.advance.wait();
    this.mode = 'idle';
    return result;
  }

  // ---------------------------------------------------------------- frame

  private update(dt: number, time: number) {
    this.input.update(dt);
    this.backdrop.update(dt, time);
    this.rays.update(time);
    this.dimmer.update();
    this.pack?.update(time);
    for (const card of this.cards) card.update(time, this.input.tilt);
    this.emitAmbient(dt);
    this.particles.update(dt);
  }

  private emitAmbient(dt: number) {
    const a = this.ambient;
    if (!a || a.rate === 0) return;
    a.carry += a.rate * dt;
    while (a.carry >= 1) {
      a.carry -= 1;
      const ang = Math.random() * Math.PI * 2;
      const at = a.at.clone().add(new Vector3(Math.cos(ang) * a.radius, Math.sin(ang) * a.radius * 1.3, 0.2));
      this.particles.burst(at, { count: 1, color: a.color, speed: 0.4, gravity: 0.8, size: 0.12, life: 1.6 });
    }
  }

  private setAmbient(target: Object3D, radius: number, rate: number, color: Color, rainbowMix: boolean) {
    this.ambient = {
      at: this.worldOf(target),
      radius,
      rate,
      color: rainbowMix ? () => (Math.random() < 0.6 ? color : rainbow()) : () => color,
      carry: 0,
    };
  }

  // ---------------------------------------------------------------- helpers

  private ensurePack(): PackView {
    if (this.pack) return this.pack;
    const pack = new PackView();
    this.pack = pack;
    const view = this.stage.viewSize(0);
    const scale = Math.min(1, (view.w * 0.68) / PACK_W, (view.h * 0.5) / PACK_H);
    pack.root.scale.setScalar(scale);
    pack.root.position.set(0, -9, 0);
    pack.color.copy(HOME_PACK_COLOR);
    this.stage.scene.add(pack.root);
    gsap.to(pack.root.position, { y: 0, duration: 1, ease: 'back.out(1.3)' });
    return pack;
  }

  private centerScale(z: number): number {
    const view = this.stage.viewSize(z);
    return Math.min(1.1, (view.w * 0.72) / CARD_W, (view.h * 0.56) / CARD_H);
  }

  /** Summary grid: picks the column count that makes cards largest, leaving room for header and buttons. */
  private gridLayout(n: number): Slot[] {
    const view = this.stage.viewSize(0);
    const top = 0.13;
    const bottom = 0.2;
    const availW = view.w * 0.92;
    const availH = view.h * (1 - top - bottom);
    const centerY = (view.h * (bottom - top)) / 2;
    let best = { cols: 1, scale: 0 };
    for (let cols = 1; cols <= n; cols++) {
      const rows = Math.ceil(n / cols);
      const scale = Math.min(availW / cols / (CARD_W * 1.08), availH / rows / (CARD_H * 1.08));
      if (scale > best.scale) best = { cols, scale };
    }
    const scale = Math.min(best.scale, 1);
    const cols = best.cols;
    const rows = Math.ceil(n / cols);
    const cellW = CARD_W * scale * 1.08;
    const cellH = CARD_H * scale * 1.08;
    return Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / cols);
      const inRow = Math.min(cols, n - row * cols);
      const col = i % cols;
      return {
        x: (col - (inRow - 1) / 2) * cellW,
        y: centerY + ((rows - 1) / 2 - row) * cellH,
        scale,
      };
    });
  }

  private onResize() {
    if (this.mode === 'summary') this.layoutSummary(0.3);
  }

  private worldOf(obj: Object3D): Vector3 {
    return obj.getWorldPosition(new Vector3());
  }

  private shake(intensity: number, duration: number) {
    if (this.reducedMotion) return;
    const s = this.stage.shake;
    const state = { k: 1 };
    gsap.to(state, {
      k: 0,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        s.set((Math.random() - 0.5) * 2 * intensity * state.k, (Math.random() - 0.5) * 2 * intensity * state.k);
      },
      onComplete: () => {
        s.set(0, 0);
      },
    });
  }

  private bloomSpike(extra: number, duration: number) {
    gsap.fromTo(this.stage.bloom, { strength: BASE_BLOOM + extra }, { strength: BASE_BLOOM, duration, ease: 'power2.out' });
  }
}
