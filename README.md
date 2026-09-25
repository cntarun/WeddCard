# Tarun & Priyamvada — Wedding Invitation

A single-page wedding invitation built from **Bapu's wedding paintings**: white
paper, a mango-leaf thoranam, the ornate red-and-yellow arch, banana plants,
blue kolam motifs and the painted border band. Each painting was cut into
layers so every piece can move on its own.

- **Opening** — the thoranam is hung from the centre outwards, the arch
  unfurls, the banana plants grow; Ganesha is sketched in ink, coloured in,
  and dances, with the dhol keeping the beat and the offerings beside him.
- **Hero** — on *Open the invitation*, Ganesha rises away and the couple
  exchanging garlands is sketched and painted into the same frame, then
  showered with akshintalu (turmeric rice and petals).
- **Invitation** — the card's wording, with the blue kolam motifs blooming
  around "with".
- **The Wedding** — beneath the jeelakarra-bellam painting: Sunday ·
  13 December 2026 · 4:00 PM onwards, **Muhurtham 7:25 PM, dinner follows**,
  venue and map link.
- **Countdown** — beneath the mangalya-dharana painting, on the band's red,
  digits rolling as they change.
- **Add to calendar** (Apple / Outlook `.ics` + Google Calendar).
- **Closing** — saptapadi around a glowing, flickering sacred fire, banana
  plants either side, and the credit *Paintings by Bapu*.
- **Music toggle** — appears automatically once a song is set (see below).

Everything honours *Reduce Motion*: those guests see the finished paintings.

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
├── main.js       ← page, reveal-on-scroll, countdown, music
├── calendar.js   ← .ics file + Google Calendar link
└── style.css     ← palette, type, animation
public/
├── art/          ← the painting layers (colour + ink), thoranam and band tiles
├── og-image.jpg  ← WhatsApp / social preview (1200×630)
└── favicon.svg
```

**Palette** (sampled from the paintings; tokens at the top of `style.css`):
vermilion `#E23823`, turmeric-lemon `#FEFC55`, leaf green `#2F7A3A`,
kolam blue `#3F4AAE`, banana-flower pink `#E0457B`, on white.
**Type**: Rozha One (names), EB Garamond (text), Gurajada (Telugu).

## How the paintings move

Each painting was cut into transparent layers (arch, banana plants, motifs,
figures) that share one coordinate grid — the 1276-pixel frame of the
originals — so they reassemble exactly; on phones the figures are enlarged
and the banana plants tucked to the edges. Every figure has two layers: its
black ink linework and its full colour. A CSS mask sweeps the ink in like a
pen, then a second mask lets the colour spread outwards like wet paint. The
thoranam is a seamless tile repeated across the screen, each piece swaying
from the top; the border band is a seamless tile too. No animation library
is used (about 6 KB of JavaScript and 5 KB of CSS gzipped); the painting
layers total about 700 KB and load progressively.

The paintings are Bapu's and are credited on the page.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
One-time setup: **Settings → Pages → Source: GitHub Actions**. The site will be
at `https://cntarun.github.io/WeddCard/`; if you use another address, update
`siteUrl` in `config.js` so link previews find the image.
