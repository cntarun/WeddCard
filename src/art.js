/* ============================================================
   LINE ART — hand-drawn style SVG illustrations.

   Every drawing is a list of ink strokes plus a few loose colour
   "washes". Strokes are drawn one after another (CSS animates
   stroke-dashoffset; pathLength="1" means no measuring in JS),
   and each stroke's duration follows its length, so the drawing
   moves like a pen rather than a uniform wipe. Washes fade in
   once the linework is done, deliberately a little off-register
   like a brush of colour laid over ink.
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

const f = (n) => Math.round(n * 10) / 10;

/**
 * Turn a list of strokes into timed <path> elements.
 * strokes: [d, width?] — drawn in order, each starting when the previous
 * one is `overlap` of the way through.
 */
function ink(strokes, { start = 0, speed = 150, overlap = 0.55, min = 0.3, max = 1.3 } = {}) {
  let t = start;
  let out = "";
  for (const s of strokes) {
    const [d, w = 1.5] = Array.isArray(s) ? s : [s];
    const dur = Math.min(max, Math.max(min, approxLength(d) / speed));
    out += `<path class="ink" pathLength="1" stroke-width="${w}" style="--d:${f(t * 100) / 100}s;--t:${f(dur * 100) / 100}s" d="${d}"/>`;
    t += dur * overlap;
  }
  return { svg: out, end: t };
}

// Colour wash: a soft filled shape that fades in after the linework.
const wash = (d, tone, delay, extra = "", cls = "") =>
  `<path class="wash wash--${tone}${cls ? " " + cls : ""}" style="--d:${delay}s" d="${d}" ${extra}/>`;

const dot = (x, y, r, cls, delay) =>
  `<circle class="${cls}" style="--d:${delay}s" cx="${x}" cy="${y}" r="${r}"/>`;

// A tapered mango leaf: base (x, y), pointing `deg` (0 = right, 90 = down).
function leaf(x, y, deg, len, w) {
  const a = (deg * Math.PI) / 180;
  const ux = Math.cos(a), uy = Math.sin(a);
  const px = -uy, py = ux;
  const p = (u, v) => `${f(x + ux * u + px * v)} ${f(y + uy * u + py * v)}`;
  return (
    `M${p(0, 0)} C${p(len * 0.22, w)} ${p(len * 0.68, w * 0.85)} ${p(len, 0)} ` +
    `C${p(len * 0.68, -w * 0.85)} ${p(len * 0.22, -w)} ${p(0, 0)}`
  );
}

const svgOpen = (vb, label, cls = "") =>
  `<svg class="art ${cls}" viewBox="${vb}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">`;

/* ---------- Diya on a lotus — the opening "bloom" ---------- */

