/* ============================================================
   ILLUSTRATIONS — ink line art, then flat colour, as in Bapu's
   wedding paintings.

   Every drawing is a list of ink strokes plus colour fills.
   Strokes are drawn one after another (CSS animates
   stroke-dashoffset; pathLength="1" means no measuring in JS),
   and each stroke's duration follows its length, so the drawing
   moves like a pen rather than a uniform wipe. The colours are
   then laid in region by region, like a brush filling the ink.
   Fills sit beneath the ink so the linework stays crisp on top.
   ============================================================ */

/* ---------- helpers ---------- */

// Rough path length from the control polygon: plenty accurate for pacing.
function approxLength(d) {
  const nums = d.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
  let len = 0;
  for (let i = 2; i + 1 < nums.length; i += 2) {
    len += Math.hypot(nums[i] - nums[i - 2], nums[i + 1] - nums[i - 1]);
  }
  return len;
}

const f = (n) => Math.round(n * 100) / 100;

/**
 * Turn a list of strokes into timed <path> elements.
 * strokes: [d, width?, variant?] — drawn in order, each starting when the
 * previous one is `overlap` of the way through. Variants: "gold", "ray".
 */
function ink(strokes, { start = 0, speed = 150, overlap = 0.55, min = 0.3, max = 1.3 } = {}) {
  let t = start;
  let out = "";
  for (const s of strokes) {
    const [d, w = 1.5, v] = Array.isArray(s) ? s : [s];
    const dur = Math.min(max, Math.max(min, approxLength(d) / speed));
    out += `<path class="ink${v ? ` ink--${v}` : ""}" pathLength="1" stroke-width="${w}" style="--d:${f(t)}s;--t:${f(dur)}s" d="${d}"/>`;
    t += dur * overlap;
  }
  return { svg: out, end: t };
}

// Flat colour laid in after the ink.
const paint = (d, tone, delay, extra = "") =>
  `<path class="paint paint--${tone}" style="--d:${f(delay)}s" d="${d}" ${extra}/>`;

// A run of fills, each a beat after the last — like a brush moving on.
const paints = (list, start, step = 0.12) =>
  list.map(([d, tone, extra], i) => paint(d, tone, start + i * step, extra)).join("");

const dot = (x, y, r, cls, delay) =>
  `<circle class="${cls}" style="--d:${f(delay)}s" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`;

// A tapered mango leaf: base (x, y), pointing `deg` (0 = right, 90 = down).
function leaf(x, y, deg, len, w) {
  const a = (deg * Math.PI) / 180;
  const ux = Math.cos(a), uy = Math.sin(a);
  const px = -uy, py = ux;
  const p = (u, v) => `${f(x + ux * u + px * v)} ${f(y + uy * u + py * v)}`;
  return (
    `M${p(0, 0)} C${p(len * 0.22, w)} ${p(len * 0.68, w * 0.85)} ${p(len, 0)} ` +
    `C${p(len * 0.68, -w * 0.85)} ${p(len * 0.22, -w)} ${p(0, 0)} Z`
  );
}

// A marigold: turmeric/orange ball, scalloped ink edge, kumkum centre.
const marigold = (x, y, r, tone, delay) =>
  dot(x, y, r, `paint paint--${tone}`, delay) +
  `<circle class="ink-static" style="--d:${f(delay)}s" cx="${f(x)}" cy="${f(y)}" r="${r - 0.6}" stroke-width="1" stroke-dasharray="2.2 1.3"/>` +
  dot(x, y, r * 0.28, "paint paint--kumkum", delay + 0.15);

const svgOpen = (vb, label, cls = "") =>
  `<svg class="art ${cls}" viewBox="${vb}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} xmlns="http://www.w3.org/2000/svg">`;

/* ---------- Diya on a lotus — the opening "bloom" ---------- */

