import "./fonts.css";
import "./style.css";
import { config } from "./config.js";

const { groom, bride, wedding: w, venue, music } = config;

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
// Card convention: "(Late)" in italics.
const withLate = (s) => esc(s).replace(/ ?\(Late\)/g, "&nbsp;<em>(Late)</em>");
// Each couple stays together; narrow screens break the line at the "&".
const hostLine = (s) =>
  s
    .split(" & ")
    .map((part, i, all) => `<span class="nowrap">${withLate(part)}${i < all.length - 1 ? " &amp;" : ""}</span>`)
    .join(" ");
// "son of" stays quiet; the parents' names are set like the hosts'.
const parentsLine = (p) =>
  `<span class="person__relation">${esc(p.relation)}</span> <span class="family-names">${hostLine(p.parents)}</span>`;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   PAINTING LAYERS
   Each painting was cut into layers that share one coordinate
   grid (the 1276-wide frame of the originals). A layer is placed
   with --x / --y / --w in those units; the stage converts them to
   percentages. Figures carry two images — the black ink linework
   and the full colour — so each can be sketched, then coloured in.
   ============================================================ */

const pos = (p) => (p ? `--x:${p[0]};--y:${p[1]};--w:${p[2]};` : "");

// Each layer's pixel size (the ink and colour images match), so the page
// reserves its space before it loads; a lazy image with no height yet may
// never be fetched on wide screens.
const SIZES = {
  arch: [975, 295], "banana-l": [203, 493], "banana-r": [208, 487],
  "couple-garland": [379, 556], dhol: [360, 258], ganesha: [417, 440],
  jeelakarra: [843, 502], mangalyam: [717, 524], "motif-l": [211, 148],
  "motif-r": [218, 148], offerings: [357, 262], "saptapadi-flame": [159, 82],
  saptapadi: [538, 540],
};
const dims = (name) => (SIZES[name] ? `width="${SIZES[name][0]}" height="${SIZES[name][1]}"` : "");

const img = (name, alt, eager) =>
  `<img src="art/${name}.webp" alt="${esc(alt)}" ${dims(name)} ${eager ? "" : 'loading="lazy"'} decoding="async" draggable="false">`;

// A plain layer: frame pieces (arch, motifs, flame).
const layer = (cls, name, p, { eager = false, alt = "" } = {}) =>
  `<div class="layer ${cls}" style="${pos(p)}">${img(name, alt, eager)}</div>`;

// A figure layer: ink sketch underneath, colour laid over it.
const painted = (cls, name, p, alt, { eager = false, delay = 0 } = {}) =>
  `<div class="${p ? "layer " : ""}paint ${cls}" style="${pos(p)}--delay:${delay}s">` +
  `<img class="paint__ink" src="art/${name}-ink.webp" alt="" aria-hidden="true" ${dims(name)} ${eager ? "" : 'loading="lazy"'} decoding="async" draggable="false">` +
  `<img class="paint__colour" src="art/${name}.webp" alt="${esc(alt)}" ${dims(name)} ${eager ? "" : 'loading="lazy"'} decoding="async" draggable="false">` +
  `</div>`;

/* ---------- akshintalu: turmeric rice & petals, showered once ---------- */

function shower(count = 38) {
  let out = "";
  for (let i = 0; i < count; i++) {
    const kind = i % 5 === 0 ? "petal" : i % 7 === 0 ? "petal petal--pink" : "rice";
    const x = 8 + Math.random() * 84;
    const drift = (Math.random() - 0.5) * 60;
    const dur = 2.4 + Math.random() * 1.6;
    const delay = Math.random() * 1.4;
    const spin = (Math.random() - 0.5) * 720;
    out += `<i class="${kind}" style="--sx:${x.toFixed(1)}%;--drift:${drift.toFixed(0)}px;--dur:${dur.toFixed(2)}s;--dl:${delay.toFixed(2)}s;--spin:${spin.toFixed(0)}deg"></i>`;
  }
  return `<div class="shower" aria-hidden="true">${out}</div>`;
}