export function diya() {
  const lamp = ink(
    [
      // bowl, then the rim rising to the lip where the wick sits
      ["M52 118 C58 148 142 148 148 118", 1.8],
      ["M52 118 C70 111 88 110 100 103 C112 110 130 111 148 118", 1.5],
      ["M66 121 C82 117 118 117 134 121", 1.1],
      // lotus seat beneath
      ["M100 148 C90 157 91 169 100 176 C109 169 110 157 100 148", 1.3],
      ["M98 175 C80 176 66 167 60 153 C77 154 90 162 98 175", 1.3],
      ["M102 175 C120 176 134 167 140 153 C123 154 110 162 102 175", 1.3],
      ["M62 172 C52 170 44 163 40 156", 1.1],
      ["M138 172 C148 170 156 163 160 156", 1.1],
      ["M58 182 C86 188 114 188 142 182", 1],
    ],
    { start: 0.1, speed: 120 }
  );
  const flameAt = lamp.end + 0.2;
  const flame = ink(
    [
      ["M100 101 C89 89 91 71 101 50 C111 71 112 89 100 101", 1.4],
      ["M100 96 C95 89 96 80 101 70 C106 80 106 89 100 96", 1],
      // three quiet rays each side
      ["M78 72 L72 68", 1], ["M76 86 L69 86", 1], ["M82 58 L78 52", 1],
      ["M122 72 L128 68", 1], ["M124 86 L131 86", 1], ["M118 58 L122 52", 1],
    ],
    { start: flameAt, speed: 90, overlap: 0.35 }
  );
  const washAt = flameAt + 0.1;
  return (
    svgOpen("0 0 200 200", "A line drawing of a lit diya resting on a lotus", "art--diya") +
    wash("M55 121 C62 146 140 146 146 121 C130 116 70 116 55 121", "gold", washAt + 0.6, 'transform="translate(2 2)"') +
    wash("M100 150 C91 158 92 168 100 174 C108 168 109 158 100 150 M97 173 C82 173 69 166 63 155 C78 157 89 163 97 173 M103 173 C118 173 131 166 137 155 C122 157 111 163 103 173", "maroon", washAt + 0.8, 'transform="translate(1.5 1)"') +
    `<g class="flame" style="--d:${washAt}s">` +
    wash("M100 101 C89 89 91 71 101 50 C111 71 112 89 100 101", "turmeric", washAt, "", "flame-wash") +
    wash("M100 96 C95 89 96 80 101 70 C106 80 106 89 100 96", "flame-core", washAt + 0.15) +
    `</g>` +
    lamp.svg +
    flame.svg +
    `</svg>`
  );
}

/* ---------- Kalasham — brass pot, mango leaves, coconut ---------- */

export function kalasham() {
  const leaves = [
    leaf(92, 78, 196, 46, 7),
    leaf(95, 76, 224, 40, 6.5),
    leaf(108, 78, -16, 46, 7),
    leaf(105, 76, -44, 40, 6.5),
  ];
  const lines = ink(
    [
      ["M78 102 C50 112 46 150 70 166 C86 176 114 176 130 166 C154 150 150 112 122 102", 1.7],
      ["M80 84 C84 92 84 96 78 102", 1.3],
      ["M120 84 C116 92 116 96 122 102", 1.3],
      ["M74 80 C88 74 112 74 126 80 C112 86 88 86 74 80", 1.4],
      ["M88 72 C86 54 94 42 100 36 C106 42 114 54 112 72", 1.5],
      ["M100 36 C98 30 95 27 91 25", 1], ["M100 36 C102 29 105 27 109 25", 1],
      ...leaves.map((d) => [d, 1.2]),
      ["M58 126 C82 136 118 136 142 126", 1.1],
      ["M84 173 C86 180 114 180 116 173", 1.2],
      ["M78 184 C92 188 108 188 122 184", 1],
    ],
    { start: 0.1, speed: 170 }
  );
  const w = lines.end + 0.2;
  return (
    svgOpen("0 0 200 200", "A line drawing of a kalasham with mango leaves and a coconut", "art--kalasham") +
    wash("M80 104 C54 114 52 150 73 164 C88 173 112 173 127 164 C148 150 146 114 120 104 Z", "gold", w, 'transform="translate(3 2)"') +
    wash("M89 72 C87 55 95 44 100 38 C105 44 113 55 111 72 Z", "gold", w + 0.15, 'transform="translate(2 1)" opacity=".7"') +
    dot(92, 150, 1.8, "wash wash--maroon dot", w + 0.3) +
    dot(100, 154, 1.8, "wash wash--maroon dot", w + 0.35) +
    dot(108, 150, 1.8, "wash wash--maroon dot", w + 0.4) +
    lines.svg +
    `</svg>`
  );
}

/* ---------- The couple — talambralu, as on the card ----------
   Seated in profile, facing each other. The bride's arm arcs over
   to shower turmeric rice on the groom's head; her gaze is lowered.
   Heads are drawn in local coordinates (right-facing) and placed
   with a transform — the bride's is mirrored to face left. */

