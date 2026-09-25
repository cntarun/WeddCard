# Tarun & Priyamvada — Wedding Invitation

A single-page wedding invitation in the manner of **Bapu**, framed like the
printed card: a deep maroon ground scattered with gold, an ivory arched card
with a kalasham on top, and a marigold-and-mango-leaf thoranam across the top.
The illustrations are drawn in ink stroke by stroke, then filled with Bapu's
flat wedding colours — kumkum, turmeric, marigold, parrot green, rani pink
and gold.

- **Opening** — a diya is drawn in ink and its flame blooms; the Telugu
  blessing appears; guests tap *Open the invitation*.
- **Hero** — beneath a golden mandapam arch with a rising sunburst, the bride
  (pink saree, green blouse) showers talambralu over the groom (cream pancha,
  orange kanduva), both seated on turmeric peetalu — drawn, then coloured in.
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
├── art.js        ← the illustrations (SVG ink + colour, draw timing)
├── main.js       ← page, reveal-on-scroll, countdown, music
├── calendar.js   ← .ics file + Google Calendar link
└── style.css     ← palette, type, animation
public/
├── og-image.jpg  ← WhatsApp / social preview (1200×630)
└── favicon.svg
```

**Palette** (tokens at the top of `style.css`): maroon `#7A1C24`, ivory
`#FBF3E1`, ink `#3A2622`, kumkum `#B8262C`, gold `#C9973A`, turmeric
`#EAA82A`, marigold `#EA7A24`, rani pink `#D8568C`, parrot green `#3F8B42`.
**Type**: Cormorant Garamond (names), EB Garamond (text), Gurajada (Telugu).

## How the drawing works

Each illustration in `art.js` is a list of strokes. Every `<path>` has
`pathLength="1"`, so CSS can animate `stroke-dashoffset` from 1 to 0 with no
measuring in JavaScript. Each stroke's duration follows its length, and the
next begins before the last finishes, so it moves like a pen. The flat
colours are then laid in region by region beneath the ink, like a brush
filling the drawing. No animation library is used; the whole page is about
11 KB of JavaScript and 5 KB of CSS gzipped, with no images to download.

The illustrations are original drawings in Bapu's manner. Bapu's own
paintings are under copyright (until 2074), so they aren't used here; the
artwork from the printed card can be added if the original file and
permission to use it are available.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
One-time setup: **Settings → Pages → Source: GitHub Actions**. The site will be
at `https://cntarun.github.io/WeddCard/`; if you use another address, update
`siteUrl` in `config.js` so link previews find the image.