/* ============================================================
   MARKUP
   ============================================================ */

const garland = `<div class="garland" aria-hidden="true"></div>`;

const hero = `
  <header class="hero" id="top">
    <div class="stage stage--hero" id="hero-stage">
      ${layer("arch h-arch", "arch", null, { eager: true })}
      <div class="layer banana h-bl"><div class="sway">${img("banana-l", "", true)}</div></div>
      <div class="layer banana banana--r h-br"><div class="sway">${img("banana-r", "", true)}</div></div>
      ${layer("motif h-ml", "motif-l", null, { eager: true })}
      ${layer("motif motif--r h-mr", "motif-r", null, { eager: true })}

      <div class="ganesha-group">
        <div class="layer h-ganesha"><div class="dance">${painted("", "ganesha", null, "Lord Ganesha dancing, in Bapu's painting", { eager: true, delay: 0.9 })}</div></div>
        <div class="layer h-dhol"><div class="beat">${painted("", "dhol", null, "A dhol and nadaswaram", { eager: true, delay: 1.5 })}</div></div>
        <div class="layer h-offer"><div class="float">${painted("", "offerings", null, "Offerings of coconut, bananas and betel leaves beside a brass kalasham", { eager: true, delay: 1.8 })}</div></div>
      </div>

      <div class="layer h-couple couple">
        ${painted("", "couple-garland", null, "The bride and groom exchanging garlands, in Bapu's painting", { eager: true, delay: 0.5 })}
        ${reduceMotion ? "" : shower()}
      </div>
    </div>

    <div class="hero__text">
      <div class="hero__intro" id="hero-intro">
        <p class="hero__lead lead" data-rise style="--i:0">${esc(config.blessingLine)}</p>
        <p class="eyebrow" data-rise style="--i:1">The wedding of</p>
        <p class="hero__short display" id="intro-title" data-rise style="--i:2">${esc(groom.firstName)} <span class="joiner">&amp;</span> ${esc(bride.firstName)}</p>
        <button type="button" class="btn" id="open-invite" data-rise style="--i:3">Open the invitation</button>
      </div>
    </div>
    <h1 class="visually-hidden" id="hero-title" tabindex="-1">The wedding of ${esc(groom.name)} &amp; ${esc(bride.name)}</h1>
  </header>`;

const rule = `<div class="rule" data-draw aria-hidden="true"></div>`;

const invitation = `
  <section class="section invitation" id="invitation" aria-label="Invitation">
    <figure class="scene scene--blessing" data-scene aria-hidden="true">
      <div class="stage stage--blessing">
        ${layer("arch", "arch", [11, 8, 975])}
        ${painted("scene__fig", "ganesha", [378, 100, 240], "")}
      </div>
    </figure>
    <p class="telugu blessing-row" lang="te" data-reveal>
      ${config.blessing
        .split(" · ")
        .map((word) => `<span>${esc(word)}</span>`)
        .join("")}
    </p>

    <p class="invite-lead lead" data-reveal>${esc(config.blessingLine)},</p>
    <div class="hosts" data-reveal style="--i:1">
      ${config.hosts.map((h) => `<p class="family-names">${hostLine(h)}</p>`).join("")}
    </div>
    <p class="invite-line lead" data-reveal style="--i:2">${esc(config.inviteLine)}</p>

    <div class="person" data-reveal style="--i:3">
      <h2 class="person__name heading">${esc(groom.name)}</h2>
      <p class="person__parents">${parentsLine(groom)}</p>
    </div>

    <div class="with" data-draw>
      <img class="with__motif" src="art/motif-l.webp" alt="" width="211" height="148" loading="lazy">
      <span class="with__word joiner">with</span>
      <img class="with__motif with__motif--r" src="art/motif-r.webp" alt="" width="218" height="148" loading="lazy">
    </div>

    <div class="person" data-reveal>
      <h2 class="person__name heading">${esc(bride.name)}</h2>
      <p class="person__parents">${parentsLine(bride)}</p>
    </div>
  </section>`;