// Right-facing male profile in a ~42 × 60 box.
const GROOM_HEAD = {
  face: "M30 4 C34 7 36 10 36.5 14 C37 17 37 19 36.6 20.5 C38.5 23 40.5 25.5 41 27 C40.2 28.4 38.8 28.6 37.6 29 C38.6 30.2 38.8 31 38.4 32 L37.2 32.9 C38.2 33.6 38.3 34.7 37.6 35.7 C36.8 36.4 36.6 37.2 37.2 38.3 C37.8 40.5 36.4 43.2 33 44 C29 44.8 25 43 22 40",
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
  hair: "M31 8 C27 0 13 -2 6 5 C0 11 -1 24 3 33 C5 38 8 42 12 43 C14 39 16 34 18.5 31 C17 26 17.5 22 20.5 19.5 C23.5 15 26.5 11.5 31 9.5 Z",
  brow: "M23.5 15.4 C27 13.4 31 13.4 34 15.6",
  eye: "M24 19.8 C27 18.6 31 18.7 33.6 20.6 C31 22.3 27.6 22.3 25 21.2 M24 19.8 L21.4 18.3",
  pupil: [30.6, 21],
  ear: "M21 21 C18 21 17.5 28 21 29",
  jhumka: "M19.8 29.5 L19.8 32 M16.6 36 C16.6 32.6 23 32.6 23 36 Z",
  neck: "M29.6 42 C29.2 48 30 52 32 56 M13 42 C14 47 13.4 51 10.5 55",
};

function head(h, transform, start, label) {
  const lines = ink(
    [[h.face, 1.4], [h.hair, 1.2], [h.ear, 1], [h.brow, 1.1], [h.eye, 1.05], [h.neck, 1.3], ...(h.jhumka ? [[h.jhumka, 0.9]] : [])],
    { start, speed: 70, min: 0.25, max: 1.1 }
  );
  const fillAt = f(lines.end + 0.1);
  return {
    svg:
      `<g transform="${transform}" data-part="${label}">` +
      `<path class="ink-fill" style="--d:${fillAt}s" d="${h.hair}"/>` +
      (h.jhumka ? wash("M17 35.6 C17 33 22.6 33 22.6 35.6 Z", "gold", fillAt + 0.3) : "") +
      lines.svg +
      dot(h.pupil[0], h.pupil[1], 0.95, "ink-dot", fillAt) +
      `</g>`,
    end: lines.end,
  };
}