export function diya() {
  const bowl = "M52 118 C58 148 142 148 148 118 C130 111 112 110 100 103 C88 110 70 111 52 118 Z";
  const petalC = "M100 148 C90 157 91 169 100 176 C109 169 110 157 100 148 Z";
  const petalL = "M98 175 C80 176 66 167 60 153 C77 154 90 162 98 175 Z";
  const petalR = "M102 175 C120 176 134 167 140 153 C123 154 110 162 102 175 Z";
  const leafL = "M62 172 C52 170 44 163 40 156 C50 158 58 164 62 172 Z";
  const leafR = "M138 172 C148 170 156 163 160 156 C150 158 142 164 138 172 Z";
  const outer = "M100 101 C89 89 91 71 101 50 C111 71 112 89 100 101 Z";
  const core = "M100 96 C95 89 96 80 101 70 C106 80 106 89 100 96 Z";

  const lamp = ink(
    [
      ["M52 118 C58 148 142 148 148 118", 1.8],
      ["M52 118 C70 111 88 110 100 103 C112 110 130 111 148 118", 1.5],
      ["M66 121 C82 117 118 117 134 121", 1.1],
      [petalC, 1.3], [petalL, 1.3], [petalR, 1.3],
      [leafL, 1.1], [leafR, 1.1],
      ["M58 182 C86 188 114 188 142 182", 1],
    ],
    { start: 0.1, speed: 120 }
  );
  const colourAt = lamp.end - 0.2;
  const flameAt = lamp.end + 0.2;
  const flame = ink(
    [
      [outer, 1.4],
      [core, 1],
      ["M78 72 L72 68", 1, "gold"], ["M76 86 L69 86", 1, "gold"], ["M82 58 L78 52", 1, "gold"],
      ["M122 72 L128 68", 1, "gold"], ["M124 86 L131 86", 1, "gold"], ["M118 58 L122 52", 1, "gold"],
    ],
    { start: flameAt, speed: 90, overlap: 0.35 }
  );
  return (
    svgOpen("0 0 200 200", "A lit brass diya resting on a pink lotus", "art--diya") +
    `<defs><radialGradient id="flame-glow"><stop offset="0" stop-color="#ffd35c" stop-opacity=".7"/><stop offset="1" stop-color="#ffd35c" stop-opacity="0"/></radialGradient></defs>` +
    paints(
      [
        [leafL, "green"], [leafR, "green"],
        [petalL, "pink-light"], [petalR, "pink-light"], [petalC, "pink"],
        [bowl, "gold"],
        ["M62 126 C68 136 80 140 92 141 C80 137 70 132 62 126 Z", "gold-light"],
        ["M66 121 C82 117 118 117 134 121 C118 125.5 82 125.5 66 121 Z", "gold-deep"],
      ],
      colourAt
    ) +
    `<g class="flame" style="--d:${f(flameAt + 0.1)}s">` +
    `<circle cx="100" cy="76" r="38" fill="url(#flame-glow)"/>` +
    paint(outer, "marigold", flameAt + 0.1) +
    paint(core, "flame-core", flameAt + 0.25) +
    `</g>` +
    lamp.svg +
    flame.svg +
    `</svg>`
  );
}

/* ---------- Kalasham — brass pot, mango leaves, coconut ---------- */