// A painted scene beneath its own arch, as in the originals.
const scene = (id, p, alt, caption, extra = "", { arch = true } = {}) => `
  <figure class="scene scene--${id}" data-scene>
    <div class="stage stage--scene${arch ? "" : " stage--bare"}">
      ${arch ? layer("arch", "arch", [11, 8, 975]) : ""}
      ${extra}
      ${painted("scene__fig", id, p, alt)}
    </div>
    <figcaption>
      <span class="telugu" lang="te">${esc(caption.te)}</span>
      <span class="eyebrow">${esc(caption.en)}</span>
    </figcaption>
  </figure>`;

const details = `
  <section class="section details" id="details" aria-labelledby="details-title">
    ${scene("jeelakarra", [75, 222, 843], "The bride and groom placing jeelakarra-bellam on each other's heads at the Sumuhurtham, in Bapu's painting", { te: "జీలకర్ర బెల్లం", en: "Jeelakarra Bellam" })}

    <p class="eyebrow" data-reveal>The Wedding</p>
    <h2 class="visually-hidden" id="details-title">Wedding details</h2>

    <div class="date-row" data-reveal style="--i:1">
      <span class="date-row__side" aria-hidden="true"></span>
      <p class="date-row__center">
        <span class="date-row__weekday caption">${esc(w.dayName)}</span>
        <span class="date-row__day display">${esc(w.day)}</span>
        <span class="date-row__month caption">${esc(w.month)} ${esc(w.year)}</span>
      </p>
      <span class="date-row__side" aria-hidden="true"></span>
    </div>

    <div class="muhurtham" data-reveal style="--i:2">
      <p class="telugu" lang="te">${esc(w.muhurthamTelugu)}</p>
      <p class="eyebrow">${esc(w.muhurthamLabel)}</p>
      <p class="muhurtham__time heading">${esc(w.muhurtham)}</p>
      <p class="muhurtham__after lead">${esc(w.afterMuhurtham)}</p>
    </div>

    <div class="venue" data-reveal style="--i:3">
      <p class="eyebrow">Venue</p>
      <p class="venue__name heading">${esc(venue.name)}</p>
      <p class="venue__city caption">${esc(venue.city)}</p>
      <a class="btn btn--light" href="${esc(venue.mapUrl)}" target="_blank" rel="noopener noreferrer">
        View on map <span aria-hidden="true">↗</span>
      </a>
    </div>
  </section>`;

const countdown = `
  <section class="section rituals" aria-label="Mangalya Dharana and Saptapadi">
    ${scene("mangalyam", [143, 189, 717], "The groom tying the mangalsutra as the bride bows her head, a relative holding her braid, in Bapu's painting", { te: "మాంగల్య ధారణ", en: "Mangalya Dharana" })}
    ${scene(
      "saptapadi",
      [235, 10, 538],
      "The bride and groom walking around the sacred fire, their garments tied together, in Bapu's painting",
      { te: "సప్తపది", en: "Saptapadi" },
      `<div class="glow" aria-hidden="true"></div>`,
      { arch: false }
    )}
  </section>
  <section class="countdown" id="countdown" aria-labelledby="countdown-title">
    <div class="rule rule--edge" data-draw aria-hidden="true"></div>
    <div class="countdown__inner">
      <p class="eyebrow" id="countdown-title" data-reveal>Until the ${esc(w.muhurthamLabel)}</p>
      <div class="countdown__grid" data-reveal style="--i:1" role="timer" aria-live="off">
        ${["days", "hours", "minutes", "seconds"]
          .map(
            (u) => `<div class="unit"><span class="unit__num display" data-unit="${u}">–</span><span class="unit__label caption">${u}</span></div>`
          )
          .join("")}
      </div>
      <p class="countdown__done heading" hidden>Married on ${esc(w.dateLong)} · with your blessings</p>
    </div>
    <div class="rule rule--edge" data-draw aria-hidden="true"></div>
  </section>`;

