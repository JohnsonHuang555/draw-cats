/** Hand-made specs for every Meme Cat, drawn after reference images of each meme. */
import {
  INK,
  drawCat,
  seededRandom,
  type Head,
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
    // Ethel: grey tabby standing square on all fours, blank stare, white socks
    fur: '#8f8a84',
    stripes: '#55504a',
    muzzle: '#e4ded6',
    paws: '#f4f0ea',
    eyes: 'normal',
    iris: '#b8b070',
    mouth: 'w',
    pose: 'quad',
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
    // Small calico kitten standing up, arms flung wide, staring straight ahead
    fur: '#f6f2ec',
    eyes: 'wide',
    iris: '#4a3a30',
    bigPupil: true,
    mouth: 'flat',
    pose: 'stand',
    armsUp: true,
    s: 0.7,
    dy: -85,
    earColor: '#8a7060',
    cover: (ctx) => {
      ctx.fillStyle = '#8a7060';
      ctx.beginPath();
      ctx.ellipse(-60, -70, 65, 45, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c8a070';
      ctx.beginPath();
      ctx.ellipse(70, -60, 50, 40, -0.3, 0, Math.PI * 2);
      ctx.fill();
    },
    front: (ctx, a) => {
      bigText(ctx, 'HAPPY', a.x + a.w / 2, a.y + 46, 46, '#ffe14a', 0);
      sparkle(ctx, a.x + 50, a.y + 120, 18);
      sparkle(ctx, a.x + a.w - 50, a.y + 150, 14);
    },
  },
  'sr-pop': {
    // White cat, grey-brown patch over one ear, whole face swallowed by a round "pop"
    fur: '#f6f3ee',
    eyes: 'dot',
    mouth: 'pop',
    s: 1.2,
    dy: 15,
    cover: (ctx) => {
      ctx.fillStyle = '#8a7a6a';
      ctx.beginPath();
      ctx.ellipse(-82, -58, 58, 52, 0.4, 0, Math.PI * 2);
      ctx.fill();
    },
    back: (ctx, _a, head) => burstLines(ctx, head.x, head.y + 50, 12, 165, 215, 'rgba(255,255,255,0.55)'),
  },
  'r-huh': {
    // Ben: round white cat, small head, black comb-over, odd eyes (blue / amber),
    // dark stripes down one flank, jaw dropped - "huh?"
    fur: '#fbfbf8',
    eyes: 'blank',
    iris: '#a9c3d6',
    iris2: '#c49a5a',
    mouth: 'gasp',
    pose: 'chonk',
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
    // All-black loaf with a white chest, small head on the right, spinning
    fur: '#1e1e24',
    darkFur: true,
    belly: '#ffffff',
    eyes: 'normal',
    iris: '#8a9a6a',
    mouth: 'w',
    pose: 'loaf',
    s: 0.75,
    dx: 70,
    dy: -10,
    back: (ctx, a) => {
      solidBg(ctx, a, '#f2f0ec');
      spinArcs(ctx, a.x + a.w / 2, a.y + a.h / 2 + 20, 190, 'rgba(60,60,70,0.55)');
    },
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
      fruitSuit(ctx, head, 'banana');
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
    // Blurry cat cackling, mouth wide open, a yellow emoji hand pointing at you
    fur: '#f2eeea',
    stripes: '#9a9090',
    eyes: 'happy',
    mouth: 'huge',
    s: 1.2,
    dx: 30,
    dy: 10,
    tilt: -0.12,
    front: (ctx, a) => {
      pointingHand(ctx, a.x + 95, a.y + a.h - 95);
      bigText(ctx, 'WAJAJA', a.x + a.w / 2, a.y + 42, 46, '#ffe14a', -0.05);
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
    // The doodle: a white blob behind the table edge, paws up, bongos below
    fur: '#ffffff',
    eyes: 'dot',
    mouth: 'w',
    noCat: true,
    back: (ctx, a) => bongoCat(ctx, a),
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
    // Ginger cat peering down through a ragged hole in a grey ceiling
    fur: '#e2ad78',
    stripes: '#b8844e',
    muzzle: '#f2dcc0',
    eyes: 'wide',
    iris: '#3a3028',
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
    // Calico in tears, one white paw raised in a thumbs up
    fur: '#f6f2ec',
    eyes: 'teary',
    iris: '#2a2030',
    mouth: 'gasp',
    s: 1.25,
    dx: 40,
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
    front: (ctx, a) => thumbsUpEmoji(ctx, a.x + 95, a.y + a.h - 105),
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
    // The apple-suited cousin of Banana Cat
    fur: '#e2d2bc',
    eyes: 'teary',
    iris: '#2a2030',
    mouth: 'frown',
    noEars: true,
    s: 0.55,
    dy: 10,
    back: (ctx, a, head) => {
      solidBg(ctx, a, '#f6f4ee');
      fruitSuit(ctx, head, 'apple');
    },
  },
  'r-dance': {
    // Three kittens dancing upright on the beach at sunset
    fur: '#efe2cc',
    eyes: 'dot',
    mouth: 'w',
    pose: 'stand',
    s: 0.42,
    dy: -30,
    back: (ctx, a) => {
      sunsetBeach(ctx, a);
      drawCat(ctx, DANCER_LEFT, a);
      drawCat(ctx, DANCER_RIGHT, a);
    },
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
  'n-hungry': {
    // Ginger cat filmed from below, chin up, eyes shut, mouth hanging open
    fur: '#e8a060',
    stripes: '#c07838',
    muzzle: '#f6d8b8',
    eyes: 'closed',
    mouth: 'open',
    s: 1.5,
    dy: 60,
    tilt: -0.3,
    front: (ctx, a) => bigText(ctx, '好餓喔…', a.x + a.w / 2, a.y + 46, 46, '#ffffff', 0),
  },
  'n-corn': {
    // Crying kitten face in a corn-on-the-cob suit
    fur: '#e2d2bc',
    eyes: 'teary',
    iris: '#2a2030',
    mouth: 'frown',
    noEars: true,
    s: 0.48,
    dy: 10,
    back: (ctx, a, head) => {
      solidBg(ctx, a, '#f6f4ee');
      fruitSuit(ctx, head, 'corn');
    },
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
    // Cream cat, eyes crossed, tongue lolling out
    fur: '#f6eedc',
    eyes: 'derp',
    iris: '#3a2a20',
    mouth: 'blep',
    s: 1.25,
    dy: 25,
    tilt: 0.08,
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
    // Black cat against a graffiti brick wall, filing its claws, unbothered
    fur: '#221f26',
    darkFur: true,
    eyes: 'half',
    iris: '#c8e040',
    mouth: 'flat',
    pose: 'sit',
    s: 0.85,
    dy: -30,
    back: (ctx, a) => brickWall(ctx, a),
    front: (ctx, _a, head) => nailFile(ctx, head.x + 40, head.y + 150 * head.s),
  },
  'n-eyeroll': {
    // White cat flopped on the table, eyes rolled back, tongue out
    fur: '#fbfbf8',
    eyes: 'up',
    mouth: 'blep',
    s: 1.15,
    dy: 30,
    tilt: 0.45,
    back: (ctx, a) => {
      solidBg(ctx, a, '#2a2830');
      ctx.fillStyle = '#e8e4dc';
      ctx.beginPath();
      ctx.moveTo(a.x, a.y + a.h * 0.62);
      ctx.lineTo(a.x + a.w, a.y + a.h * 0.5);
      ctx.lineTo(a.x + a.w, a.y + a.h);
      ctx.lineTo(a.x, a.y + a.h);
      ctx.fill();
    },
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
    // White-blazed tuxedo with a black moustache spot and round green eyes, on the line
    fur: '#fbfbf8',
    eyes: 'wide',
    iris: '#a8b860',
    mouth: 'w',
    s: 1.1,
    dy: 10,
    earColor: '#1e1c22',
    cover: (ctx) => {
      ctx.fillStyle = '#1e1c22';
      ctx.beginPath();
      // Black down both sides from the ears to the cheeks, a white blaze between
      ctx.ellipse(-82, -30, 58, 88, 0.22, 0, Math.PI * 2);
      ctx.ellipse(82, -30, 58, 88, -0.22, 0, Math.PI * 2);
      ctx.fill();
    },
    over: (ctx) => {
      ctx.fillStyle = '#1e1c22';
      ctx.beginPath();
      ctx.ellipse(0, 54, 20, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  'n-clip': {
    // Ginger-and-white cat politely holding chopsticks: "您好，我吃一點"
    fur: '#e8a868',
    stripes: '#c07838',
    muzzle: '#fbf6ee',
    belly: '#fbf6ee',
    eyes: 'closed',
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

// ---------------------------------------------------------------- props for the reference redraw

const DANCER_LEFT: CatSpec = {
  fur: '#f6f4f0',
  eyes: 'dot',
  mouth: 'w',
  pose: 'stand',
  s: 0.4,
  dx: -138,
  dy: -20,
  tilt: -0.1,
  earColor: '#2a262e',
  cover: (ctx) => {
    ctx.fillStyle = '#2a262e';
    ctx.beginPath();
    ctx.ellipse(0, -80, 100, 34, 0, 0, Math.PI * 2);
    ctx.fill();
  },
};

const DANCER_RIGHT: CatSpec = {
  fur: '#b4b4b8',
  stripes: '#7a7a80',
  eyes: 'dot',
  mouth: 'w',
  pose: 'stand',
  s: 0.4,
  dx: 138,
  dy: -24,
  tilt: 0.1,
};

function solidBg(ctx: CanvasRenderingContext2D, a: ArtArea, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(a.x, a.y, a.w, a.h);
}

function bongoCat(ctx: CanvasRenderingContext2D, a: ArtArea) {
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
  // Paws on the edge, pink pads
  for (const x of [a.x + 150, a.x + 362]) {
    const y = ly(x) - 14;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(x, y, 36, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ff9aa8';
    ctx.beginPath();
    ctx.ellipse(x, y + 6, 11, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    for (const dx of [-16, 0, 16]) {
      ctx.beginPath();
      ctx.arc(x + dx, y - 12, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
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

/** The yellow 👍 emoji. */
function thumbsUpEmoji(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#ffcc33';
  ctx.strokeStyle = '#a0701a';
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  // Thumb
  ctx.beginPath();
  ctx.moveTo(x - 30, y - 10);
  ctx.bezierCurveTo(x - 40, y - 70, x - 10, y - 110, x + 8, y - 96);
  ctx.bezierCurveTo(x + 26, y - 84, x + 10, y - 40, x + 18, y - 14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Fist with four curled fingers
  ctx.beginPath();
  ctx.roundRect(x - 50, y - 18, 110, 100, 26);
  ctx.fill();
  ctx.stroke();
  ctx.lineWidth = 4;
  for (const dy of [8, 32, 56]) {
    ctx.beginPath();
    ctx.moveTo(x + 20, y + dy);
    ctx.lineTo(x + 58, y + dy);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.beginPath();
  ctx.ellipse(x - 26, y + 10, 10, 24, 0.2, 0, Math.PI * 2);
  ctx.fill();
}

/** A yellow emoji fist pointing at the viewer. */
function pointingHand(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#ffcc33';
  ctx.strokeStyle = '#a0701a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(x - 70, y - 40, 100, 90, 30);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(x + 10, y - 34, 90, 30, 15);
  ctx.fill();
  ctx.stroke();
  ctx.lineWidth = 3;
  for (const dy of [8, 26]) {
    ctx.beginPath();
    ctx.moveTo(x - 30, y + dy);
    ctx.lineTo(x + 24, y + dy);
    ctx.stroke();
  }
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

function brickWall(ctx: CanvasRenderingContext2D, a: ArtArea) {
  solidBg(ctx, a, '#8a8a8e');
  ctx.strokeStyle = 'rgba(40,40,46,0.55)';
  ctx.lineWidth = 3;
  for (let row = 0, y = a.y; y < a.y + a.h; row++, y += 36) {
    ctx.beginPath();
    ctx.moveTo(a.x, y);
    ctx.lineTo(a.x + a.w, y);
    ctx.stroke();
    for (let x = a.x + (row % 2) * 40; x < a.x + a.w; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 36);
      ctx.stroke();
    }
  }
  ctx.strokeStyle = 'rgba(220, 60, 70, 0.75)';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(a.x + 30, a.y + 60);
  ctx.bezierCurveTo(a.x + 120, a.y + 20, a.x + 80, a.y + 160, a.x + 170, a.y + 110);
  ctx.moveTo(a.x + a.w - 40, a.y + 40);
  ctx.bezierCurveTo(a.x + a.w - 120, a.y + 140, a.x + a.w - 20, a.y + 200, a.x + a.w - 90, a.y + 280);
  ctx.stroke();
}

function sunsetBeach(ctx: CanvasRenderingContext2D, a: ArtArea) {
  const horizon = a.y + a.h * 0.5;
  const sky = ctx.createLinearGradient(0, a.y, 0, horizon);
  sky.addColorStop(0, '#7a9ab8');
  sky.addColorStop(0.6, '#e8b890');
  sky.addColorStop(1, '#f2a060');
  ctx.fillStyle = sky;
  ctx.fillRect(a.x, a.y, a.w, horizon - a.y);
  const sea = ctx.createLinearGradient(0, horizon, 0, a.y + a.h);
  sea.addColorStop(0, '#c8906a');
  sea.addColorStop(0.5, '#7a6a68');
  sea.addColorStop(1, '#5a4a44');
  ctx.fillStyle = sea;
  ctx.fillRect(a.x, horizon, a.w, a.y + a.h - horizon);
  ctx.fillStyle = '#fff2c8';
  ctx.beginPath();
  ctx.arc(a.x + a.w * 0.72, horizon - 40, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,230,170,0.5)';
  for (let i = 0; i < 6; i++) ctx.fillRect(a.x + a.w * 0.72 - 24 + (i % 2) * 8, horizon + 6 + i * 12, 40 - i * 4, 4);
}

/** Banana / apple / corn costume around a kitten face, with little limbs poking out. */
function fruitSuit(ctx: CanvasRenderingContext2D, head: Head, kind: 'banana' | 'apple' | 'corn') {
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
  if (kind === 'banana') {
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
  } else if (kind === 'apple') {
    ctx.fillStyle = '#d8302a';
    ctx.beginPath();
    ctx.moveTo(x, y - 130);
    ctx.bezierCurveTo(x - 140, y - 200, x - 210, y - 20, x - 140, y + 100);
    ctx.bezierCurveTo(x - 80, y + 180, x + 80, y + 180, x + 140, y + 100);
    ctx.bezierCurveTo(x + 210, y - 20, x + 140, y - 200, x, y - 130);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.ellipse(x - 100, y - 70, 22, 40, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6b4a22';
    ctx.fillRect(x - 7, y - 190, 14, 64);
    ctx.strokeRect(x - 7, y - 190, 14, 64);
    ctx.fillStyle = '#5ab832';
    ctx.beginPath();
    ctx.ellipse(x + 38, y - 172, 38, 16, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    // Husk leaves behind, then the cob
    ctx.fillStyle = '#4aa83a';
    for (const side of [-1, 1]) {
      for (const [dx, h] of [
        [70, 330],
        [110, 260],
      ]) {
        ctx.beginPath();
        ctx.moveTo(x + side * 20, y + 190);
        ctx.quadraticCurveTo(x + side * (dx + 40), y + 40, x + side * (dx - 20), y + 190 - h);
        ctx.quadraticCurveTo(x + side * (dx - 40), y + 60, x + side * 10, y + 190);
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.fillStyle = '#f6c030';
    ctx.beginPath();
    ctx.ellipse(x, y - 20, 105, 210, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e09a1a';
    for (let row = -8; row <= 8; row++) {
      const half = 95 * Math.sqrt(1 - Math.pow((row * 22) / 210, 2));
      for (let col = -half; col <= half; col += 22) {
        ctx.beginPath();
        ctx.ellipse(x + col, y - 20 + row * 22, 8, 9, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.fillStyle = '#5ab832';
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(x + side * 5, y + 200);
      ctx.quadraticCurveTo(x + side * 120, y + 120, x + side * 90, y - 40);
      ctx.quadraticCurveTo(x + side * 70, y + 100, x + side * 5, y + 200);
      ctx.fill();
      ctx.stroke();
    }
  }
}
