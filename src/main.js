import "./style.css";
import { config } from "./config.js";
import { googleCalendarUrl } from "./calendar.js";

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

const img = (name, alt, eager) =>
  `<img src="art/${name}.webp" alt="${esc(alt)}" ${eager ? "" : 'loading="lazy"'} decoding="async" draggable="false">`;

// A plain layer: frame pieces (arch, motifs, flame).
const layer = (cls, name, p, { eager = false, alt = "" } = {}) =>
  `<div class="layer ${cls}" style="${pos(p)}">${img(name, alt, eager)}</div>`;

// A figure layer: ink sketch underneath, colour laid over it.
const painted = (cls, name, p, alt, { eager = false, delay = 0 } = {}) =>
  `<div class="${p ? "layer " : ""}paint ${cls}" style="${pos(p)}--delay:${delay}s">` +
  `<img class="paint__ink" src="art/${name}-ink.webp" alt="" aria-hidden="true" ${eager ? "" : 'loading="lazy"'} decoding="async" draggable="false">` +
  `<img class="paint__colour" src="art/${name}.webp" alt="${esc(alt)}" ${eager ? "" : 'loading="lazy"'} decoding="async" draggable="false">` +
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
        <p class="telugu" lang="te" data-rise style="--i:0">${esc(config.blessing)}</p>
        <p class="eyebrow" data-rise style="--i:1">The wedding of</p>
        <p class="hero__short" id="intro-title" data-rise style="--i:2">${esc(groom.firstName)} <span>&amp;</span> ${esc(bride.firstName)}</p>
        <button type="button" class="btn" id="open-invite" data-rise style="--i:3">Open the invitation</button>
      </div>
      <div class="hero__names" id="hero-names" tabindex="-1">
        <h1>
          <span class="name" data-reveal style="--i:0">${esc(groom.name)}</span>
          <span class="amp" data-reveal style="--i:1" aria-label="and">&amp;</span>
          <span class="name" data-reveal style="--i:2">${esc(bride.name)}</span>
        </h1>
        <p class="hero__date" data-reveal style="--i:3">${esc(w.dateLong)} <span aria-hidden="true">·</span> ${esc(venue.city)}</p>
      </div>
    </div>
  </header>`;

const rule = `<div class="rule" data-draw aria-hidden="true"></div>`;

const invitation = `
  <section class="section invitation" id="invitation" aria-label="Invitation">
    <div class="hosts" data-reveal>
      ${config.hosts.map((h) => `<p>${hostLine(h)}</p>`).join("")}
    </div>
    <p class="invite-line" data-reveal style="--i:1">${esc(config.inviteLine)}</p>

    <div class="person" data-reveal style="--i:2">
      <h2 class="person__name">${esc(groom.name)}</h2>
      <p class="person__parents">${esc(groom.parents)}</p>
    </div>

    <div class="with" data-draw>
      <img class="with__motif" src="art/motif-l.webp" alt="" loading="lazy">
      <span class="with__word">with</span>
      <img class="with__motif with__motif--r" src="art/motif-r.webp" alt="" loading="lazy">
    </div>

    <div class="person" data-reveal>
      <h2 class="person__name">${esc(bride.name)}</h2>
      <p class="person__parents">${esc(bride.parents)}</p>
    </div>
  </section>`;

// A painted scene beneath its own arch, as in the originals.
const scene = (id, p, alt, caption, extra = "") => `
  <figure class="scene scene--${id}" data-scene>
    <div class="stage stage--scene">
      ${layer("arch", "arch", [11, 8, 975])}
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
    ${scene("jeelakarra", [75, 222, 843], "The bride and groom placing jeelakarra-bellam on each other's heads at the muhurtham, in Bapu's painting", { te: "జీలకర్ర బెల్లం", en: "Jeelakarra Bellam" })}

    <p class="eyebrow" data-reveal>The Wedding</p>
    <h2 class="visually-hidden" id="details-title">Wedding details</h2>

    <div class="date-row" data-reveal style="--i:1">
      <p class="date-row__side">${esc(w.dayName)}</p>
      <p class="date-row__center">
        <span class="date-row__month">${esc(w.month)}</span>
        <span class="date-row__day">${esc(w.day)}</span>
        <span class="date-row__year">${esc(w.year)}</span>
      </p>
      <p class="date-row__side date-row__time">${esc(w.startsAt)}</p>
    </div>

    <div class="muhurtham" data-reveal style="--i:2">
      <p class="eyebrow">Muhurtham</p>
      <p class="muhurtham__time">${esc(w.muhurtham)}</p>
      <p class="muhurtham__after">${esc(w.afterMuhurtham)}</p>
    </div>

    <div class="venue" data-reveal style="--i:3">
      <p class="eyebrow">Venue</p>
      <p class="venue__name">${esc(venue.name)}</p>
      <p class="venue__city">${esc(venue.city)}</p>
      <a class="btn btn--light" href="${esc(venue.mapUrl)}" target="_blank" rel="noopener noreferrer">
        View on map <span aria-hidden="true">↗</span>
      </a>
    </div>
  </section>`;

const countdown = `
  <section class="section mangalyam" aria-label="Mangalya Dharana">
    ${scene("mangalyam", [143, 189, 717], "The groom tying the mangalsutra as the bride bows her head, a relative holding her braid, in Bapu's painting", { te: "మాంగల్య ధారణ", en: "Mangalya Dharana" })}
  </section>
  <section class="countdown" id="countdown" aria-labelledby="countdown-title">
    <div class="rule rule--edge" data-draw aria-hidden="true"></div>
    <div class="countdown__inner">
      <p class="eyebrow" id="countdown-title" data-reveal>Until the Muhurtham</p>
      <div class="countdown__grid" data-reveal style="--i:1" role="timer" aria-live="off">
        ${["days", "hours", "minutes", "seconds"]
          .map(
            (u) => `<div class="unit"><span class="unit__num" data-unit="${u}">–</span><span class="unit__label">${u}</span></div>`
          )
          .join("")}
      </div>
      <p class="countdown__done" hidden>Married on ${esc(w.dateLong)} · with your blessings</p>
    </div>
    <div class="rule rule--edge" data-draw aria-hidden="true"></div>
  </section>`;

const calendar = `
  <section class="section save" id="calendar" aria-labelledby="calendar-title">
    <p class="eyebrow" data-reveal>Save the evening</p>
    <h2 class="save__title" id="calendar-title" data-reveal style="--i:1">Add it to your calendar</h2>
    <div class="save__actions" data-reveal style="--i:2">
      <a class="btn" href="wedding.ics" download="Tarun-Priyamvada-Wedding.ics">Apple · Outlook</a>
      <a class="btn btn--light" href="${esc(googleCalendarUrl(config))}" target="_blank" rel="noopener noreferrer">Google Calendar</a>
    </div>
    <p class="save__note" data-reveal style="--i:3">${esc(w.dateLong)} · ${esc(w.startsAt)} (IST)</p>
  </section>`;

const closing = `
  <footer class="closing">
    <div class="section">
      ${scene(
        "saptapadi",
        [235, 177, 538],
        "The bride and groom walking around the sacred fire, their garments tied together, in Bapu's painting",
        { te: "సప్తపది", en: "Saptapadi" },
        `<div class="glow" aria-hidden="true"></div>`
      )}
      <p class="telugu closing__blessing" lang="te" data-reveal>${esc(config.closing.blessing)}</p>
      <p class="closing__line" data-reveal style="--i:1">${esc(config.closing.line)}</p>
      <p class="closing__names" data-reveal style="--i:2">${esc(groom.firstName)} &amp; ${esc(bride.firstName)}</p>
      <div class="closing__plants" aria-hidden="true">
        <div class="banana" data-draw><div class="sway">${img("banana-l", "", false)}</div></div>
        <div class="banana banana--r" data-draw><div class="sway">${img("banana-r", "", false)}</div></div>
      </div>
    </div>
    <div class="rule rule--edge" data-draw aria-hidden="true"></div>
    <p class="credit">${esc(config.artCredit)}</p>
  </footer>`;

const musicToggle = music.src
  ? `<button type="button" class="music" id="music" aria-pressed="false" aria-label="Play music${music.title ? `: ${esc(music.title)}` : ""}">
       <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/><path class="music__mute" d="M3 3l18 18"/></svg>
     </button>
     <audio id="audio" src="${esc(music.src)}" loop preload="none"></audio>`
  : "";

document.getElementById("app").innerHTML =
  garland +
  `<main id="main">${hero}${rule}<div id="rest" inert>${invitation}${rule}${details}${countdown}${calendar}${closing}</div></main>` +
  musicToggle;

// The sacred fire's flames flicker over their own painted flames.
document
  .querySelector(".scene--saptapadi .stage")
  .insertAdjacentHTML("beforeend", layer("flame", "saptapadi-flame", [440, 542, 159]));

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
document.documentElement.classList.add("is-locked");

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
  document.documentElement.classList.remove("is-locked");
  rest.inert = false;
  const couple = heroStage.querySelector(".couple");
  // Rice falls from above the arch down past the couple's feet.
  couple.style.setProperty("--fall", `${Math.round(couple.clientHeight * 1.05)}px`);
  decoded(couple.querySelectorAll("img")).then(() => couple.classList.add("is-in"));
  startMusic();
  setTimeout(
    () => document.querySelectorAll(".hero__names [data-reveal]").forEach((el) => el.classList.add("is-in")),
    reduceMotion ? 0 : 1300
  );
  // The shower is a one-off; tidy it away once it has fallen.
  setTimeout(() => document.querySelector(".shower")?.remove(), 10000);
  document.getElementById("hero-names").focus({ preventScroll: true });
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
  .querySelectorAll("#rest [data-reveal], #rest [data-draw], #rest [data-scene], main > .rule")
  .forEach((el) => io.observe(el));

/* ============================================================
   COUNTDOWN to the muhurtham — digits roll as they change
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

function setPlaying(on) {
  musicBtn.setAttribute("aria-pressed", String(on));
  musicBtn.setAttribute("aria-label", `${on ? "Pause" : "Play"} music${music.title ? `: ${music.title}` : ""}`);
}

// Gentle fade so the song never starts abruptly.
function fadeTo(vol, ms = 1600) {
  const from = audio.volume;
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / ms);
    audio.volume = from + (vol - from) * k;
    if (k < 1) requestAnimationFrame(step);
    else if (vol === 0) audio.pause();
  };
  requestAnimationFrame(step);
}

function startMusic() {
  if (!audio) return;
  audio.volume = 0;
  audio
    .play()
    .then(() => {
      fadeTo(0.6);
      setPlaying(true);
    })
    .catch(() => setPlaying(false));
}

musicBtn?.addEventListener("click", () => {
  if (audio.paused || musicBtn.getAttribute("aria-pressed") === "false") {
    audio.volume = 0;
    audio.play().then(() => fadeTo(0.6)).catch(() => {});
    setPlaying(true);
  } else {
    fadeTo(0, 600);
    setPlaying(false);
  }
});