const calendar = `
  <section class="section save" id="calendar" aria-labelledby="calendar-title">
    <p class="eyebrow" data-reveal>Save the evening</p>
    <h2 class="save__title heading" id="calendar-title" data-reveal style="--i:1">Add it to your calendar</h2>
    <div class="save__actions" data-reveal style="--i:2">
      <a class="btn" href="wedding.ics" download="Tarun-Priyamvada-Wedding.ics">Apple · Outlook</a>
      <a class="btn btn--light" href="add-to-google.html" target="_blank" rel="noopener">Google Calendar</a>
    </div>
    <p class="save__note caption" data-reveal style="--i:3">${esc(w.dateLong)}&nbsp;· ${esc(w.muhurthamLabel)} ${esc(w.muhurtham)} (IST)</p>
  </section>`;

const closing = `
  <footer class="closing">
    <div class="section">
      <p class="telugu closing__blessing" lang="te" data-reveal>${esc(config.closing.blessing)}</p>
      <p class="closing__line lead" data-reveal style="--i:1">${esc(config.closing.line)}</p>
      <div class="closing__plants" aria-hidden="true">
        <div class="banana" data-draw><div class="sway">${img("banana-l", "", false)}</div></div>
        <div class="banana banana--r" data-draw><div class="sway">${img("banana-r", "", false)}</div></div>
      </div>
    </div>
    <div class="rule rule--edge" data-draw aria-hidden="true"></div>
    <p class="credit caption">${esc(config.artCredit)}</p>
  </footer>`;

const musicToggle = music.src
  ? `<button type="button" class="music" id="music" aria-pressed="false" aria-label="Play music: ${esc(music.title)}">
       <svg class="music__play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>
       <svg class="music__pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 5.5h3v13h-3zM13.5 5.5h3v13h-3z"/></svg>
       <span class="music__label" aria-hidden="true">${esc(music.title)}</span>
     </button>
     <audio id="audio" src="${esc(music.src)}" loop preload="auto"></audio>`
  : "";

document.getElementById("app").innerHTML =
  garland +
  `<main id="main">${hero}<div id="rest" hidden>${rule}${invitation}${rule}${details}${countdown}${calendar}${closing}</div></main>` +
  musicToggle;

// The sacred fire's flames flicker over their own painted flames.
document
  .querySelector(".scene--saptapadi .stage")
  .insertAdjacentHTML("beforeend", layer("flame", "saptapadi-flame", [440, 375, 159]));

/* ============================================================
   THORANAM — a row of painted tiles that sway in a breeze
   ============================================================ */

const garlandEl = document.querySelector(".garland");
function hangGarland() {
  const tileW = garlandEl.clientHeight * (272 / 120);
  const n = Math.ceil(window.innerWidth / tileW) + 1;
  if (garlandEl.childElementCount === n) return;
  const mid = (n - 1) / 2;
  garlandEl.innerHTML = Array.from(
    { length: n },
    (_, i) => `<span style="--i:${i};--from-mid:${Math.abs(i - mid).toFixed(1)}"></span>`
  ).join("");
}
hangGarland();
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(hangGarland, 200);
});

/* ============================================================
   SEQUENCING — wait for the images, then animate
   ============================================================ */

const decoded = (imgs) =>
  Promise.all([...imgs].map((i) => (i.complete && i.naturalWidth ? Promise.resolve() : i.decode().catch(() => {}))));

const body = document.body;
const heroStage = document.getElementById("hero-stage");
body.classList.add("is-intro");

// Opening: the thoranam is hung, the arch unfurls, the banana plants grow,
// then Ganesha, the dhol and the offerings are sketched and coloured in.
decoded(heroStage.querySelectorAll(".h-arch img, .banana img, .motif img, .ganesha-group img")).then(() =>
  requestAnimationFrame(() => body.classList.add("is-ready"))
);

/* ---------- open the invitation ---------- */

const openBtn = document.getElementById("open-invite");
const rest = document.getElementById("rest");