export function kalasham() {
  const leaves = [leaf(92, 78, 196, 46, 7), leaf(95, 76, 224, 40, 6.5), leaf(108, 78, -16, 46, 7), leaf(105, 76, -44, 40, 6.5)];
  const belly = "M78 102 C50 112 46 150 70 166 C86 176 114 176 130 166 C154 150 150 112 122 102 Z";
  const coconut = "M88 72 C86 54 94 42 100 36 C106 42 114 54 112 72 Z";
  const rim = "M74 80 C88 74 112 74 126 80 C112 86 88 86 74 80 Z";
  const lines = ink(
    [
      ["M78 102 C50 112 46 150 70 166 C86 176 114 176 130 166 C154 150 150 112 122 102", 1.7],
      ["M80 84 C84 92 84 96 78 102", 1.3],
      ["M120 84 C116 92 116 96 122 102", 1.3],
      [rim, 1.4],
      [coconut, 1.5],
      ["M100 36 C98 30 95 27 91 25", 1], ["M100 36 C102 29 105 27 109 25", 1],
      ...leaves.map((d) => [d, 1.2]),
      ["M58 126 C82 136 118 136 142 126", 1.1],
      ["M57 132 C82 142 118 142 143 132", 1.1],
      ["M84 173 C86 180 114 180 116 173", 1.2],
      ["M78 184 C92 188 108 188 122 184", 1],
    ],
    { start: 0.1, speed: 170 }
  );
  const c = lines.end - 0.4;
  return (
    svgOpen("0 0 200 200", "A brass kalasham with mango leaves and a coconut", "art--kalasham") +
    paints(
      [
        ...leaves.map((d, i) => [d, i % 2 ? "green-light" : "green"]),
        [coconut, "brown"],
        ["M80 84 C84 92 84 96 78 102 L122 102 C116 96 116 92 120 84 Z", "gold"],
        [belly, "gold"],
        ["M66 118 C57 130 57 148 66 159 C62 146 62 132 70 121 Z", "gold-light"],
        ["M58 126 C82 136 118 136 142 126 L143 132 C118 142 82 142 57 132 Z", "kumkum"],
        [rim, "gold-deep"],
        ["M84 173 C86 180 114 180 116 173 Z", "gold-deep"],
      ],
      c,
      0.08
    ) +
    [70, 85, 100, 115, 130].map((x, i) => dot(x, 133 + (x === 100 ? 4.5 : x === 70 || x === 130 ? 0 : 3.4), 1.2, "paint paint--ivory dot", c + 0.8 + i * 0.05)).join("") +
    [[92, 152], [100, 156], [108, 152]].map(([x, y], i) => dot(x, y, 2, "paint paint--kumkum dot", c + 1 + i * 0.06)).join("") +
    lines.svg +
    `</svg>`
  );
}

/* ---------- The couple beneath the mandapam ----------
   Talambralu, as on the card: seated in profile on peetalu, facing
   each other; the bride's arm arcs over to shower turmeric rice on the
   groom's head, her gaze lowered. Heads are drawn in local coordinates
   (right-facing) and placed with a transform — hers is mirrored. */

// Right-facing male profile in a ~42 × 60 box.
const GROOM_HEAD = {
  face: "M30 4 C34 7 36 10 36.5 14 C37 17 37 19 36.6 20.5 C38.5 23 40.5 25.5 41 27 C40.2 28.4 38.8 28.6 37.6 29 C38.6 30.2 38.8 31 38.4 32 L37.2 32.9 C38.2 33.6 38.3 34.7 37.6 35.7 C36.8 36.4 36.6 37.2 37.2 38.3 C37.8 40.5 36.4 43.2 33 44 C29 44.8 25 43 22 40",
  close: " C14 42 4 34 4 22 C4 10 16 1 30 4 Z",
  neckSkin: "M30.5 44 C30.5 50 31.5 54 34 58 L10 58 C14 54 15 49 14 43 C18 44 26 45 30.5 44 Z",
  hair: "M33 9 C30 1 16 -2 8 4 C0 11 -1 26 4 36 C6 41 9 45 13 44 C14 40 16 37 19 35 C18 30 18 26 21 23 C23 18 26 13 33 10 Z",
  brow: "M27 16.2 C30 14.8 33 14.8 36 16.4",
  eye: "M27.5 20.4 C30.5 18.6 33.4 18.6 35.6 20.2 C33.5 22.2 30.5 22.4 28.2 21.4",
  pupil: [32.6, 20.3],
  ear: "M23 22 C20 22 19.5 30 23 31",
  neck: "M30.5 44 C30.5 50 31.5 54 34 58 M14 43 C15 49 14 54 10 58",
};

