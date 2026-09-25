import "./style.css";
import { config } from "./config.js";
import { googleCalendarUrl } from "./calendar.js";
import { couple, diya, kalasham, thoranam, lotusRule, sprig } from "./art.js";

const { groom, bride, wedding: w, venue, music } = config;

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
// Card convention: "(Late)" in italics.
const withLate = (s) => esc(s).replace(/ ?\(Late\)/g, "&nbsp;<em>(Late)</em>");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- markup ---------- */

const intro = `
  <div class="intro" id="intro" role="dialog" aria-modal="true" aria-labelledby="intro-title">
    <div class="intro__inner">
      <div class="intro__art is-drawn">${diya()}</div>
      <p class="telugu intro__blessing" lang="te">${esc(config.blessing)}</p>
      <p class="eyebrow intro__eyebrow">The wedding of</p>
      <p class="intro__names" id="intro-title">${esc(groom.firstName)} <span>&amp;</span> ${esc(bride.firstName)}</p>
      <button type="button" class="btn intro__open" id="open-invite">Open the invitation</button>
    </div>
  </div>`;

const hero = `
  <header class="section hero" id="top">
    <div class="hero__art">${couple()}</div>
    <h1 class="hero__names">
      <span class="name" data-reveal style="--i:0">${esc(groom.name)}</span>
      <span class="amp" data-reveal style="--i:1" aria-label="and">&amp;</span>
      <span class="name" data-reveal style="--i:2">${esc(bride.name)}</span>
    </h1>
    <p class="hero__date" data-reveal style="--i:3">${esc(w.dateLong)} <span aria-hidden="true">·</span> ${esc(venue.city)}</p>
    <a class="scroll-cue" href="#invitation" aria-label="Read the invitation" data-reveal style="--i:5">
      <svg viewBox="0 0 20 60" aria-hidden="true"><path pathLength="1" d="M10 2 C6 18 14 30 10 46 M4 40 L10 52 L16 40"/></svg>
    </a>
  </header>`;

const invitation = `
  <section class="section invitation" id="invitation" aria-label="Invitation">
    <div class="invitation__art" data-draw>${kalasham()}</div>
    <p class="telugu invitation__blessing" lang="te" data-reveal>${esc(config.blessing)}</p>
    <div class="hosts" data-reveal style="--i:1">
      ${config.hosts.map((h) => `<p>${withLate(h)}</p>`).join("")}
    </div>
    <p class="invite-line" data-reveal style="--i:2">${esc(config.inviteLine)}</p>

    <div class="person" data-reveal style="--i:3">
      <h2 class="person__name">${esc(groom.name)}</h2>
      <p class="person__parents">${esc(groom.parents)}</p>
    </div>

    <div class="with" data-draw>
      ${lotusRule()}
      <span class="with__word">with</span>
    </div>

    <div class="person" data-reveal>
      <h2 class="person__name">${esc(bride.name)}</h2>
      <p class="person__parents">${esc(bride.parents)}</p>
    </div>
  </section>`;

const details = `
  <section class="section details" id="details" aria-labelledby="details-title">
    <div class="details__thoranam" data-draw>${thoranam()}</div>
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
      <div class="venue__sprig venue__sprig--l" data-draw>${sprig()}</div>
      <div class="venue__sprig venue__sprig--r" data-draw>${sprig(true)}</div>
      <p class="eyebrow">Venue</p>
      <p class="venue__name">${esc(venue.name)}</p>
      <p class="venue__city">${esc(venue.city)}</p>
      <a class="btn btn--quiet" href="${esc(venue.mapUrl)}" target="_blank" rel="noopener noreferrer">
        View on map <span aria-hidden="true">↗</span>
      </a>
    </div>
  </section>`;

const countdown = `
  <section class="section countdown" id="countdown" aria-labelledby="countdown-title">
    <p class="eyebrow" id="countdown-title" data-reveal>Until the Muhurtham</p>
    <div class="countdown__grid" data-reveal style="--i:1" role="timer" aria-live="off">
      ${["days", "hours", "minutes", "seconds"]
        .map(
          (u) => `<div class="unit"><span class="unit__num" data-unit="${u}">–</span><span class="unit__label">${u}</span></div>`
        )
        .join("")}
    </div>
    <p class="countdown__done" hidden>Married on ${esc(w.dateLong)} · with your blessings</p>
  </section>`;

