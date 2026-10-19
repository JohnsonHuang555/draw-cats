/** Hand-made specs for every Meme Cat, drawn after reference images of each meme. */
import {
  INK,
  bigText,
  burstLines,
  motionLines,
  notes,
  sparkle,
  spinArcs,
  type ArtArea,
  type CatSpec,
} from './catKit';

export const MEME_SPECS: Record<string, CatSpec> = {
  'ssr-oiia': {
    fur: '#8f8478',
    stripes: '#564c42',
    muzzle: '#d8cfc2',
    eyes: 'wide',
    mouth: 'huge',
    pose: 'sit',
    dy: -25,
    back: (ctx, _a, head) => spinArcs(ctx, head.x, head.y + 40, 190, 'rgba(255,255,255,0.8)'),
    front: (ctx, a) => bigText(ctx, 'OIIA', a.x + a.w / 2, a.y + 50, 58, '#ffffff', 0),
  },
  'ssr-grumpy': {
    fur: '#efe4d2',
    mask: '#8b6a4e',
    eyes: 'grumpy',
    iris: '#7cc6ee',
    mouth: 'frown',
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
    back: (ctx, a, head) => {
      const colors = ['#ff3b3b', '#ff9a2a', '#ffe02a', '#4ad83a', '#2a9aff', '#8a4aff'];
      const bodyX = head.x - 175;
      const top = head.y - 60;
      colors.forEach((c, i) => {
        ctx.fillStyle = c;
        for (let x = a.x - 10; x < bodyX + 20; x += 40) {
          const wave = (Math.floor((x - a.x) / 40) % 2) * 8;
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
      for (const lx of [bodyX + 15, bodyX + 60, bodyX + 120, bodyX + 160]) {
        ctx.beginPath();
        ctx.roundRect(lx, top + 128, 24, 30, 8);
        ctx.fill();
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.roundRect(bodyX - 40, top + 60, 48, 20, 10);
      ctx.fill();
      ctx.stroke();
      for (let i = 0; i < 6; i++) sparkle(ctx, a.x + 40 + ((i * 97) % (a.w - 60)), a.y + 40 + ((i * 151) % (a.h - 60)), 10 + (i % 3) * 5);
    },
  },
  'sr-chipi': {
    // Brown-grey tabby close-up, bobbing its head
    fur: '#9a8670',
    stripes: '#5e4c3a',
    muzzle: '#d8cbb8',
    eyes: 'half',
    iris: '#b8a050',
    mouth: 'w',
    tilt: 0.22,
    s: 1.2,
    dy: 20,
    front: (ctx, a) => {
      notes(ctx, a, ['♪', '♫', '♪']);
      bigText(ctx, 'CHIPI CHIPI', a.x + a.w / 2, a.y + a.h - 40, 40, '#ffe14a', 0);
    },
  },
  'sr-happy': {
    // Grey-brown cat standing on its hind legs, arms out
    fur: '#a89a88',
    muzzle: '#f0ebe4',
    eyes: 'dot',
    mouth: 'smile',
    pose: 'stand',
    s: 0.7,
    dy: -95,
    front: (ctx, a) => {
      bigText(ctx, 'HAPPY', a.x + a.w / 2, a.y + 46, 46, '#ffe14a', 0);
      sparkle(ctx, a.x + 50, a.y + 120, 18);
      sparkle(ctx, a.x + a.w - 50, a.y + 150, 14);
    },
  },
  'sr-pop': {
    // Cream cat with an orange ear patch, mouth popped wide open
    fur: '#f3ece2',
    eyes: 'normal',
    iris: '#8a7a50',
    mouth: 'huge',
    s: 1.15,
    dy: 10,
    cover: (ctx) => {
      ctx.fillStyle = '#d89a5a';
      ctx.beginPath();
      ctx.ellipse(-80, -60, 55, 45, 0.5, 0, Math.PI * 2);
      ctx.fill();
    },
    earColor: '#d89a5a',
    back: (ctx, _a, head) => burstLines(ctx, head.x, head.y + 50, 12, 165, 215, 'rgba(255,255,255,0.55)'),
  },
  'r-huh': {
    // Ben: a very round white cat with a small head, a thin black comb-over,
    // pale green eyes staring blankly and a dropped jaw - "huh?"
    fur: '#fbfbf8',
    eyes: 'wide',
    iris: '#b9c9a4',
    mouth: 'gasp',
    pose: 'chonk',
    bodyPatch: '#4a4650',
    s: 0.76,
    dy: -98,
    tilt: -0.08,
    cover: (ctx) => {
      // Wavy comb-over across the forehead
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
    front: (ctx, a) => {
      bigText(ctx, '？', a.x + a.w - 70, a.y + 80, 90, '#ffffff', -0.2);
      bigText(ctx, 'huh', a.x + 80, a.y + 70, 52, '#ffffff', 0.15);
    },
  },
  'r-maxwell': {
    // Black-and-white tuxedo cat lying in a loaf, spinning
    fur: '#1e1e24',
    darkFur: true,
    eyes: 'normal',
    iris: '#b8d84a',
    mouth: 'w',
    tuxedo: true,
    pose: 'loaf',
    s: 0.75,
    dx: 70,
    dy: -10,
    back: (ctx, a) => spinArcs(ctx, a.x + a.w / 2, a.y + a.h / 2 + 20, 190, 'rgba(255,255,255,0.7)'),
  },
  'r-smudge': {
    // White cat at the dinner table, disgusted at the salad
    fur: '#fbfbf8',
    eyes: 'squint',
    mouth: 'o',
    dy: -30,
    front: (ctx, a) => {
      const cx = a.x + a.w / 2;
      const y = a.y + a.h - 70;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(cx, y, 170, 42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      const leaves = ['#5aa832', '#7cc444', '#3f8a24', '#93d65a'];
      for (let i = 0; i < 9; i++) {
        ctx.fillStyle = leaves[i % 4];
        ctx.beginPath();
        ctx.ellipse(cx - 110 + i * 27, y - 18 - (i % 3) * 8, 30, 18, (i - 4) * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#e8402a';
      for (const dx of [-60, 15, 80]) {
        ctx.beginPath();
        ctx.arc(cx + dx, y - 30, 13, 0, Math.PI * 2);
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
    fur: '#f1ece4',
    eyes: 'teary',
    mouth: 'frown',
    noEars: true,
    under: (ctx) => {
      ctx.fillStyle = '#f7d64a';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(0, -8, 150, 140, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(side * 40, -120);
        ctx.quadraticCurveTo(side * 150, -200, side * 175, -100);
        ctx.quadraticCurveTo(side * 120, -130, side * 70, -95);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = '#6b4a22';
      ctx.fillRect(-12, -175, 24, 36);
      ctx.strokeRect(-12, -175, 24, 36);
    },
    cover: (ctx) => {
      ctx.fillStyle = '#f7d64a';
      ctx.fillRect(-200, -200, 400, 148);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-120, -52);
      ctx.quadraticCurveTo(0, -40, 120, -52);
      ctx.stroke();
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
    // White cat with a grey cap patch, tight-lipped polite smile
    fur: '#fbfbf8',
    eyes: 'normal',
    iris: '#3a2a20',
    mouth: 'polite',
    s: 1.15,
    dy: 10,
    cover: (ctx) => {
      ctx.fillStyle = '#6a6a72';
      ctx.beginPath();
      ctx.ellipse(55, -75, 70, 40, -0.3, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  'n-sad': {
    // Tortoiseshell cat with glossy eyes, head bowed
    fur: '#8a6a4a',
    stripes: '#4a3424',
    muzzle: '#c8a888',
    eyes: 'teary',
    iris: '#c8a040',
    mouth: 'frown',
    tilt: -0.12,
    s: 1.1,
    dy: 15,
    cover: (ctx) => {
      ctx.fillStyle = '#d88a3a';
      ctx.beginPath();
      ctx.ellipse(-70, 20, 40, 50, 0.3, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  'n-scream': {
    // Silver tabby kitten clutching its face, screaming
    fur: '#c4c8cc',
    stripes: '#7a8086',
    eyes: 'squeeze',
    mouth: 'huge',
    s: 1.05,
    over: (ctx) => {
      ctx.fillStyle = '#c4c8cc';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(side * 100, 20, 30, 42, side * -0.3, 0, Math.PI * 2);
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
    // Silver tabby with huge round eyes
    fur: '#b8b8b4',
    stripes: '#6e6e6a',
    muzzle: '#e8e8e4',
    eyes: 'wide',
    mouth: 'o',
    s: 1.12,
    front: (ctx, a) => {
      bigText(ctx, '！', a.x + a.w - 70, a.y + 80, 80, '#fff27a', 0.15);
      bigText(ctx, '！', a.x + 60, a.y + 90, 64, '#fff27a', -0.15);
    },
  },
  'n-zoning': {
    // Black cat staring into the middle distance
    fur: '#26232a',
    darkFur: true,
    eyes: 'half',
    iris: '#d8c040',
    mouth: 'flat',
    pose: 'sit',
    dy: -25,
    front: (ctx, a) => bigText(ctx, '…', a.x + a.w - 80, a.y + 70, 70, '#ffffff', 0),
  },
  'n-wajaja': {
    // White cat laughing its head off
    fur: '#fbfbf8',
    eyes: 'squeeze',
    mouth: 'huge',
    tilt: -0.15,
    s: 1.05,
    front: (ctx, a) => {
      bigText(ctx, 'WAJAJA', a.x + a.w / 2, a.y + a.h - 45, 48, '#ffe14a', -0.05);
      sparkle(ctx, a.x + 60, a.y + 70, 16);
    },
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
    eyes: 'normal',
    iris: '#c89a50',
    mouth: 'o',
    s: 1.35,
    dy: 30,
  },
  // ---------------------------------------------------------------- added in the 60-cat expansion

  'ssr-bongo': {
    // Plain white doodle cat slamming the bongos
    fur: '#ffffff',
    eyes: 'dot',
    mouth: 'w',
    dy: -40,
    front: (ctx, a) => {
      const y = a.y + a.h - 110;
      for (const side of [-1, 1]) {
        const x = a.x + a.w / 2 + side * 85;
        ctx.fillStyle = '#a0522d';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x - 62, y);
        ctx.lineTo(x - 48, y + 100);
        ctx.lineTo(x + 48, y + 100);
        ctx.lineTo(x + 62, y);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f2e1c0';
        ctx.beginPath();
        ctx.ellipse(x, y, 62, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(x - side * 6, y - 22, 30, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        motionLines(ctx, x - side * 6, y - 52, 3);
      }
    },
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
    pose: 'sit',
    dy: -20,
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
    fur: '#f4f4f4',
    eyes: 'normal',
    iris: '#c8b850',
    mouth: 'w',
    dy: -40,
    back: (ctx, a, head) => {
      ctx.fillStyle = '#1a1210';
      ctx.beginPath();
      ctx.ellipse(head.x, a.y + 175, 150 * head.s, 26, 0, 0, Math.PI * 2);
      ctx.fill();
    },
    front: (ctx, a) => {
      ctx.fillStyle = '#e8dcc6';
      ctx.fillRect(a.x, a.y, a.w, 175);
      ctx.strokeStyle = 'rgba(80, 60, 40, 0.35)';
      ctx.lineWidth = 3;
      for (let x = a.x; x < a.x + a.w; x += 74) ctx.strokeRect(x, a.y - 4, 74, 179);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y + 175);
      ctx.lineTo(a.x + a.w, a.y + 175);
      ctx.stroke();
    },
  },
  'sr-thumbsup': {
    // Grey-white cat, eyes brimming, giving a (human) thumbs up
    fur: '#b9b4ae',
    muzzle: '#f2efea',
    eyes: 'teary',
    iris: '#7aa0c8',
    mouth: 'frown',
    dx: -40,
    front: (ctx, a) => thumbsUp(ctx, a.x + a.w - 95, a.y + a.h - 120),
  },
  'sr-thurston': {
    // White cat throwing its head back in a long howl
    fur: '#f6f2ec',
    eyes: 'closed',
    mouth: 'huge',
    tilt: -0.35,
    dy: 25,
    front: (ctx, a) => bigText(ctx, '嗷嗚——', a.x + a.w - 110, a.y + 70, 54, '#ffffff', 0.15),
  },
  'sr-fresh': {
    // Orange tabby squashed against the glass, side-eyeing the camera
    fur: '#e0a066',
    stripes: '#b0703a',
    muzzle: '#f7e3cc',
    eyes: 'side',
    iris: '#c8a040',
    mouth: 'smirk',
    s: 1.2,
    dy: 15,
    front: glassGlare,
  },
  'sr-stepan': {
    // Tabby lounging at the table beside a glass of red wine
    fur: '#9a7a58',
    stripes: '#5e4630',
    muzzle: '#e6d6c0',
    eyes: 'half',
    iris: '#c8a040',
    mouth: 'flat',
    pose: 'loaf',
    s: 0.75,
    dx: 75,
    dy: 10,
    front: (ctx, a) => wineGlass(ctx, a.x + 85, a.y + a.h - 70),
  },
  'sr-bingus': {
    fur: '#e9b6a6',
    eyes: 'normal',
    iris: '#9cc85a',
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
  'sr-larry': {
    // Tabby-and-white cat on the step of No. 10
    fur: '#a68a6a',
    stripes: '#6a5038',
    muzzle: '#fbf8f2',
    eyes: 'normal',
    iris: '#b8c040',
    mouth: 'flat',
    pose: 'sit',
    s: 0.85,
    dy: -10,
    back: (ctx, a) => {
      ctx.fillStyle = '#8a3a2a';
      ctx.fillRect(a.x, a.y, a.w, a.h);
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 2;
      for (let y = a.y; y < a.y + a.h; y += 26) {
        ctx.beginPath();
        ctx.moveTo(a.x, y);
        ctx.lineTo(a.x + a.w, y);
        ctx.stroke();
      }
      const dx = a.x + a.w / 2 - 120;
      ctx.fillStyle = '#141418';
      ctx.fillRect(dx, a.y + 30, 240, a.h - 30);
      ctx.fillStyle = '#e8c860';
      ctx.font = '900 44px serif';
      ctx.textAlign = 'center';
      ctx.fillText('10', a.x + a.w / 2, a.y + 82);
    },
  },
  'r-dj': {
    // Tuxedo cat in shades, paw on the decks
    fur: '#26232a',
    darkFur: true,
    tuxedo: true,
    eyes: 'normal',
    mouth: 'w',
    dy: -40,
    over: sunglasses,
    front: (ctx, a, head) => {
      djDeck(ctx, a.x + a.w / 2, a.y + a.h - 70);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(head.x + 70, a.y + a.h - 118, 30, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      notes(ctx, a, ['♪', '♫', '♬']);
    },
  },
  'r-driver': {
    // Blue-grey cat behind the wheel, eyes on the road
    fur: '#7f93ad',
    muzzle: '#eef2f6',
    eyes: 'half',
    iris: '#d8c040',
    mouth: 'flat',
    dy: -35,
    front: (ctx, a) => steeringWheel(ctx, a.x + a.w / 2, a.y + a.h - 40, '#7f93ad'),
  },
  'r-mamaliele': {
    // Golden tabby, huge green eyes, grumbling non-stop
    fur: '#c8945a',
    stripes: '#8a5a2e',
    muzzle: '#f2dcc0',
    eyes: 'normal',
    iris: '#6ab84a',
    mouth: 'open',
    s: 1.2,
    dy: 25,
    front: (ctx, a) => speechBubble(ctx, a.x + a.w - 110, a.y + 70, '#@%&!'),
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
    // Soaked grey cat, ears flat, fur clumped
    fur: '#5a5652',
    darkFur: true,
    flatEars: true,
    wet: true,
    eyes: 'wide',
    mouth: 'flat',
    s: 1.1,
  },
  'r-yamero': {
    // Black-and-white cat bawling: "YAMERO!!"
    fur: '#f6f4f0',
    eyes: 'teary',
    iris: '#3a2a20',
    mouth: 'open',
    s: 1.05,
    dy: 20,
    cover: (ctx) => {
      ctx.fillStyle = '#26232a';
      ctx.beginPath();
      ctx.ellipse(-55, -60, 70, 50, 0.3, 0, Math.PI * 2);
      ctx.ellipse(60, -70, 60, 40, -0.3, 0, Math.PI * 2);
      ctx.fill();
    },
    earColor: '#26232a',
    front: (ctx, a) => bigText(ctx, 'YAMERO!!', a.x + a.w / 2, a.y + 44, 52, '#ffffff', 0),
  },
  'r-no': {
    // Wide-eyed ginger tabby, very firm about it
    fur: '#e8a050',
    stripes: '#b8692a',
    muzzle: '#fff1e0',
    eyes: 'wide',
    mouth: 'flat',
    s: 1.2,
    dy: 25,
    front: (ctx, a) => bigText(ctx, 'NO.', a.x + a.w / 2, a.y + 48, 64, '#ffffff', 0),
  },
  'r-ak': {
    // Tabby standing upright, armed to the whiskers
    fur: '#a08a6a',
    stripes: '#6a5238',
    muzzle: '#e8dcc8',
    eyes: 'normal',
    iris: '#c8a040',
    mouth: 'flat',
    pose: 'stand',
    s: 0.7,
    dy: -95,
    front: (ctx, _a, head) => rifle(ctx, head.x, head.y + 150),
  },
  'r-lilbub': {
    // Tiny grey tabby with huge eyes and a permanent tongue-out
    fur: '#a29a90',
    stripes: '#6e665c',
    muzzle: '#e6e0d8',
    eyes: 'wide',
    mouth: 'blep',
    pose: 'sit',
    s: 0.85,
    dy: -10,
  },
  'r-gracie': {
    // Black kitten with blue, slightly crossed eyes
    fur: '#2a262e',
    darkFur: true,
    eyes: 'derp',
    iris: '#7ab0d8',
    mouth: 'o',
    s: 1.15,
    dy: 10,
  },
  'r-apple': {
    // The apple-hooded cousin of Banana Cat
    fur: '#efe6dc',
    eyes: 'teary',
    mouth: 'frown',
    noEars: true,
    under: (ctx) => {
      ctx.fillStyle = '#e8403a';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, -120);
      ctx.bezierCurveTo(-120, -190, -190, -40, -130, 60);
      ctx.bezierCurveTo(-80, 150, 80, 150, 130, 60);
      ctx.bezierCurveTo(190, -40, 120, -190, 0, -120);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#6b4a22';
      ctx.fillRect(-8, -170, 16, 50);
      ctx.strokeRect(-8, -170, 16, 50);
      ctx.fillStyle = '#5ab832';
      ctx.beginPath();
      ctx.ellipse(34, -160, 34, 16, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    },
    cover: (ctx) => {
      ctx.fillStyle = '#e8403a';
      ctx.fillRect(-200, -200, 400, 148);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-120, -52);
      ctx.quadraticCurveTo(0, -40, 120, -52);
      ctx.stroke();
    },
  },
  'r-dance': {
    // Silver tabby in a teal beret, mid-dance
    fur: '#b4b8bc',
    stripes: '#6e7276',
    muzzle: '#eceef0',
    eyes: 'half',
    iris: '#c8b850',
    mouth: 'w',
    pose: 'stand',
    s: 0.7,
    dy: -95,
    tilt: 0.12,
    over: (ctx) => {
      ctx.fillStyle = '#1aa0a8';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(-10, -92, 112, 34, -0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-14, -128, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    },
    front: (ctx, a) => notes(ctx, a, ['♪', '♫', '♪']),
  },
  'n-sleep': {
    // Tan tabby, chin up, eyes squeezed in deep contentment
    fur: '#c8a878',
    stripes: '#8a6a40',
    muzzle: '#f0e2cc',
    eyes: 'closed',
    mouth: 'w',
    tilt: -0.25,
    s: 1.1,
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
  'n-hungry': {
    // Pink nose pressed right up to the lens
    fur: '#f2d4d8',
    eyes: 'closed',
    mouth: 'o',
    s: 1.45,
    dy: 50,
    front: (ctx, a) => bigText(ctx, '好餓喔…', a.x + a.w / 2, a.y + 46, 46, '#ffffff', 0),
  },
  'n-corn': {
    // Ginger-and-white kitten gnawing a corn cob
    fur: '#f4ece2',
    eyes: 'half',
    iris: '#c8a050',
    mouth: 'open',
    s: 1.05,
    dy: -10,
    cover: (ctx) => {
      ctx.fillStyle = '#e8963a';
      ctx.beginPath();
      ctx.ellipse(-60, -50, 70, 55, 0.4, 0, Math.PI * 2);
      ctx.ellipse(70, -60, 55, 45, -0.3, 0, Math.PI * 2);
      ctx.fill();
    },
    earColor: '#e8963a',
    front: (ctx, _a, head) => corn(ctx, head.x + 10, head.y + 75 * head.s),
  },
  'n-mic': {
    // Brown tabby belting into a microphone
    fur: '#8a7258',
    stripes: '#4e3a28',
    muzzle: '#e4d6c4',
    eyes: 'normal',
    iris: '#c8a040',
    mouth: 'huge',
    dy: -10,
    front: (ctx, a, head) => {
      microphone(ctx, head.x + 70, head.y + 120);
      notes(ctx, a, ['♪', '♫', '♬']);
    },
  },
  'n-backpack': {
    // Tabby setting off with a bundle strapped to its back
    fur: '#9c968e',
    stripes: '#5e5850',
    muzzle: '#e6e2dc',
    eyes: 'normal',
    iris: '#c8b850',
    mouth: 'w',
    pose: 'sit',
    s: 0.85,
    dx: -30,
    back: (ctx, _a, head) => {
      ctx.fillStyle = '#f4f2ee';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(head.x + 110, head.y + 40, 95, 110, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff8ab8';
      for (const [dx, dy] of [
        [80, 0],
        [130, 60],
        [100, 110],
      ]) {
        ctx.beginPath();
        ctx.arc(head.x + dx, head.y + dy, 12, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  'n-belyash': {
    // Fluffy white cat, tongue out, about to be sick
    fur: '#fbfaf6',
    spiky: true,
    eyes: 'wide',
    mouth: 'blep',
    s: 1.05,
    front: (ctx, a) => bigText(ctx, '噁——', a.x + a.w - 120, a.y + 64, 48, '#b8e86a', 0.15),
  },
  'n-bowl': {
    // Cream cat banging its empty bowl
    fur: '#efd2b0',
    stripes: '#d0a070',
    muzzle: '#fbf1e4',
    eyes: 'normal',
    iris: '#a8803a',
    mouth: 'o',
    pose: 'sit',
    s: 0.85,
    dy: -40,
    front: (ctx, a, head) => {
      const y = a.y + a.h - 50;
      ctx.fillStyle = '#c8ccd2';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(head.x + 90, y, 70, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#efd2b0';
      ctx.beginPath();
      ctx.ellipse(head.x + 80, y - 40, 26, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      motionLines(ctx, head.x + 80, y - 55, 3);
      bigText(ctx, '飯呢？', a.x + 90, a.y + 60, 44, '#ffffff', -0.1);
    },
  },
  'n-nails': {
    // Black cat filing its claws, unbothered
    fur: '#221f26',
    darkFur: true,
    eyes: 'half',
    iris: '#d8d040',
    mouth: 'flat',
    s: 1.05,
    dy: -20,
    front: (ctx, _a, head) => nailFile(ctx, head.x + 40, head.y + 150),
  },
  'n-eyeroll': {
    // Eyes rolled all the way back, tongue out
    fur: '#4a3e38',
    darkFur: true,
    eyes: 'up',
    mouth: 'blep',
    s: 1.2,
    dy: 15,
  },
  'n-loki': {
    // Grey-and-white office worker, typing away
    fur: '#9a9aa0',
    muzzle: '#f2f2f2',
    eyes: 'normal',
    iris: '#c8c040',
    mouth: 'flat',
    dy: -45,
    front: (ctx, a) => laptop(ctx, a.x + a.w / 2, a.y + a.h - 20, '#9a9aa0'),
  },
  'n-service': {
    // Tuxedo cat with a little black moustache and a headset
    fur: '#26232a',
    darkFur: true,
    tuxedo: true,
    eyes: 'normal',
    iris: '#a8b860',
    mouth: 'w',
    s: 1.05,
    over: (ctx) => {
      ctx.fillStyle = '#26232a';
      ctx.beginPath();
      ctx.ellipse(-12, 50, 16, 8, 0.3, 0, Math.PI * 2);
      ctx.ellipse(12, 50, 16, 8, -0.3, 0, Math.PI * 2);
      ctx.fill();
      headset(ctx);
    },
  },
  'n-clip': {
    // Ginger-and-white cat with a cute hair clip
    fur: '#f0a860',
    stripes: '#c87a3a',
    muzzle: '#fff6ec',
    eyes: 'sparkle',
    iris: '#c8a050',
    mouth: 'w',
    blush: true,
    pose: 'sit',
    s: 0.9,
    dy: -15,
    over: (ctx) => {
      ctx.fillStyle = '#ff7ab0';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(40, -86, 56, 18, 9);
      ctx.fill();
      ctx.stroke();
    },
    front: (ctx, a) => {
      heart(ctx, a.x + 70, a.y + 80, 18);
      heart(ctx, a.x + a.w - 70, a.y + 110, 14);
    },
  },
  'n-laundry': {
    // White-and-grey cat hanging out the washing
    fur: '#f2f2f0',
    eyes: 'dot',
    mouth: 'w',
    pose: 'stand',
    s: 0.7,
    dy: -80,
    cover: (ctx) => {
      ctx.fillStyle = '#8a8a90';
      ctx.beginPath();
      ctx.ellipse(50, -70, 70, 40, -0.3, 0, Math.PI * 2);
      ctx.fill();
    },
    earColor: '#8a8a90',
    back: (ctx, a) => {
      const y = a.y + 70;
      ctx.strokeStyle = '#f2f2f2';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(a.x, y);
      ctx.quadraticCurveTo(a.x + a.w / 2, y + 20, a.x + a.w, y);
      ctx.stroke();
      const clothes: [number, string][] = [
        [a.x + 50, '#ff8ab8'],
        [a.x + a.w - 110, '#6ab8ff'],
        [a.x + a.w - 50, '#ffe14a'],
      ];
      for (const [x, c] of clothes) {
        ctx.fillStyle = c;
        ctx.strokeStyle = INK;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(x - 22, y + 4, 44, 56, 6);
        ctx.fill();
        ctx.stroke();
      }
    },
    front: (ctx, a) => {
      const y = a.y + a.h - 50;
      ctx.fillStyle = '#9aa8b8';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(a.x + a.w / 2 - 110, y - 40);
      ctx.lineTo(a.x + a.w / 2 + 110, y - 40);
      ctx.lineTo(a.x + a.w / 2 + 90, y + 40);
      ctx.lineTo(a.x + a.w / 2 - 90, y + 40);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(a.x + a.w / 2 - 70 + i * 35, y - 44, 14, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  'n-luna': {
    // White cat with a tabby cap and big dark eyes, mid-chew
    fur: '#f8f6f2',
    eyes: 'normal',
    iris: '#3a2a20',
    mouth: 'o',
    s: 1.05,
    dy: -25,
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
    earColor: '#7a6a5a',
    front: (ctx, a) => {
      const x = a.x + a.w / 2;
      const y = a.y + a.h - 45;
      ctx.fillStyle = '#e8eef4';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(x, y, 120, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#c87a5a';
      for (const dx of [-50, 0, 50]) {
        ctx.beginPath();
        ctx.arc(x + dx, y - 10, 16, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  'n-cowdance': {
    // Black-and-white "cow" cat standing up, wiggling
    fur: '#f6f4f0',
    eyes: 'dot',
    mouth: 'w',
    pose: 'stand',
    s: 0.7,
    dy: -95,
    tilt: -0.1,
    cover: (ctx) => {
      ctx.fillStyle = '#26232a';
      ctx.beginPath();
      ctx.ellipse(-60, -50, 60, 55, 0.3, 0, Math.PI * 2);
      ctx.ellipse(70, -70, 50, 40, -0.3, 0, Math.PI * 2);
      ctx.fill();
    },
    earColor: '#26232a',
    front: (ctx, a) => notes(ctx, a, ['♪', '♫', '♪']),
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

function thumbsUp(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#f2c9a8';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(x - 50, y - 10, 100, 90, 24);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(x - 44, y - 90, 36, 96, 18);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = 'rgba(36,26,46,0.5)';
  ctx.lineWidth = 3;
  for (const dy of [22, 44, 64]) {
    ctx.beginPath();
    ctx.moveTo(x - 8, y + dy);
    ctx.lineTo(x + 44, y + dy);
    ctx.stroke();
  }
}

function wineGlass(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.moveTo(x - 46, y - 190);
  ctx.quadraticCurveTo(x - 50, y - 100, x, y - 90);
  ctx.quadraticCurveTo(x + 50, y - 100, x + 46, y - 190);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#7a1028';
  ctx.beginPath();
  ctx.moveTo(x - 44, y - 150);
  ctx.quadraticCurveTo(x - 44, y - 98, x, y - 94);
  ctx.quadraticCurveTo(x + 44, y - 98, x + 44, y - 150);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x, y - 90);
  ctx.lineTo(x, y - 10);
  ctx.moveTo(x - 36, y - 6);
  ctx.lineTo(x + 36, y - 6);
  ctx.stroke();
}

function sunglasses(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#111018';
  ctx.strokeStyle = '#f4f0ff';
  ctx.lineWidth = 4;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.roundRect(side * 42 - 32, -26, 64, 40, 14);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(-10, -12);
  ctx.lineTo(10, -12);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(-64, -20, 16, 6);
  ctx.fillRect(20, -20, 16, 6);
}

function djDeck(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#2a2a34';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(x - 190, y - 40, 380, 80, 12);
  ctx.fill();
  ctx.stroke();
  for (const side of [-1, 1]) {
    ctx.fillStyle = '#111018';
    ctx.beginPath();
    ctx.arc(x + side * 110, y - 4, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    for (const r of [20, 32, 42]) {
      ctx.beginPath();
      ctx.arc(x + side * 110, y - 4, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#ff4fa0';
    ctx.beginPath();
    ctx.arc(x + side * 110, y - 4, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#5affc8';
  for (let i = 0; i < 4; i++) ctx.fillRect(x - 24 + i * 14, y - 20, 8, 30);
}

function steeringWheel(ctx: CanvasRenderingContext2D, x: number, y: number, paw: string) {
  ctx.strokeStyle = '#1a1a20';
  ctx.lineWidth = 22;
  ctx.beginPath();
  ctx.arc(x, y, 130, Math.PI * 1.05, Math.PI * 1.95);
  ctx.stroke();
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 90, y - 70);
  ctx.moveTo(x, y);
  ctx.lineTo(x + 90, y - 70);
  ctx.stroke();
  ctx.fillStyle = '#3a3a44';
  ctx.beginPath();
  ctx.arc(x, y, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = paw;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + side * 100, y - 98, 28, 20, side * 0.5, 0, Math.PI * 2);
    ctx.fill();
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

function rifle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.25);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.fillStyle = '#2a2a30';
  ctx.beginPath();
  ctx.roundRect(-150, -14, 260, 28, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillRect(110, -6, 70, 12);
  ctx.strokeRect(110, -6, 70, 12);
  ctx.fillStyle = '#8a5a2e';
  ctx.beginPath();
  ctx.moveTo(-150, -12);
  ctx.lineTo(-230, -4);
  ctx.lineTo(-230, 40);
  ctx.lineTo(-150, 14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#2a2a30';
  ctx.beginPath();
  ctx.moveTo(-20, 14);
  ctx.quadraticCurveTo(-10, 80, 30, 90);
  ctx.lineTo(40, 70);
  ctx.quadraticCurveTo(14, 60, 14, 14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
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

function corn(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.15);
  ctx.fillStyle = '#ffd23a';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(0, 0, 150, 42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#e8a81a';
  for (let i = -6; i <= 6; i++) {
    for (const row of [-18, 0, 18]) {
      ctx.beginPath();
      ctx.ellipse(i * 20, row, 7, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = '#7ac83a';
  ctx.beginPath();
  ctx.moveTo(140, -30);
  ctx.quadraticCurveTo(210, -50, 230, 10);
  ctx.quadraticCurveTo(190, 0, 140, 30);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function microphone(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.6);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.fillStyle = '#3a3a44';
  ctx.beginPath();
  ctx.roundRect(-14, 20, 28, 120, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#e8803a';
  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = 'rgba(36,26,46,0.5)';
  ctx.lineWidth = 2;
  for (let i = -24; i <= 24; i += 12) {
    ctx.beginPath();
    ctx.moveTo(i, -30);
    ctx.lineTo(i, 30);
    ctx.moveTo(-30, i);
    ctx.lineTo(30, i);
    ctx.stroke();
  }
  ctx.restore();
}

function nailFile(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.7);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.fillStyle = '#e8d8c8';
  ctx.beginPath();
  ctx.roundRect(-10, -120, 20, 130, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ff7ab0';
  ctx.beginPath();
  ctx.roundRect(-12, 10, 24, 50, 8);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#221f26';
  ctx.strokeStyle = '#f4f0ff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(x - 30, y - 30, 30, 22, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function laptop(ctx: CanvasRenderingContext2D, x: number, y: number, paw: string) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.fillStyle = '#c8ccd4';
  ctx.beginPath();
  ctx.moveTo(x - 190, y - 70);
  ctx.lineTo(x + 190, y - 70);
  ctx.lineTo(x + 220, y);
  ctx.lineTo(x - 220, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 10; i++) ctx.fillRect(x - 150 + i * 30, y - 56, 22, 14);
  for (let i = 0; i < 10; i++) ctx.fillRect(x - 160 + i * 32, y - 34, 24, 14);
  ctx.fillStyle = paw;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + side * 70, y - 70, 32, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  motionLines(ctx, x - 70, y - 90, 3);
  motionLines(ctx, x + 70, y - 90, 3);
}

function headset(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = '#3a3a44';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(0, -10, 118, Math.PI * 1.08, Math.PI * 1.92);
  ctx.stroke();
  ctx.fillStyle = '#3a3a44';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.roundRect(side * 112 - 16, -40, 32, 56, 12);
    ctx.fill();
    ctx.stroke();
  }
  ctx.strokeStyle = '#3a3a44';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-112, 10);
  ctx.quadraticCurveTo(-100, 70, -40, 64);
  ctx.stroke();
  ctx.fillStyle = '#e8403a';
  ctx.beginPath();
  ctx.arc(-38, 64, 9, 0, Math.PI * 2);
  ctx.fill();
}

function heart(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.fillStyle = '#ff6fa8';
  ctx.beginPath();
  ctx.moveTo(x, y + r);
  ctx.bezierCurveTo(x - r * 2, y - r * 0.4, x - r * 0.8, y - r * 1.8, x, y - r * 0.6);
  ctx.bezierCurveTo(x + r * 0.8, y - r * 1.8, x + r * 2, y - r * 0.4, x, y + r);
  ctx.fill();
}