// Right-facing female profile in a ~40 × 58 box (mirrored in place).
const BRIDE_HEAD = {
  face: "M28 5 C32 8 34 11 34.4 15 C34.7 17.5 34.6 19 34.2 20.4 C35.8 22.5 37.6 24.6 38 26 C37.3 27.2 36 27.5 35 27.8 C35.9 28.9 36.1 29.8 35.6 30.6 L34.6 31.4 C35.5 32.1 35.6 33.1 35 34 C34.4 34.6 34.3 35.4 34.8 36.4 C35.2 38.8 33.6 41.2 30.4 42 C26.6 42.8 23 41 20 38",
  close: " C14 40 4 32 4 20 C4 9 16 1 28 5 Z",
  neckSkin: "M29.6 42 C29.2 48 30 52 32 56 L10.5 55 C13.4 51 14 47 13 42 C18 43 25 43.5 29.6 42 Z",
  hair: "M31 8 C27 0 13 -2 6 5 C0 11 -1 24 3 33 C5 38 8 42 12 43 C14 39 16 34 18.5 31 C17 26 17.5 22 20.5 19.5 C23.5 15 26.5 11.5 31 9.5 Z",
  brow: "M23.5 15.4 C27 13.4 31 13.4 34 15.6",
  eye: "M24 19.8 C27 18.6 31 18.7 33.6 20.6 C31 22.3 27.6 22.3 25 21.2 M24 19.8 L21.4 18.3",
  pupil: [30.6, 21],
  ear: "M21 21 C18 21 17.5 28 21 29",
  jhumka: "M19.8 29.5 L19.8 32 M16.6 36 C16.6 32.6 23 32.6 23 36 Z",
  neck: "M29.6 42 C29.2 48 30 52 32 56 M13 42 C14 47 13.4 51 10.5 55",
};

function head(h, transform, start) {
  const lines = ink(
    [[h.face, 1.4], [h.hair, 1.2], [h.ear, 1], [h.brow, 1.1], [h.eye, 1.05], [h.neck, 1.3], ...(h.jhumka ? [[h.jhumka, 0.9]] : [])],
    { start, speed: 70, min: 0.25, max: 1.1 }
  );
  const skinAt = lines.end - 0.3;
  const hairAt = lines.end + 0.1;
  return {
    fills:
      `<g transform="${transform}">` +
      paint(h.face + h.close, "skin", skinAt) +
      paint(h.neckSkin, "skin", skinAt + 0.08) +
      `<path class="ink-fill" style="--d:${f(hairAt)}s" d="${h.hair}"/>` +
      (h.jhumka ? paint("M17 35.6 C17 33 22.6 33 22.6 35.6 Z", "gold", hairAt + 0.3) : "") +
      `</g>`,
    lines:
      `<g transform="${transform}">` + lines.svg + dot(h.pupil[0], h.pupil[1], 0.95, "ink-dot", hairAt) + `</g>`,
    end: lines.end,
  };
}

// Golden mandapam arch with a sunburst — the frame from the card.
function mandapam(start) {
  const arch = "M36 298 L36 132 C36 84 92 58 146 46 C166 41 178 30 185 14 C192 30 204 41 224 46 C278 58 334 84 334 132 L334 298";
  const inner = "M46 298 L46 134 C46 92 98 68 150 56 C169 51 180 42 185 28 C190 42 201 51 220 56 C272 68 324 92 324 134 L324 298";
  const outline = ink([[arch, 1.7, "gold"], [inner, 1, "gold"]], { start, speed: 420, overlap: 0.35 });
  const rays = [];
  for (let i = 0; i < 30; i++) {
    const a = Math.PI + (i / 29) * Math.PI; // upper half, left → right
    const [cx, cy] = [185, 172];
    rays.push([`M${f(cx + Math.cos(a) * 116)} ${f(cy + Math.sin(a) * 116)} L${f(cx + Math.cos(a) * 240)} ${f(cy + Math.sin(a) * 240)}`, 1.2, "ray"]);
  }
  const rayInk = ink(rays, { start: start + 0.9, speed: 260, overlap: 0.06, min: 0.5 });
  return {
    svg:
      `<defs>` +
      `<linearGradient id="m-arch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3cf78"/><stop offset="1" stop-color="#e2a53a"/></linearGradient>` +
      `<radialGradient id="m-halo"><stop offset="0" stop-color="#fffaf0"/><stop offset=".62" stop-color="#fdf0cf"/><stop offset="1" stop-color="#f6d98f"/></radialGradient>` +
      `<clipPath id="m-clip"><path d="${inner} Z"/></clipPath>` +
      `</defs>` +
      `<path class="paint" style="--d:${f(start + 0.4)}s" fill="url(#m-arch)" d="${arch} Z"/>` +
      `<g clip-path="url(#m-clip)">` +
      `<circle class="paint halo" style="--d:${f(start + 0.7)}s" cx="185" cy="172" r="112" fill="url(#m-halo)"/>` +
      rayInk.svg +
      `</g>` +
      paint("M36 278 C130 284 240 284 334 276 L334 298 L36 298 Z", "gold-deep", start + 0.9) +
      outline.svg +
      ink([["M36 278 C130 284 240 284 334 276", 1, "gold"]], { start: start + 0.8, speed: 400 }).svg,
    end: outline.end,
  };
}

