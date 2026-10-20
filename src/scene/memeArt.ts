/** Hand-made specs for every Meme Cat, drawn after reference images of each meme. */
import {
  INK,
  seededRandom,
  type Head,
  bigText,
  burstLines,
  motionLines,
  notes,
  sparkle,
  type ArtArea,
  type CatSpec,
} from './catKit';

export const MEME_SPECS: Record<string, CatSpec> = {
  'ssr-oiia': {
    // Ethel: grey tabby standing square on all fours, blank stare, white socks
    fur: '#8f8a84',
    stripes: '#55504a',
    muzzle: '#e4ded6',
    paws: '#f4f0ea',
    eyes: 'normal',
    iris: '#b8b070',
    mouth: 'w',
    pose: 'quad',
    // Like the meme: holds still for a second after being turned face up, then one quick turn,
    // a one-second stop, another turn, and so on
    motion: { kind: 'spin', period: 1, delay: 1, pause: 1 },
    s: 0.8,
    dx: 45,
    dy: -78,
  },
  'ssr-grumpy': {
    fur: '#efe4d2',
    mask: '#8b6a4e',
    eyes: 'grumpy',
    iris: '#7cc6ee',
    mouth: 'frown',
    // Wide, flat face with heavy jowls
    head: { w: 1.08, h: 0.92, jowl: 0.2, fluff: 0.1 },
    pose: 'sit',
    s: 1.05,
    dy: -25,
  },
  'sr-nyan': {
    fur: '#9a9aa2',
    eyes: 'dot',
    mouth: 'w',
    blush: true,
    s: 0.55,
    dx: 95,
    dy: -5,
    // Flying: the rainbow ripples, the legs paddle, the tail wags and the stars twinkle
    motion: { kind: 'scene', period: 1 },
    back: (ctx, a, head, bout) => {
      // Six animation steps a second, like the original GIF
      const step = bout === undefined ? 0 : Math.floor(bout * 6);
      const colors = ['#ff3b3b', '#ff9a2a', '#ffe02a', '#4ad83a', '#2a9aff', '#8a4aff'];
      const bodyX = head.x - 175;
      const top = head.y - 60;
      colors.forEach((c, i) => {
        ctx.fillStyle = c;
        for (let x = a.x - 10; x < bodyX + 20; x += 40) {
          const wave = ((Math.floor((x - a.x) / 40) + step) % 2) * 8;
          ctx.fillRect(x, top + i * 20 + wave, 41, 21);
        }
      });
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.fillStyle = '#f2c98a';
      ctx.beginPath();
      ctx.roundRect(bodyX, top - 15, 190, 150, 18);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff9ad2';
      ctx.beginPath();
      ctx.roundRect(bodyX + 14, top - 1, 162, 122, 14);
      ctx.fill();
      ctx.fillStyle = '#e8287a';
      for (let i = 0; i < 12; i++) ctx.fillRect(bodyX + 30 + ((i * 53) % 130), top + 15 + ((i * 37) % 95), 9, 9);
      ctx.fillStyle = '#9a9aa2';
      const paddle = step % 2 ? 8 : -8;
      [bodyX + 15, bodyX + 60, bodyX + 120, bodyX + 160].forEach((lx, i) => {
        ctx.beginPath();
        ctx.roundRect(lx + (i % 2 ? paddle : -paddle), top + 128, 24, 30, 8);
        ctx.fill();
        ctx.stroke();
      });
      ctx.beginPath();
      ctx.roundRect(bodyX - 40, top + 60 + (step % 2 ? 8 : -6), 48, 20, 10);
      ctx.fill();
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const r = 10 + ((i + step) % 3) * 5;
        sparkle(ctx, a.x + 40 + ((i * 97) % (a.w - 60)), a.y + 40 + ((i * 151) % (a.h - 60)), r);
      }
    },
  },
  'sr-chipi': {
    // Blurry close-up of a brown tabby nodding along, big eyes looking up
    fur: '#8a7a6a',
    stripes: '#4e4236',
    muzzle: '#d8c0a0',
    eyes: 'wide',
    iris: '#9a8a50',
    bigPupil: true,
    mouth: 'w',
    tilt: -0.18,
    s: 1.35,
    dy: 40,
    front: (ctx, a) => {
      notes(ctx, a, ['♪', '♫', '♪']);
      bigText(ctx, 'CHIPI CHIPI', a.x + a.w / 2, a.y + 40, 40, '#ffe14a', 0);
    },
  },
  'sr-happy': {
    // Small grey tabby-and-white kitten standing up, arms flung wide, staring straight ahead
    fur: '#f6f2ec',
    eyes: 'wide',
    iris: '#4a3a30',
    bigPupil: true,
    mouth: 'flat',
    pose: 'stand',
    armsUp: true,
    // Hops on the spot, over and over
    motion: { kind: 'jump', period: 0.5 },
    s: 0.7,
    dy: -85,
    earColor: '#8a8a92',
    cover: (ctx) => {
      ctx.fillStyle = '#8a8a92';
      ctx.beginPath();
      ctx.ellipse(-60, -70, 65, 45, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(70, -60, 50, 40, -0.3, 0, Math.PI * 2);
      ctx.fill();
      // Tabby stripes across the grey cap
      ctx.strokeStyle = '#5e5e66';
      ctx.lineWidth = 7;
      for (const x of [-30, 0, 30]) {
        ctx.beginPath();
        ctx.moveTo(x * 1.1, -94);
        ctx.lineTo(x * 0.8, -62);
        ctx.stroke();
      }
    },
    front: (ctx, a) => {
      bigText(ctx, 'HAPPY', a.x + a.w / 2, a.y + 46, 46, '#ffe14a', 0);
      sparkle(ctx, a.x + 50, a.y + 120, 18);
      sparkle(ctx, a.x + a.w - 50, a.y + 150, 14);
    },
  },
  'sr-pop': {
    // White cat, grey-brown patches over both ears, whole face swallowed by a round "pop"
    fur: '#f6f3ee',
    eyes: 'dot',
    mouth: 'pop',
    // Pop, shut, pop, shut
    motion: { kind: 'mouth', period: 0.5, mouth: 'w' },
    head: { h: 1.03, fluff: 0.05 },
    s: 1.2,
    dy: 15,
    cover: (ctx) => {
      ctx.fillStyle = '#8a7a6a';
      ctx.beginPath();
      ctx.ellipse(-82, -58, 58, 52, 0.4, 0, Math.PI * 2);
      ctx.ellipse(92, -62, 40, 40, -0.4, 0, Math.PI * 2);
      ctx.fill();
    },
    back: (ctx, _a, head) => burstLines(ctx, head.x, head.y + 50, 12, 165, 215, 'rgba(255,255,255,0.55)'),
  },
  'r-huh': {
    // Ben: round white cat, small head, black comb-over, wide pale yellow-green eyes,
    // dark stripes down one flank, jaw dropped - "huh?"
    fur: '#fbfbf8',
    eyes: 'wide',
    iris: '#c4c88a',
    mouth: 'gasp',
    // Round, fluffy and jowly
    head: { h: 1.04, jowl: 0.12, fluff: 0.13 },
    pose: 'chonk',
    // Head bobs up and down, over and over
    motion: { kind: 'nod', period: 1 },
    bodyPatch: '#fbfbf8',
    s: 0.76,
    dy: -98,
    tilt: -0.08,
    cover: (ctx) => {
      ctx.fillStyle = '#1e1c22';
      ctx.beginPath();
      ctx.moveTo(-78, -66);
      ctx.bezierCurveTo(-60, -96, -20, -82, 0, -92);
      ctx.bezierCurveTo(24, -102, 60, -84, 82, -70);
      ctx.lineTo(80, -58);
      ctx.bezierCurveTo(50, -70, 24, -76, 4, -68);
      ctx.bezierCurveTo(-24, -60, -54, -72, -78, -54);
      ctx.closePath();
      ctx.fill();
    },
    back: (ctx, a) => {
      const g = ctx.createLinearGradient(0, a.y, 0, a.y + a.h);
      g.addColorStop(0, '#0c0c10');
      g.addColorStop(0.65, '#2a2a30');
      g.addColorStop(1, '#8a8a90');
      ctx.fillStyle = g;
      ctx.fillRect(a.x, a.y, a.w, a.h);
    },
    front: (ctx, a) => {
      bigText(ctx, '？', a.x + a.w - 70, a.y + 80, 90, '#ffffff', -0.2);
      bigText(ctx, 'huh', a.x + 80, a.y + 70, 52, '#ffffff', 0.15);
    },
  },
  'r-maxwell': {
    // Black loaf with a white chin, chest and paws, small head on the right, spinning
    fur: '#1e1e24',
    darkFur: true,
    belly: '#ffffff',
    muzzle: '#ffffff',
    paws: '#ffffff',
    eyes: 'normal',
    iris: '#8a9a6a',
    mouth: 'w',
    head: { w: 1.1, h: 0.9, jowl: 0.08, fluff: 0.05 },
    pose: 'loaf',
    s: 0.75,
    dx: 70,
    dy: -10,
    motion: { kind: 'spin', period: 4 },
    back: (ctx, a) => solidBg(ctx, a, '#f2f0ec'),
  },
  'r-smudge': {
    // Fluffy white cat at the dinner table, squinting in disgust over its plate
    fur: '#fbfbf8',
    eyes: 'side',
    iris: '#8aa070',
    mouth: 'gasp',
    s: 1.2,
    dy: 0,
    back: (ctx, a) => solidBg(ctx, a, '#1a1418'),
    front: (ctx, a) => {
      const cx = a.x + a.w / 2;
      const y = a.y + a.h - 30;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(cx, y, 200, 48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(36,26,46,0.25)';
      ctx.beginPath();
      ctx.ellipse(cx, y - 4, 150, 30, 0, 0, Math.PI * 2);
      ctx.stroke();
      const leaves = ['#5aa832', '#7cc444', '#3f8a24'];
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = leaves[i % 3];
        ctx.beginPath();
        ctx.ellipse(cx - 60 + i * 30, y - 16 - (i % 2) * 8, 24, 14, (i - 2) * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  'r-keyboard': {
    fur: '#e8a050',
    stripes: '#b8692a',
    eyes: 'normal',
    iris: '#a8c050',
    mouth: 'w',
    dy: -45,
    back: (ctx, _a, head) => {
      ctx.fillStyle = '#3f74d8';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(head.x, head.y + 175, 120, 95, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    },
    front: (ctx, a) => {
      const y = a.y + a.h - 95;
      const x = a.x + 40;
      const w = a.w - 80;
      ctx.fillStyle = '#e9e4d8';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, 80, 10);
      ctx.fill();
      ctx.stroke();
      const keyW = w / 14;
      for (let i = 0; i < 14; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + i * keyW + 2, y + 6, keyW - 4, 68);
        if (i % 7 !== 2 && i % 7 !== 6) {
          ctx.fillStyle = INK;
          ctx.fillRect(x + (i + 0.65) * keyW, y + 6, keyW * 0.7, 40);
        }
      }
      for (const side of [-1, 1]) {
        ctx.fillStyle = '#e8a050';
        ctx.beginPath();
        ctx.ellipse(a.x + a.w / 2 + side * 80, y + 12, 32, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      motionLines(ctx, a.x + a.w / 2 - 80, y - 30, 3);
      motionLines(ctx, a.x + a.w / 2 + 80, y - 30, 3);
    },
  },
  'r-banana': {
    // Crying kitten face poking out of a full banana suit, little paws sticking out
    fur: '#e2d2bc',
    eyes: 'teary',
    iris: '#2a2030',
    mouth: 'frown',
    noEars: true,
    s: 0.52,
    dy: -20,
    back: (ctx, a, head) => {
      solidBg(ctx, a, '#f6f4ee');
      bananaSuit(ctx, head);
    },
  },
  'r-vibing': {
    // White cat bobbing to the beat
    fur: '#f7f3ee',
    eyes: 'closed',
    mouth: 'smile',
    tilt: 0.3,
    s: 1.1,
    front: (ctx, a) => notes(ctx, a, ['♫', '♪', '♬']),
  },
  'n-polite': {
    // White cat, dark patch over one ear, big amber-green eyes, tight-lipped smile
    fur: '#fbfbf8',
    eyes: 'wide',
    iris: '#a8a050',
    bigPupil: true,
    mouth: 'polite',
    s: 1.35,
    dy: 35,
    cover: (ctx) => {
      ctx.fillStyle = '#3a3236';
      ctx.beginPath();
      ctx.ellipse(82, -55, 52, 66, -0.3, 0, Math.PI * 2);
      ctx.fill();
    },
    back: (ctx, a) => solidBg(ctx, a, '#7a3a32'),
  },
  'n-sad': {
    // White Scottish Fold, folded ears, glossy teary eyes, small sad mouth
    fur: '#fbfbf8',
    flatEars: true,
    eyes: 'teary',
    iris: '#2a2436',
    mouth: 'gasp',
    s: 1.3,
    dy: 30,
    tilt: -0.08,
    back: (ctx, a) => {
      solidBg(ctx, a, '#b8ab94');
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      for (let x = a.x; x < a.x + a.w; x += 44) ctx.fillRect(x, a.y, 18, a.h);
    },
  },
  'n-scream': {
    // Silver tabby kitten, eyes screwed shut, paws pressed to its cheeks like The Scream
    fur: '#c4c8cc',
    stripes: '#7a8086',
    eyes: 'slant',
    mouth: 'huge',
    s: 1.05,
    dy: 20,
    over: (ctx) => {
      ctx.fillStyle = '#c4c8cc';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(side * 98, 34, 26, 54, side * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    },
    front: (ctx, a) => {
      bigText(ctx, '啊', a.x + 60, a.y + 70, 56, '#ffffff', -0.2);
      bigText(ctx, '啊', a.x + a.w - 60, a.y + 90, 64, '#ffffff', 0.2);
    },
  },
  'n-shocked': {
    // White cat with brown tabby patches, eyes like saucers, mouth just open
    fur: '#fbf8f2',
    eyes: 'wide',
    iris: '#a8b078',
    mouth: 'o',
    s: 1.2,
    dy: 20,
    tilt: -0.05,
    earColor: '#a07a50',
    cover: (ctx) => {
      ctx.fillStyle = '#a07a50';
      ctx.beginPath();
      ctx.ellipse(-65, -68, 58, 42, 0.3, 0, Math.PI * 2);
      ctx.ellipse(68, -70, 55, 40, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#5e4630';
      ctx.lineWidth = 6;
      for (const x of [-80, -55, 55, 80]) {
        ctx.beginPath();
        ctx.moveTo(x, -92);
        ctx.lineTo(x * 0.9, -60);
        ctx.stroke();
      }
    },
    front: (ctx, a) => {
      bigText(ctx, '！', a.x + a.w - 60, a.y + 70, 72, '#fff27a', 0.15);
      bigText(ctx, '！', a.x + 55, a.y + 80, 58, '#fff27a', -0.15);
    },
  },
  'n-zoning': {
    // Black cat on a pink backdrop, half-lidded green eyes drifting off to one side
    fur: '#26232a',
    darkFur: true,
    eyes: 'side',
    iris: '#9ac85a',
    mouth: 'flat',
    s: 1.15,
    dy: -10,
    tilt: -0.06,
    back: (ctx, a, head) => {
      solidBg(ctx, a, '#ef9a96');
      ctx.fillStyle = '#26232a';
      ctx.beginPath();
      ctx.ellipse(head.x - 10, a.y + a.h + 40, 170, 200, 0, 0, Math.PI * 2);
      ctx.fill();
    },
    front: (ctx, a) => bigText(ctx, '…', a.x + a.w - 70, a.y + 60, 70, '#ffffff', 0),
  },
  'n-wajaja': {
    // Blurry cat cackling, mouth wide open
    fur: '#f2eeea',
    stripes: '#9a9090',
    eyes: 'happy',
    mouth: 'huge',
    s: 1.2,
    dy: 10,
    tilt: -0.12,
    front: (ctx, a) => bigText(ctx, 'WAJAJA', a.x + a.w / 2, a.y + 42, 46, '#ffe14a', -0.05),
  },
  'n-chips': {
    // White cat clutching a blue bag of crisps
    fur: '#f4f2ee',
    eyes: 'normal',
    iris: '#9aa0a8',
    mouth: 'w',
    pose: 'sit',
    dy: -40,
    front: (ctx, a, head) => {
      const x = head.x;
      const y = head.y + 150;
      ctx.fillStyle = '#2a5ad8';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x - 60, y - 40);
      ctx.lineTo(x + 60, y - 40);
      ctx.lineTo(x + 70, y + 90);
      ctx.lineTo(x - 70, y + 90);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#e8402a';
      ctx.beginPath();
      ctx.ellipse(x, y + 20, 36, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe14a';
      ctx.font = '900 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CHIPS', x, y + 28);
      ctx.fillStyle = '#f4f2ee';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(x + side * 62, y - 30, 26, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      void a;
    },
  },
  'n-staring': {
    // Orange-and-white cat, face pressed close to the camera
    fur: '#f0a860',
    stripes: '#c87a3a',
    muzzle: '#fff6ec',
    eyes: 'wide',
    iris: '#4a4840',
    bigPupil: true,
    mouth: 'flat',
    s: 1.35,
    dy: 30,
  },
  // ---------------------------------------------------------------- added in the 60-cat expansion

  'ssr-bongo': {
    // The doodle: a white blob behind the table edge, paws up, bongos below
    fur: '#ffffff',
    eyes: 'dot',
    mouth: 'w',
    noCat: true,
    // Like OIIA Cat: still for a second, a one-second burst of drumming, a one-second rest, again
    motion: { kind: 'scene', period: 1, delay: 1, pause: 1 },
    back: (ctx, a, _head, bout) => bongoCat(ctx, a, bout),
  },
  'ssr-floppa': {
    // Caracal with black ear tufts and a serious face
    fur: '#c99a63',
    earColor: '#4a3420',
    eyes: 'normal',
    iris: '#c89a3a',
    mouth: 'flat',
    tufts: true,
    bigEars: true,
    muzzle: '#f4e6d2',
    // Short-haired, broad and heavy-jawed
    head: { w: 1.05, jowl: 0.14, fluff: 0.03 },
    pose: 'sit',
    dy: -20,
    over: (ctx) => {
      // Black tear lines from the inner eye corners down to the muzzle, and dark lips
      ctx.strokeStyle = '#2a1e14';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(side * 22, 8);
        ctx.quadraticCurveTo(side * 30, 22, side * 36, 34);
        ctx.stroke();
      }
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-22, 50);
      ctx.quadraticCurveTo(0, 58, 22, 50);
      ctx.stroke();
    },
  },
  'ssr-longcat': {
    fur: '#ffffff',
    eyes: 'dot',
    mouth: 'w',
    s: 0.72,
    dy: -120,
    back: (ctx, a, head) => {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(head.x - 62, head.y + 20, 124, a.y + a.h - head.y + 40, 50);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(head.x - 70, head.y + 120, 22, 30, 0.3, 0, Math.PI * 2);
      ctx.ellipse(head.x + 70, head.y + 120, 22, 30, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      bigText(ctx, 'LOOOONG', a.x + a.w - 90, a.y + a.h - 60, 34, '#ffe14a', -1.2);
    },
  },
  'ssr-cheez': {
    // Chubby grey British Shorthair grinning: "I can has cheezburger?"
    fur: '#8e9aa6',
    muzzle: '#c9d0d8',
    eyes: 'normal',
    iris: '#e8a040',
    mouth: 'smile',
    pose: 'sit',
    s: 0.9,
    dy: -5,
    front: (ctx, a) => {
      bigText(ctx, 'I CAN HAS', a.x + a.w / 2, a.y + 38, 40, '#ffffff', 0);
      bigText(ctx, 'CHEEZBURGER?', a.x + a.w / 2, a.y + a.h - 34, 40, '#ffffff', 0);
    },
  },
  'sr-ceiling': {
    // Ginger cat peering down through a ragged hole in a grey ceiling
    fur: '#e2ad78',
    stripes: '#b8844e',
    muzzle: '#f2dcc0',
    eyes: 'wide',
    iris: '#c89a3a',
    bigPupil: true,
    mouth: 'w',
    s: 0.85,
    dy: -20,
    tilt: -0.08,
    back: (ctx, a, head) => {
      ctx.fillStyle = '#100c0c';
      ctx.beginPath();
      ceilingHole(ctx, head);
      ctx.fill();
      void a;
    },
    front: (ctx, a, head) => {
      const g = ctx.createLinearGradient(0, a.y, 0, a.y + a.h);
      g.addColorStop(0, '#c4c4c8');
      g.addColorStop(1, '#5a5a60');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.rect(a.x, a.y, a.w, a.h);
      ceilingHole(ctx, head);
      ctx.fill('evenodd');
      ctx.strokeStyle = '#f4f2ee';
      ctx.lineWidth = 9;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ceilingHole(ctx, head);
      ctx.stroke();
    },
  },
  'sr-thumbsup': {
    // Calico in tears, putting on a brave face
    fur: '#f6f2ec',
    eyes: 'teary',
    iris: '#2a2030',
    mouth: 'gasp',
    s: 1.25,
    dy: 30,
    earColor: '#c88a50',
    cover: (ctx) => {
      ctx.fillStyle = '#c88a50';
      ctx.beginPath();
      ctx.ellipse(-40, -82, 90, 40, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5a4636';
      ctx.beginPath();
      ctx.ellipse(70, -62, 50, 42, -0.3, 0, Math.PI * 2);
      ctx.fill();
    },
    back: (ctx, a) => solidBg(ctx, a, '#120e14'),
  },
  'sr-thurston': {
    // Fluffy white cat throwing its head back in a long howl, dark eyes wide open
    fur: '#f6f2ec',
    eyes: 'wide',
    iris: '#2a2832',
    bigPupil: true,
    mouth: 'huge',
    tilt: -0.35,
    dy: 25,
    front: (ctx, a) => bigText(ctx, '嗷嗚——', a.x + a.w - 110, a.y + 70, 54, '#ffffff', 0.15),
  },
  'sr-fresh': {
    // Ginger tabby right up against the glass, half-lidded, side-eyeing the camera
    fur: '#e8a868',
    stripes: '#c07838',
    muzzle: '#f6dcc0',
    eyes: 'side',
    iris: '#b89040',
    mouth: 'flat',
    s: 1.4,
    dy: 45,
    tilt: 0.12,
    front: glassGlare,
  },
  'sr-bingus': {
    // Hairless pink Sphynx with big black eyes and huge ears
    fur: '#e9b6a6',
    eyes: 'wide',
    iris: '#1e1a22',
    bigPupil: true,
    mouth: 'w',
    bigEars: true,
    cover: (ctx) => {
      ctx.strokeStyle = 'rgba(120, 60, 50, 0.55)';
      ctx.lineWidth = 4;
      for (const y of [-70, -56, -42]) {
        ctx.beginPath();
        ctx.moveTo(-36, y);
        ctx.quadraticCurveTo(0, y - 10, 36, y);
        ctx.stroke();
      }
    },
  },
  'sr-sideeye': {
    // Unimpressed tabby, eyes sliding sideways
    fur: '#a8a49c',
    stripes: '#6a665e',
    eyes: 'side',
    iris: '#d8c040',
    mouth: 'flat',
    tilt: -0.08,
    s: 1.1,
    front: (ctx, a) => bigText(ctx, '…', a.x + a.w - 70, a.y + 70, 70, '#ffffff', 0),
  },
  'r-mamaliele': {
    // Golden Scottish Fold, enormous green eyes, mouth going non-stop
    fur: '#d9a868',
    stripes: '#a87038',
    muzzle: '#f2dcc0',
    eyes: 'wide',
    iris: '#7ab84a',
    mouth: 'gasp',
    flatEars: true,
    s: 1.4,
    dy: 35,
    tilt: 0.1,
    back: (ctx, a) => {
      solidBg(ctx, a, '#8a7a6a');
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      for (const x of [a.x + a.w - 70, a.x + a.w - 30]) ctx.fillRect(x, a.y, 14, a.h);
    },
    front: (ctx, a) => speechBubble(ctx, a.x + 105, a.y + 70, '#@%&!'),
  },
  'r-mengbi': {
    // White cat with a ginger cap, utterly lost
    fur: '#f6f2ec',
    eyes: 'derp',
    iris: '#8a6a4a',
    mouth: 'o',
    s: 1.1,
    cover: (ctx) => {
      ctx.fillStyle = '#e09a5a';
      ctx.beginPath();
      ctx.ellipse(-30, -78, 85, 40, 0.2, 0, Math.PI * 2);
      ctx.fill();
    },
    earColor: '#e09a5a',
    front: (ctx, a) => {
      bigText(ctx, '？', a.x + a.w / 2 + 10, a.y + 52, 72, '#ffffff', 0.1);
      glassGlare(ctx, a);
    },
  },
  'r-wet': {
    // Soaked grey cat in a steel sink: slit-pupil yellow eyes, fangs, dripping fur
    fur: '#8e8a84',
    stripes: '#5a5650',
    flatEars: true,
    wet: true,
    eyes: 'wide',
    iris: '#e8d03a',
    slit: true,
    mouth: 'gasp',
    s: 1.15,
    dy: 10,
    back: (ctx, a) => {
      const g = ctx.createLinearGradient(a.x, a.y, a.x + a.w, a.y + a.h);
      g.addColorStop(0, '#a8acb0');
      g.addColorStop(0.5, '#d8dade');
      g.addColorStop(1, '#7a7e84');
      ctx.fillStyle = g;
      ctx.fillRect(a.x, a.y, a.w, a.h);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      const rand = seededRandom('sink');
      for (let i = 0; i < 24; i++) {
        ctx.beginPath();
        ctx.arc(a.x + rand() * a.w, a.y + rand() * a.h, 2 + rand() * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  'r-yamero': {
    // Grey-capped white cat bawling, teary eyes, fangs out: "YAMERO!!"
    fur: '#f2f0ec',
    eyes: 'teary',
    iris: '#2a2030',
    mouth: 'huge',
    s: 1.2,
    dy: 30,
    tilt: 0.1,
    earColor: '#4a4650',
    cover: (ctx) => {
      ctx.fillStyle = '#4a4650';
      ctx.beginPath();
      ctx.ellipse(-55, -60, 72, 52, 0.3, 0, Math.PI * 2);
      ctx.ellipse(60, -70, 62, 42, -0.3, 0, Math.PI * 2);
      ctx.fill();
    },
    front: (ctx, a) => bigText(ctx, 'YAMERO!!', a.x + a.w / 2, a.y + 44, 52, '#ffffff', 0),
  },
  'r-no': {
    // White kitten with a dark cap, huge round dark eyes and a red bell collar
    fur: '#f8f6f2',
    eyes: 'wide',
    iris: '#2a2026',
    bigPupil: true,
    mouth: 'w',
    // Shakes its head: no, no, no
    motion: { kind: 'shake', period: 0.6 },
    pose: 'sit',
    s: 0.95,
    dy: -20,
    earColor: '#6a5e58',
    cover: (ctx) => {
      ctx.fillStyle = '#4a4240';
      ctx.beginPath();
      ctx.ellipse(-62, -66, 60, 46, 0.4, 0, Math.PI * 2);
      ctx.ellipse(66, -60, 52, 50, -0.4, 0, Math.PI * 2);
      ctx.fill();
    },
    front: (ctx, a, head) => {
      collarBell(ctx, head.x - 20, head.y + 100 * head.s);
      bigText(ctx, 'NO.', a.x + a.w / 2, a.y + 44, 60, '#ffffff', 0);
    },
  },
  'r-lilbub': {
    // Tiny brown tabby with huge green-yellow eyes and a permanent tongue-out
    fur: '#9a8a72',
    stripes: '#5e5040',
    muzzle: '#ece4d8',
    eyes: 'wide',
    iris: '#a8b45a',
    mouth: 'blep',
    pose: 'sit',
    s: 0.85,
    dy: -10,
  },
  'n-sleep': {
    // Grey-and-white Scottish Fold slumped back on its bottom, chin up, fast asleep
    fur: '#a8a8b0',
    belly: '#f2f2f4',
    flatEars: true,
    eyes: 'closed',
    mouth: 'w',
    pose: 'chonk',
    s: 0.62,
    dy: -80,
    tilt: -0.35,
    front: (ctx, a) => {
      bigText(ctx, 'Z', a.x + a.w - 130, a.y + 120, 44, '#ffffff', 0.2);
      bigText(ctx, 'z', a.x + a.w - 95, a.y + 85, 36, '#ffffff', 0.2);
      bigText(ctx, 'z', a.x + a.w - 65, a.y + 55, 28, '#ffffff', 0.2);
    },
  },
  'n-barbara': {
    // Curly-coated grey Devon Rex, furious
    fur: '#8a8078',
    stripes: '#5a524a',
    bigEars: true,
    eyes: 'grumpy',
    iris: '#c87a2a',
    mouth: 'frown',
    s: 1.05,
    front: (ctx, a) => angerMark(ctx, a.x + a.w - 80, a.y + 80),
  },
  'n-clip': {
    // Ginger-and-white cat politely holding chopsticks: "您好，我吃一點"
    fur: '#e8a868',
    stripes: '#c07838',
    muzzle: '#fbf6ee',
    belly: '#fbf6ee',
    // Beaming: eyes squeezed into happy arcs, pink cheeks
    eyes: 'happy',
    blush: true,
    mouth: 'w',
    pose: 'sit',
    s: 0.85,
    dx: -40,
    dy: -45,
    tilt: 0.15,
    front: (ctx, a, head) => {
      chopsticks(ctx, head.x + 90, head.y + 140 * head.s);
      bigText(ctx, '您好 我吃一點', a.x + a.w / 2, a.y + a.h - 30, 34, '#ffffff', 0);
    },
  },
  'n-luna': {
    // White cat with a tabby cap, leaning into the lens: huge dark eyes, green screen
    fur: '#f8f6f2',
    eyes: 'wide',
    iris: '#2a2420',
    bigPupil: true,
    mouth: 'w',
    s: 1.45,
    dy: 60,
    earColor: '#7a6a5a',
    cover: (ctx) => {
      ctx.fillStyle = '#7a6a5a';
      ctx.beginPath();
      ctx.ellipse(0, -72, 110, 42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3e3228';
      ctx.lineWidth = 7;
      for (const x of [-30, 0, 30]) {
        ctx.beginPath();
        ctx.moveTo(x, -92);
        ctx.lineTo(x * 0.8, -60);
        ctx.stroke();
      }
    },
    back: (ctx, a) => solidBg(ctx, a, '#3acf3a'),
  },
};


// ---------------------------------------------------------------- props

function glassGlare(ctx: CanvasRenderingContext2D, a: ArtArea) {
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineCap = 'round';
  for (const [x, w] of [
    [a.x + 60, 26],
    [a.x + 110, 10],
    [a.x + a.w - 120, 18],
  ]) {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x, a.y + a.h);
    ctx.lineTo(x + 120, a.y);
    ctx.stroke();
  }
}

function speechBubble(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(x, y, 90, 46, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 40, y + 36);
  ctx.lineTo(x - 70, y + 80);
  ctx.lineTo(x - 10, y + 44);
  ctx.fill();
  ctx.fillStyle = '#e8402a';
  ctx.font = '900 40px "Noto Sans TC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y + 2);
}

function angerMark(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = '#ff3a3a';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  for (const [sx, sy] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ]) {
    ctx.beginPath();
    ctx.moveTo(x + sx * 10, y + sy * 34);
    ctx.quadraticCurveTo(x + sx * 10, y + sy * 10, x + sx * 34, y + sy * 10);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------- props for the reference redraw

function solidBg(ctx: CanvasRenderingContext2D, a: ArtArea, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(a.x, a.y, a.w, a.h);
}

/** `bout`: seconds into a burst of drumming, or undefined to hold both paws up. */
function bongoCat(ctx: CanvasRenderingContext2D, a: ArtArea, bout?: number) {
  solidBg(ctx, a, '#fbf8f2');
  const ly = (x: number) => a.y + 175 + (x - a.x) * 0.2;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  // Blob body with two ears, cut off by the table edge
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(a.x + 60, ly(a.x + 60));
  ctx.bezierCurveTo(a.x + 60, a.y + 120, a.x + 140, a.y + 80, a.x + 240, a.y + 82);
  ctx.lineTo(a.x + 292, a.y + 22);
  ctx.lineTo(a.x + 330, a.y + 86);
  ctx.lineTo(a.x + 392, a.y + 30);
  ctx.lineTo(a.x + 404, a.y + 110);
  ctx.bezierCurveTo(a.x + 418, a.y + 150, a.x + 420, a.y + 200, a.x + 410, ly(a.x + 410));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Face
  ctx.fillStyle = INK;
  for (const [x, y] of [
    [a.x + 222, a.y + 168],
    [a.x + 322, a.y + 178],
  ]) {
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(a.x + 264, a.y + 180, 8, 0, Math.PI);
  ctx.moveTo(a.x + 288, a.y + 182);
  ctx.arc(a.x + 280, a.y + 182, 8, 0, Math.PI);
  ctx.stroke();
  // Bongos under the table edge
  for (const cx of [a.x + 120, a.x + 316]) {
    const top = ly(cx) + 44;
    ctx.fillStyle = '#d8b07a';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx - 74, top);
    ctx.lineTo(cx - 58, top + 112);
    ctx.lineTo(cx + 58, top + 112);
    ctx.lineTo(cx + 74, top);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1e1c22';
    ctx.fillRect(cx - 76, top - 6, 152, 14);
    ctx.fillRect(cx - 60, top + 104, 120, 10);
    ctx.fillStyle = '#efe0c4';
    ctx.beginPath();
    ctx.ellipse(cx, top - 6, 76, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  // Table edge
  ctx.strokeStyle = INK;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(a.x, ly(a.x));
  ctx.lineTo(a.x + a.w, ly(a.x + a.w));
  ctx.stroke();
  // Paws: both raised while resting; while drumming they take turns slapping down, 8 hits a second
  const hit = bout === undefined ? -1 : Math.floor(bout * 8) % 2;
  [a.x + 150, a.x + 362].forEach((x, i) => {
    const down = i === hit;
    const y = ly(x) + (down ? -6 : -58);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(x, y, down ? 40 : 34, down ? 24 : 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (down) {
      // Slap lines around the paw
      ctx.lineWidth = 4;
      for (const [dx, dy, ex, ey] of [
        [-50, -14, -66, -26],
        [-44, -34, -54, -52],
        [50, -14, 66, -26],
        [44, -34, 54, -52],
      ]) {
        ctx.beginPath();
        ctx.moveTo(x + dx, y + dy);
        ctx.lineTo(x + ex, y + ey);
        ctx.stroke();
      }
      return;
    }
    // A raised paw shows its pink pads
    ctx.fillStyle = '#ff9aa8';
    ctx.beginPath();
    ctx.ellipse(x, y + 6, 11, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    for (const dx of [-16, 0, 16]) {
      ctx.beginPath();
      ctx.arc(x + dx, y - 12, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

/** Ragged hole in the ceiling around the head, in art coordinates. */
function ceilingHole(ctx: CanvasRenderingContext2D, head: Head) {
  const s = head.s;
  const pts = [
    [-150, -80],
    [-60, -112],
    [40, -100],
    [150, -118],
    [168, 10],
    [150, 96],
    [30, 110],
    [-80, 92],
    [-140, 104],
    [-162, 0],
  ];
  pts.forEach(([x, y], i) => {
    const px = head.x + x * s;
    const py = head.y + y * s;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
}



/** Red bell on a collar, hanging below the chin. */
function collarBell(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = '#3a2a2a';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x - 70, y - 10);
  ctx.quadraticCurveTo(x, y + 12, x + 70, y - 10);
  ctx.stroke();
  ctx.fillStyle = '#d8302a';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y + 14, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.arc(x - 5, y + 9, 5, 0, Math.PI * 2);
  ctx.fill();
}

function chopsticks(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(0.35);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  for (const dy of [-8, 8]) {
    ctx.fillStyle = '#1e1c22';
    ctx.fillRect(-20, dy - 4, 40, 8);
    ctx.fillStyle = '#e8706a';
    ctx.beginPath();
    ctx.moveTo(20, dy - 4);
    ctx.lineTo(140, dy - 1);
    ctx.lineTo(140, dy + 1);
    ctx.lineTo(20, dy + 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  // Paw holding them
  ctx.fillStyle = '#fbf6ee';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(-6, 0, 34, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/** Banana costume around a kitten face, with little limbs poking out. */
function bananaSuit(ctx: CanvasRenderingContext2D, head: Head) {
  const { x, y } = head;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  // Limbs first, so the suit covers their roots
  ctx.fillStyle = '#d8c4a8';
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + side * 150, y + 60, 34, 18, side * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(x + side * 50 - 18, y + 140, 36, 60, 14);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = '#f7d64a';
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 175);
  ctx.bezierCurveTo(x - 160, y - 120, x - 170, y + 120, x - 30, y + 170);
  ctx.lineTo(x + 60, y + 165);
  ctx.bezierCurveTo(x + 160, y + 100, x + 150, y - 110, x + 20, y - 175);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#8a6420';
  for (const [dx, dy, r] of [
    [-90, 40, 10],
    [70, 110, 14],
    [-40, 140, 8],
    [100, -60, 7],
  ]) {
    ctx.beginPath();
    ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#6b4a22';
  ctx.beginPath();
  ctx.roundRect(x - 14, y - 225, 28, 56, 6);
  ctx.fill();
  ctx.stroke();
}