const calendar = `
  <section class="section save" id="calendar" aria-labelledby="calendar-title">
    <p class="eyebrow" data-reveal>Save the evening</p>
    <h2 class="save__title" id="calendar-title" data-reveal style="--i:1">Add it to your calendar</h2>
    <div class="save__actions" data-reveal style="--i:2">
      <a class="btn" href="wedding.ics" download="Tarun-Priyamvada-Wedding.ics">Apple · Outlook</a>
      <a class="btn" href="${esc(googleCalendarUrl(config))}" target="_blank" rel="noopener noreferrer">Google Calendar</a>
    </div>
    <p class="save__note" data-reveal style="--i:3">${esc(w.dateLong)} · ${esc(w.startsAt)} (IST)</p>
  </section>`;

const footer = `
  <footer class="section closing">
    <div class="closing__art" data-draw>${diya()}</div>
    <p class="telugu closing__blessing" lang="te" data-reveal>${esc(config.closing.blessing)}</p>
    <p class="closing__line" data-reveal style="--i:1">${esc(config.closing.line)}</p>
    <p class="closing__names" data-reveal style="--i:2">${esc(groom.firstName)} &amp; ${esc(bride.firstName)}</p>
  </footer>`;

const musicToggle = music.src
  ? `<button type="button" class="music" id="music" aria-pressed="false" aria-label="Play music${music.title ? `: ${esc(music.title)}` : ""}">
       <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/><path class="music__mute" d="M3 3l18 18"/></svg>
     </button>
     <audio id="audio" src="${esc(music.src)}" loop preload="none"></audio>`
  : "";

document.getElementById("app").innerHTML =
  intro + `<main id="main" tabindex="-1" inert>${hero + invitation + details + countdown + calendar + footer}</main>` + musicToggle;

/* ---------- intro → open the invitation ---------- */

const introEl = document.getElementById("intro");
const mainEl = document.getElementById("main");
const openBtn = document.getElementById("open-invite");
document.documentElement.classList.add("is-locked");

function openInvitation() {
  introEl.classList.add("is-leaving");
  document.documentElement.classList.remove("is-locked");
  mainEl.inert = false;
  document.querySelector(".hero__art").classList.add("is-drawn");
  document.body.classList.add("is-open");
  startMusic();
  // Names rise in while the couple is still being drawn.
  const reveal = () =>
    document.querySelectorAll(".hero [data-reveal]").forEach((el) => el.classList.add("is-in"));
  if (reduceMotion) {
    reveal();
    introEl.remove();
  } else {
    setTimeout(reveal, 900);
    setTimeout(() => introEl.remove(), 1400);
  }
  mainEl.focus({ preventScroll: true });
}
openBtn.addEventListener("click", openInvitation, { once: true });

/* ---------- scroll: reveal text, draw illustrations ---------- */

const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add(e.target.hasAttribute("data-draw") ? "is-drawn" : "is-in");
      io.unobserve(e.target);
    }
  },
  { rootMargin: "0px 0px -6% 0px", threshold: 0.1 }
);

// Hero text waits for the invitation to open; everything else waits for scroll.
document.querySelectorAll("[data-reveal], [data-draw]").forEach((el) => {
  if (el.closest(".hero")) return;
  io.observe(el);
});

/* ---------- countdown to the muhurtham ---------- */

const target = new Date(w.muhurthamISO).getTime();
const nums = Object.fromEntries(
  [...document.querySelectorAll("[data-unit]")].map((el) => [el.dataset.unit, el])
);
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
    if (nums[unit].textContent !== String(v)) nums[unit].textContent = v;
  }
}
tick();
timer = setInterval(tick, 1000);

/* ---------- music (appears only once a song is set in config) ---------- */

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
  audio.play().then(() => {
    fadeTo(0.6);
    setPlaying(true);
  }).catch(() => setPlaying(false));
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