export function couple() {
  const m = mandapam(0.1);

  const seatG = "M84 260 L204 258 L204 270 L84 272 Z";
  const seatB = "M206 268 L292 266 L292 278 L206 280 Z";
  const seats = ink([[seatG, 1.2], [seatB, 1.2]], { start: 1.1, speed: 220 });

  const gHead = head(GROOM_HEAD, "translate(100 74)", 1.3);
  const kanduvaFront = "M131 134 C134 150 136 164 135 178 L144 178 C144 162 142 148 139 133 Z";
  const kanduvaBack = "M104 136 C96 148 90 164 88 182 C87 192 88 198 90 204 L97 202 C94 190 93 172 95 150 C97 140 100 138 104 136 Z";
  const groom = ink(
    [
      // back, chest front
      ["M110 131 C104 135 97 139 95 149 C92 163 93 183 97 201 C99 209 101 215 103 220", 1.5],
      ["M134 132 C142 136 147 142 148 152 C149 164 146 176 146 186", 1.3],
      // kanduva — around the neck, one end in front, one down the back
      [kanduvaFront, 1.1],
      ["M104 136 C96 148 90 164 88 182 C87 192 88 198 90 204 L97 202", 1.2],
      // near arm down to cupped hands
      ["M110 143 C109 159 112 175 117 187 C121 193 129 197 139 199 C151 201 160 200 168 197", 1.3],
      ["M126 145 C128 159 129 171 130 181 C136 186 148 187 162 186", 1.2],
      ["M162 186 C166 183 172 183 175 187 C177 191 175 195 169 197", 1.2],
      // waistband and seated pancha
      ["M99 212 C116 216 132 214 146 206", 1.1],
      ["M103 220 C92 230 90 246 102 254 C126 262 164 262 190 252 C198 248 198 238 190 234 C178 228 164 220 146 212", 1.6],
      ["M120 240 C142 246 162 246 180 242", 0.9],
    ],
    { start: gHead.end - 0.3, speed: 150 }
  );
  const gc = groom.end - 0.2;

  const bHead = head(BRIDE_HEAD, "translate(252 86) scale(-1 1)", 2.6);
  const braid = "M248 124 C258 140 258 166 262 194 C266 222 262 244 272 264 L276 263 C267 243 271 221 268 193 C265 165 266 138 255 120 Z";
  const pallu = "M244 148 C236 164 226 184 222 204 L230 206 C234 190 242 172 250 156 Z";
  const lowerDrape = "M217 204 L252 214 C266 228 274 248 266 262 C248 272 222 272 210 262 C204 258 206 250 212 247 C220 243 221 228 217 204 Z";
  const bride = ink(
    [
      // back, chest front, blouse edge, the pallu across the chest
      ["M242 140 C248 146 253 152 255 162 C258 178 257 196 252 214", 1.5],
      ["M220 142 C214 148 211 156 212 166 C213 176 216 186 217 204", 1.3],
      ["M244 148 C236 164 226 184 222 204", 1.1],
      ["M250 156 C242 172 234 190 230 206", 1],
      ["M221 147 C226 153 236 155 243 149", 0.9],
      ["M213.5 178 L228.5 178 M237.5 178 L256.8 177", 0.8],
      // the long braid, with a tassel
      [braid, 1.1],
      ["M274 264 C272 270 273 276 276 280 M274 264 C278 270 280 275 282 278", 0.9],
      // seated, legs folded to the side
      ["M252 214 C266 228 274 248 266 262 C248 272 222 272 210 262 C204 258 206 250 212 247 C220 243 221 228 217 204", 1.6],
      ["M226 234 C238 242 250 244 260 244", 0.9],
      ["M220 256 C234 262 248 262 258 260", 0.9],
    ],
    { start: bHead.end - 0.3, speed: 150 }
  );
  const bc = bride.end - 0.2;

  const armSkin = "M216 146 C206 136 198 128 192 118 C182 101 170 84 158 70 C153 66 146 66 141 69 C138 71 138 75 141 76 C146 77 152 78 156 80 C159 81 162 80 164 77 C175 97 186 115 196 132 C202 142 210 150 220 158 Z";
  const sleeve = "M216 146 C212 142 209 139 206 136 L210 150 C213 153 216 156 220 158 Z";
  const arm = ink(
    [
      // her far arm, lifted over to his head
      ["M216 146 C206 136 198 128 192 118 C182 101 170 84 158 70", 1.3],
      ["M220 158 C210 150 202 142 196 132 C186 115 175 97 164 77", 1.2],
      ["M158 70 C153 66 146 66 141 69 C138 71 138 75 141 76 C146 77 152 78 156 80 C159 81 162 80 164 77", 1.1],
      ["M146 68.6 C144.4 70.6 144.4 73 145.6 76", 0.7],
      ["M151 68 C149.4 70.4 149.6 73.4 151 77.2", 0.7],
      ["M206 136 L210 150", 1],
      ["M162 80 C164 84 167 86 170 87", 0.9], ["M165 85 C167 89 170 91 173 92", 0.9],
    ],
    { start: bride.end - 0.2, speed: 150 }
  );
  const ac = arm.end;

  const rice = [
    [139, 80], [135, 77], [141, 84], [131, 78], [136, 83], [127, 76], [123, 78], [132, 73],
    [165, 186], [170, 185], [168, 189],
  ];
  const jasmine = [[254, 127], [256.4, 132], [258, 137], [259.2, 142], [260.2, 147], [261, 152], [261.6, 157]];

  return (
    svgOpen("30 6 310 294", "The bride showering turmeric rice over the groom's head, both seated on wooden peetalu beneath a golden mandapam arch", "art--couple") +
    m.svg +
    // colour, in the order a painter would lay it
    paints([[seatG, "turmeric"], [seatB, "turmeric"],
      ["M84 264.5 L204 262.5 L204 265.5 L84 267.5 Z", "kumkum"], ["M206 272.5 L292 270.5 L292 273.5 L206 275.5 Z", "kumkum"]], seats.end) +
    paints(
      [
        ["M110 131 C104 135 97 139 95 149 C92 163 93 183 97 201 C99 209 101 215 103 220 L146 208 L146 186 C146 176 149 164 148 152 C147 142 142 136 134 132 Z", "skin"],
        ["M117 187 C121 193 129 197 139 199 C151 201 160 200 169 197 C175 195 177 191 175 187 C172 183 166 183 162 186 C148 187 136 186 130 181 Z", "skin"],
        [kanduvaBack, "kanduva"],
        [kanduvaFront, "kanduva"],
        ["M103 220 C92 230 90 246 102 254 C126 262 164 262 190 252 C198 248 198 238 190 234 C178 228 164 220 146 212 L146 206 C132 214 116 216 99 212 Z", "cream"],
        ["M102 254 C126 262 164 262 190 252 C186 258 160 266 130 265 C114 264 104 260 102 254 Z", "gold"],
        ["M99 212 C116 216 132 214 146 206 L148 211 C134 219 116 221 100 217 Z", "kumkum"],
        ["M135.2 173.5 L144 173.5 L144 178 L135 178 Z", "gold"],
      ],
      gc
    ) +
    gHead.fills +
    paints(
      [
        ["M242 140 C248 146 253 152 255 162 C258 178 257 196 252 214 L217 214 L217 204 C216 186 213 176 212 166 C211 156 214 148 220 142 Z", "pink"],
        ["M221 147 C226 153 236 155 243 149 C248 152 253 156 255 162 C256.4 168 256.9 173 256.8 177 L213.5 178 C212.4 173 212 170 212 166 C211 156 214 148 220 142 Z", "green"],
        ["M220 142 C226 141 236 140 242 140 C243 143 243 146 243 149 C236 155 226 153 221 147 Z", "skin"],
        [pallu, "pink-deep"],
        ["M244 148 C236 164 226 184 222 204 L224.6 204.7 C228 186 238 166 246.6 150.6 Z", "gold"],
        [lowerDrape, "pink"],
        ["M210 262 C222 272 248 272 266 262 C264 268 250 277 236 277 C222 277 212 270 210 262 Z", "gold"],
        ["M221 147 C226 153 236 155 243 149 L243 153 C236 159 226 158 221 151 Z", "gold"],
      ],
      bc
    ) +
    `<path class="ink-fill" style="--d:${f(bc)}s" d="${braid}"/>` +
    bHead.fills +
    paints(
      [
        [armSkin, "skin"],
        [sleeve, "green"],
        ["M162 80 C164 84 167 86 170 87 L173 92 C170 91 167 89 165 85 Z", "gold"],
        ["M272 263 C272 270 274 276 278 280 L283 278 C281 273 278 268 277 262 Z", "gold"],
      ],
      ac - 0.3
    ) +
    seats.svg +
    gHead.lines +
    groom.svg +
    bHead.lines +
    bride.svg +
    arm.svg +
    // finishing touches — kumkum, nose ring, rice, jasmine
    dot(220.2, 99, 1.4, "paint paint--kumkum dot", ac + 0.5) +
    `<circle class="ink-ring" style="--d:${f(ac + 0.55)}s" cx="215.2" cy="111.6" r="1.7"/>` +
    rice.map(([x, y], i) => dot(x, y, 1.3, "paint paint--turmeric dot rice", ac + 0.1 + i * 0.07)).join("") +
    jasmine.map(([x, y], i) => dot(x, y, 1.3, "jasmine-bud", ac + 0.3 + i * 0.08)).join("") +
    `</svg>`
  );
}