function openInvitation() {
  body.classList.remove("is-intro");
  body.classList.add("is-open");
  rest.hidden = false;
  const couple = heroStage.querySelector(".couple");
  // Rice falls from above the arch down past the couple's feet.
  couple.style.setProperty("--fall", `${Math.round(couple.clientHeight * 1.05)}px`);
  decoded(couple.querySelectorAll("img")).then(() => couple.classList.add("is-in"));
  startMusic();
  // The shower is a one-off; tidy it away once it has fallen.
  setTimeout(() => document.querySelector(".shower")?.remove(), 10000);
  document.getElementById("hero-title").focus({ preventScroll: true });
}
openBtn.addEventListener("click", openInvitation, { once: true });

/* ---------- scroll: reveal text, draw rules, paint scenes ---------- */

const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      io.unobserve(el);
      if (el.hasAttribute("data-scene")) {
        decoded(el.querySelectorAll("img")).then(() => el.classList.add("is-in"));
      } else {
        el.classList.add(el.hasAttribute("data-draw") ? "is-drawn" : "is-in");
      }
    }
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
);

document
  .querySelectorAll("#rest [data-reveal], #rest [data-draw], #rest [data-scene]")
  .forEach((el) => io.observe(el));

/* ============================================================
   COUNTDOWN to the Sumuhurtham — digits roll as they change
   ============================================================ */

const target = new Date(w.muhurthamISO).getTime();
const nums = Object.fromEntries([...document.querySelectorAll("[data-unit]")].map((el) => [el.dataset.unit, el]));
const pad = (n) => String(n).padStart(2, "0");
let timer;

function tick() {
  const diff = target - Date.now();
  if (diff <= 0) {
    clearInterval(timer);
    document.querySelector(".countdown__grid").hidden = true;
    document.querySelector(".countdown__done").hidden = false;
    return;
  }
  const s = Math.floor(diff / 1000);
  const values = {
    days: Math.floor(s / 86400),
    hours: pad(Math.floor((s % 86400) / 3600)),
    minutes: pad(Math.floor((s % 3600) / 60)),
    seconds: pad(s % 60),
  };
  for (const [unit, v] of Object.entries(values)) {
    const el = nums[unit];
    if (el.textContent === String(v)) continue;
    el.textContent = v;
    el.classList.remove("roll");
    void el.offsetWidth; // restart the roll animation
    el.classList.add("roll");
  }
}
tick();
timer = setInterval(tick, 1000);

/* ============================================================
   MUSIC (appears only once a song is set in config)
   ============================================================ */

const audio = document.getElementById("audio");
const musicBtn = document.getElementById("music");

// The button always shows the song's real state — play or pause.
function reflect() {
  const on = !audio.paused;
  musicBtn.setAttribute("aria-pressed", String(on));
  musicBtn.setAttribute("aria-label", `${on ? "Pause" : "Play"} music: ${music.title}`);
  musicBtn.classList.toggle("is-playing", on);
}

// Gentle fades so the song never starts or stops abruptly.
let fade;
function fadeTo(vol, ms, then) {
  cancelAnimationFrame(fade);
  const from = audio.volume;
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / ms);
    audio.volume = Math.min(1, Math.max(0, from + (vol - from) * k));
    if (k < 1) fade = requestAnimationFrame(step);
    else then?.();
  };
  fade = requestAnimationFrame(step);
}

function play() {
  audio.volume = 0;
  audio
    .play()
    .then(() => fadeTo(0.6, 1600))
    .catch(() => {}); // blocked until a tap — the button stays on "play"
}

function pause() {
  fadeTo(0, 500, () => audio.pause());
}

// Opening the invitation is a tap, so browsers allow the song to start.
function startMusic() {
  if (audio) play();
}

if (audio) {
  audio.addEventListener("play", reflect);
  audio.addEventListener("pause", reflect);
  musicBtn.addEventListener("click", () => (audio.paused ? play() : pause()));
}