export function couple() {
  const gHead = head(GROOM_HEAD, "translate(100 74)", 0.2, "groom");
  const groom = ink(
    [
      // back, chest front
      ["M110 131 C104 135 97 139 95 149 C92 163 93 183 97 201 C99 209 101 215 103 220", 1.5],
      ["M134 132 C142 136 147 142 148 152 C149 164 146 176 146 186", 1.3],
      // sacred thread
      ["M131 137 C135 155 138 169 140 181", 0.7],
      // near arm down to cupped hands
      ["M110 143 C109 159 112 175 117 187 C121 193 129 197 139 199 C151 201 160 200 168 197", 1.3],
      ["M126 145 C128 159 129 171 130 181 C136 186 148 187 162 186", 1.2],
      ["M162 186 C166 183 172 183 175 187 C177 191 175 195 169 197", 1.2],
      // waistband and seated dhoti
      ["M99 212 C116 216 132 214 146 206", 1.1],
      ["M103 220 C92 230 90 246 102 254 C126 262 164 262 190 252 C198 248 198 238 190 234 C178 228 164 220 146 212", 1.6],
      ["M120 240 C142 246 162 246 180 242", 0.9],
    ],
    { start: gHead.end - 0.3, speed: 150 }
  );

  const bHead = head(BRIDE_HEAD, "translate(252 86) scale(-1 1)", 1.4, "bride");
  const braid =
    "M248 124 C258 140 258 166 262 194 C266 222 262 244 272 264 L276 263 C267 243 271 221 268 193 C265 165 266 138 255 120 Z";
  const bride = ink(
    [
      // back, chest front, the pallu across the chest
      ["M242 140 C248 146 253 152 255 162 C258 178 257 196 252 214", 1.5],
      ["M220 142 C214 148 211 156 212 166 C213 176 216 186 217 204", 1.3],
      ["M244 148 C236 164 226 184 222 204", 1.1],
      ["M250 156 C242 172 234 190 230 206", 1],
      ["M221 147 C226 153 236 155 243 149", 0.9],
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

  const arm = ink(
    [
      // her far arm, lifted over to his head
      ["M216 146 C206 136 198 128 192 118 C182 101 170 84 158 70", 1.3],
      ["M220 158 C210 150 202 142 196 132 C186 115 175 97 164 77", 1.2],
      ["M158 70 C153 66 146 66 141 69 C138 71 138 75 141 76 C146 77 152 78 156 80 C159 81 162 80 164 77", 1.1],
      ["M146 68.6 C144.4 70.6 144.4 73 145.6 76", 0.7],
      ["M151 68 C149.4 70.4 149.6 73.4 151 77.2", 0.7],
      ["M162 80 C164 84 167 86 170 87", 0.9],
      ["M165 85 C167 89 170 91 173 92", 0.9],
      // a quiet ground line
      ["M58 274 C140 281 240 281 312 272", 0.8],
    ],
    { start: bride.end - 0.2, speed: 140 }
  );

  const w = f(arm.end + 0.1);
  const rice = [
    [139, 80], [135, 77], [141, 84], [131, 78], [136, 83], [127, 76], [123, 78], [132, 73],
    [165, 186], [170, 185], [168, 189],
  ];
  const jasmine = [[254, 127], [256.4, 132], [258, 137], [259.2, 142], [260.2, 147], [261, 152], [261.6, 157]];
  return (
    svgOpen("40 40 290 250", "A line drawing of the bride showering turmeric rice over the groom's head, both seated in wedding attire", "art--couple") +
    // colour washes — loose and off-register
    wash("M99 212 C116 216 132 214 146 206 L148 211 C134 219 116 221 100 217 Z", "gold", w, 'transform="translate(1 1)"') +
    wash("M102 254 C126 262 164 262 190 252 C186 258 160 267 130 266 C114 265 104 260 102 254 Z", "gold", w + 0.1, 'transform="translate(1 2)"') +
    wash("M244 148 C236 164 226 184 222 204 L230 206 C234 190 242 172 250 156 Z", "maroon", w + 0.2, 'transform="translate(1.5 0.5)"') +
    wash("M210 262 C222 272 248 272 266 262 C264 268 250 277 236 277 C222 277 212 270 210 262 Z", "maroon", w + 0.3, 'transform="translate(1 1)"') +
    wash("M221 147 C226 153 236 155 243 149 L243 153 C236 159 226 158 221 151 Z", "gold", w + 0.4) +
    wash("M162 80 C164 84 167 86 170 87 L173 92 C170 91 167 89 165 85 Z", "gold", w + 0.45, 'transform="translate(0.5 0)"') +
    wash("M272 263 C272 270 274 276 278 280 L283 278 C281 273 278 268 277 262 Z", "gold", w + 0.5) +
    `<path class="ink-fill" style="--d:${w - 0.4}s" d="${braid}"/>` +
    dot(220.2, 99, 1.4, "wash wash--maroon dot", w + 0.5) +
    `<circle class="ink-ring" style="--d:${w + 0.55}s" cx="215.2" cy="111.6" r="1.7"/>` +
    rice.map(([x, y], i) => dot(x, y, 1.25, "wash wash--turmeric dot rice", f(w + 0.1 + i * 0.07))).join("") +
    jasmine.map(([x, y], i) => dot(x, y, 1.3, "jasmine-bud", f(w + 0.3 + i * 0.08))).join("") +
    gHead.svg +
    groom.svg +
    bHead.svg +
    bride.svg +
    arm.svg +
    `</svg>`
  );
}

/* ---------- Thoranam — mango leaves & marigolds on a string ---------- */

export function thoranam() {
  const W = 320;
  const q = (t) => {
    // quadratic string from (6,8) sagging to (160,24) and back up to (314,8)
    const x = (1 - t) ** 2 * 6 + 2 * (1 - t) * t * 160 + t ** 2 * 314;
    const y = (1 - t) ** 2 * 8 + 2 * (1 - t) * t * 30 + t ** 2 * 8;
    return [x, y];
  };
  const strokes = [["M6 8 Q160 30 314 8", 1.1]];
  const marigolds = [];
  const N = 13;
  for (let i = 1; i < N; i++) {
    const [x, y] = q(i / N);
    if (i % 3 === 0) {
      marigolds.push([x, y + 9]);
      strokes.push([`M${f(x)} ${f(y)} L${f(x)} ${f(y + 3)}`, 1]);
    } else {
      const splay = (i % 2 ? 1 : -1) * 6;
      strokes.push([leaf(x, y, 90 + splay, 28 + (i % 2) * 5, 5.5), 1.1]);
    }
  }
  const lines = ink(strokes, { start: 0, speed: 260, overlap: 0.3 });
  const w = lines.end;
  return (
    svgOpen(`0 0 ${W} 60`, "A thoranam of mango leaves and marigolds", "art--thoranam") +
    marigolds
      .map(([x, y], i) =>
        dot(f(x + 1), f(y + 1), 6.5, "wash wash--turmeric dot", f(w + i * 0.1)) +
        `<circle class="ink-static" style="--d:${f(w - 0.2 + i * 0.1)}s" cx="${f(x)}" cy="${f(y)}" r="5.5" stroke-width="1.1" stroke-dasharray="2.2 1.4"/>` +
        dot(f(x), f(y), 1.6, "wash wash--maroon dot", f(w + 0.2 + i * 0.1))
      )
      .join("") +
    lines.svg +
    `</svg>`
  );
}

/* ---------- Small lotus with two drawn lines — the "with" divider ---------- */

export function lotusRule() {
  const lines = ink(
    [
      ["M8 20 C40 20 64 19 84 18", 1],
      ["M232 18 C252 19 276 20 308 20", 1],
      ["M158 24 C151 17 152 8 158 2 C164 8 165 17 158 24", 1.2],
      ["M156 24 C144 24 136 18 133 10 C144 11 152 16 156 24", 1.1],
      ["M160 24 C172 24 180 18 183 10 C172 11 164 16 160 24", 1.1],
    ],
    { start: 0, speed: 160, overlap: 0.5 }
  );
  return (
    svgOpen("0 0 316 28", "", "art--rule") +
    wash("M158 22 C152 16 153 9 158 4 C163 9 164 16 158 22", "maroon", lines.end, 'transform="translate(1 1)"') +
    lines.svg +
    `</svg>`
  );
}

/* ---------- Corner sprig — a mango twig with a lotus bud ---------- */

export function sprig(mirror = false) {
  const lines = ink(
    [
      ["M12 150 C22 118 42 92 64 74 C78 62 88 46 88 30", 1.3],
      [leaf(28, 124, 205, 30, 6), 1.1],
      [leaf(44, 100, -12, 32, 6), 1.1],
      [leaf(62, 77, 196, 26, 5), 1.1],
      ["M88 32 C79 24 80 12 89 4 C98 12 98 24 88 32", 1.2],
      ["M88 32 C85 23 86 13 89 4", 0.9],
    ],
    { start: 0, speed: 150 }
  );
  return (
    svgOpen("0 0 110 160", "", `art--sprig${mirror ? " art--mirror" : ""}`) +
    wash("M88 30 C80 23 81 13 89 6 C97 13 97 23 88 30", "maroon", lines.end, 'transform="translate(1.5 1)"') +
    lines.svg +
    `</svg>`
  );
}