/* ---------- Garland across the top of the page ----------
   A marigold strand with mango leaves and hanging marigolds, as on the
   card's top edge. It is hung from the centre outwards. `width` is in
   CSS pixels, so the drawing stays at a natural scale on any screen. */

export function garland(width = 800) {
  const W = Math.max(320, Math.round(width));
  const step = 24;
  const n = Math.floor((W - 12) / step);
  const x0 = (W - n * step) / 2;
  const cx = W / 2;
  let fills = "";
  let lines = "";
  let blooms = "";
  for (let i = 0; i <= n; i++) {
    const x = x0 + i * step;
    const t = 0.2 + (Math.abs(x - cx) / W) * 1.8; // centre first
    if (i % 4 === 2) {
      lines += `<path class="ink" pathLength="1" stroke-width="1" style="--d:${f(t)}s;--t:.3s" d="M${f(x)} 10 L${f(x)} 20"/>`;
      blooms += marigold(x, 26, 6.5, i % 8 === 2 ? "marigold" : "turmeric", t + 0.25);
    } else {
      const d = leaf(x, 11, 90 + (i % 2 ? 5 : -5), 28 + (i % 3) * 4, 5.5);
      lines += `<path class="ink" pathLength="1" stroke-width="1" style="--d:${f(t)}s;--t:.55s" d="${d}"/>`;
      fills += paint(d, i % 2 ? "green" : "green-light", t + 0.35);
    }
  }
  return (
    `<svg class="art art--garland" viewBox="0 0 ${W} 48" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">` +
    fills +
    lines +
    `<path class="strand strand--a" style="--d:.1s" d="M0 7 H${W}"/>` +
    `<path class="strand strand--b" style="--d:.2s" d="M8 7 H${W}"/>` +
    blooms +
    `</svg>`
  );
}

