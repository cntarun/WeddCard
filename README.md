# Tarun & Priyamvada — Wedding Invitation

A single-page wedding invitation in the manner of **Bapu**: ink line drawings
on ivory paper, drawn stroke by stroke as you arrive and scroll, with colour
used only as small washes of gold, maroon and turmeric.

- **Opening** — a diya is drawn in ink and its flame blooms; the Telugu
  blessing appears; guests tap *Open the invitation*.
- **Hero** — the bride showering talambralu over the groom's head, drawn live.
- **Invitation** — the card's wording: grandparents, parents, both names.
- **The Wedding** — Sunday · 13 December 2026 · 4:00 PM onwards,
  **Muhurtham 7:25 PM, dinner follows**, venue and map link.
- **Countdown** to the Muhurtham, and **Add to calendar** (Apple / Outlook
  `.ics` + Google Calendar).
- **Music toggle** — appears automatically once a song is set (see below).

Everything honours *Reduce Motion*: those guests see the finished drawings.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/
```

## Edit the content — one file

All wording, names, times, the venue and the map link live in
**`src/config.js`**. The page, the countdown and the calendar file all follow
it. Search for `[TODO]` to see what's still open:

1. **Title** — `title` (browser tab + link preview).
2. **Music** — put an MP3 in `public/audio/` and set `music.src`
   (e.g. `"audio/our-song.mp3"`), plus `title` / `artist`. The button appears
   by itself and the song fades in when the invitation is opened.
3. **Venue spelling** — the card reads "Jal Vihaar"; the venue itself spells
   it "Jalavihar".

The calendar entry runs 4:00 PM – 11:00 PM IST; change `wedding.endISO` if
the evening ends at a different time.

## Where things live

```
src/
├── config.js     ← all content
├── art.js        ← the line drawings (SVG paths + draw timing)
├── main.js       ← page, reveal-on-scroll, countdown, music
├── calendar.js   ← .ics file + Google Calendar link
└── style.css     ← palette, type, animation
public/
├── og-image.jpg  ← WhatsApp / social preview (1200×630)
└── favicon.svg
```

**Palette** (tokens at the top of `style.css`): ivory `#FBF6EC`, ink
`#3A2622`, maroon `#7E1F2B`, gold `#B8862B`, turmeric `#E3A72F`.
**Type**: Cormorant Garamond (names), EB Garamond (text), Gurajada (Telugu).

## How the drawing works

Each illustration in `art.js` is a list of strokes. Every `<path>` has
`pathLength="1"`, so CSS can animate `stroke-dashoffset` from 1 to 0 with no
measuring in JavaScript. Each stroke's duration follows its length, and the
next begins before the last finishes, so it moves like a pen. Colour washes
and the ink-filled hair fade in afterwards, a little off-register, like
watercolour laid over a drawing. No animation library is used; the whole page
is about 9 KB of JavaScript and 4 KB of CSS gzipped.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
One-time setup: **Settings → Pages → Source: GitHub Actions**. The site will be
at `https://cntarun.github.io/WeddCard/`; if you use another address, update
`siteUrl` in `config.js` so link previews find the image.