/* ---------- Thoranam — mango leaves & marigolds on a string ---------- */

export function thoranam() {
  const W = 320;
  const q = (t) => {
    // quadratic string from (6,8) sagging to the middle and back up to (314,8)
    const x = (1 - t) ** 2 * 6 + 2 * (1 - t) * t * 160 + t ** 2 * 314;
    const y = (1 - t) ** 2 * 8 + 2 * (1 - t) * t * 30 + t ** 2 * 8;
    return [x, y];
  };
  const strokes = [["M6 8 Q160 30 314 8", 1.1]];
  const leaves = [];
  const blooms = [];
  const N = 13;
  for (let i = 1; i < N; i++) {
    const [x, y] = q(i / N);
    if (i % 3 === 0) {
      blooms.push([x, y + 9, i % 2 ? "marigold" : "turmeric"]);
      strokes.push([`M${f(x)} ${f(y)} L${f(x)} ${f(y + 3)}`, 1]);
    } else {
      const d = leaf(x, y, 90 + (i % 2 ? 1 : -1) * 6, 28 + (i % 2) * 5, 5.5);
      leaves.push([d, i % 2 ? "green" : "green-light"]);
      strokes.push([d, 1.1]);
    }
  }
  const lines = ink(strokes, { start: 0, speed: 260, overlap: 0.3 });
  const w = lines.end - 0.3;
  return (
    svgOpen(`0 0 ${W} 60`, "", "art--thoranam") +
    paints(leaves, w, 0.06) +
    lines.svg +
    blooms.map(([x, y, tone], i) => marigold(x, y, 6.5, tone, w + 0.2 + i * 0.1)).join("") +
    `</svg>`
  );
}

/* ---------- Small lotus with two gold lines — the "with" divider ---------- */

export function lotusRule() {
  const c = "M158 24 C151 17 152 8 158 2 C164 8 165 17 158 24 Z";
  const l = "M156 24 C144 24 136 18 133 10 C144 11 152 16 156 24 Z";
  const r = "M160 24 C172 24 180 18 183 10 C172 11 164 16 160 24 Z";
  const lines = ink(
    [
      ["M8 20 C40 20 64 19 84 18", 1.1, "gold"],
      ["M232 18 C252 19 276 20 308 20", 1.1, "gold"],
      [c, 1.2], [l, 1.1], [r, 1.1],
    ],
    { start: 0, speed: 160, overlap: 0.5 }
  );
  return (
    svgOpen("0 0 316 28", "", "art--rule") +
    paints([[l, "pink-light"], [r, "pink-light"], [c, "pink"]], lines.end - 0.2) +
    dot(96, 18, 2.2, "paint paint--turmeric dot", lines.end) +
    dot(220, 18, 2.2, "paint paint--turmeric dot", lines.end) +
    lines.svg +
    `</svg>`
  );
}

/* ---------- Corner sprig — a mango twig with a lotus bud ---------- */

export function sprig(mirror = false) {
  const ls = [leaf(28, 124, 205, 30, 6), leaf(44, 100, -12, 32, 6), leaf(62, 77, 196, 26, 5)];
  const bud = "M88 32 C79 24 80 12 89 4 C98 12 98 24 88 32 Z";
  const lines = ink(
    [
      ["M12 150 C22 118 42 92 64 74 C78 62 88 46 88 30", 1.3],
      ...ls.map((d) => [d, 1.1]),
      [bud, 1.2],
      ["M88 32 C85 23 86 13 89 4", 0.9],
    ],
    { start: 0, speed: 150 }
  );
  return (
    svgOpen("0 0 110 160", "", `art--sprig${mirror ? " art--mirror" : ""}`) +
    paints([...ls.map((d, i) => [d, i % 2 ? "green-light" : "green"]), [bud, "pink"]], lines.end - 0.3) +
    lines.svg +
    `</svg>`
  );
}

/* ---------- Corner lotus — the card's bottom-corner flourish ---------- */

export function cornerLotus(mirror = false) {
  const petals = [
    ["M36 62 C24 64 12 60 6 52 C18 50 30 54 36 62 Z", "pink-light"],
    ["M44 62 C56 64 68 60 74 52 C62 50 50 54 44 62 Z", "pink-light"],
    ["M38 64 C26 60 18 50 16 38 C28 42 36 52 38 64 Z", "pink"],
    ["M42 64 C54 60 62 50 64 38 C52 42 44 52 42 64 Z", "pink"],
    ["M40 64 C32 50 34 36 40 26 C46 36 48 50 40 64 Z", "pink-deep"],
  ];
  const pad = "M40 72 C60 80 90 78 112 64 C92 62 64 63 40 72 Z";
  const lines = ink(
    [["M40 66 C42 74 40 82 36 90", 1.1], [pad, 1.1], ...petals.map(([d]) => [d, 1.1])],
    { start: 0, speed: 140 }
  );
  return (
    svgOpen("0 0 116 92", "", `art--corner${mirror ? " art--mirror" : ""}`) +
    paints([[pad, "green"], ...petals], lines.end - 0.3, 0.1) +
    dot(40, 60, 2.2, "paint paint--turmeric dot", lines.end + 0.4) +
    lines.svg +
    `</svg>`
  );
}
