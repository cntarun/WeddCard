# Tarun & Priyamvada — Wedding Invitation

A single-page wedding invitation built from **Bapu's wedding paintings**, set
on warm ivory card stock with a faint block-print motif: a mango-leaf thoranam, the ornate red-and-yellow arch, banana plants,
blue kolam motifs and the painted border band. Each painting was cut into
layers so every piece can move on its own.

- **Opening** — "With the blessings of Lord Ganesha": the thoranam is hung from the centre outwards, the arch
  unfurls, the banana plants grow; Ganesha is sketched in ink, coloured in,
  and dances, with the dhol keeping the beat and the offerings beside him.
- **Hero** — on *Open the invitation*, Ganesha rises away and the couple
  exchanging garlands is sketched and painted into the same frame, then
  showered with akshintalu (turmeric rice and petals). A purely visual
  moment: no text, ending on the painted border band.
- **Invitation** — a small Ganesha beneath an arch, the blessing
  శ్రీరస్తు · శుభమస్తు · అవిఘ్నమస్తు spread beneath him (the centre word exactly
  under Ganesha), then the card's wording, with the blue kolam motifs
  blooming around "with".
- **The Wedding** — beneath the jeelakarra-bellam painting: Sunday ·
  13 December 2026, **Sumuhurtham 7:25 PM, dinner follows**, venue and map.
- **Rituals** — mangalya dharana beneath its arch, then saptapadi flowing
  straight on beneath it (no second arch) around a glowing, flickering
  sacred fire, in the ceremony's order.
- **Countdown** — to the Sumuhurtham, on the band's red, digits rolling as
  they change.
- **Add to calendar** — Apple / Outlook `.ics`, and Google Calendar. The
  Google button opens `add-to-google.html` on this site, which forwards to
  Google's pre-filled event form a moment later. Phones hand a direct tap on
  a calendar.google.com link to the Google Calendar app, which opens without
  the event; a forward by script stays in the browser.
- **Closing** — శుభమస్తు, banana plants either side, the band, and the credit
  *Paintings by Bapu*.
- **Music** — "Vachindamma" starts softly when the invitation is opened,
  with a play/pause button.

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
2. **Music** — to change the song, replace the MP3 in `public/audio/` and
   update `music.src` / `title` / `artist`.

The calendar entry starts at the Sumuhurtham, 7:25 PM, and runs to 11:00 PM
IST; change `wedding.endISO` if the evening ends at a different time.

## Where things live

```
src/
├── config.js     ← all content
├── main.js       ← page, reveal-on-scroll, countdown, music
├── fonts.css     ← @font-face for the self-hosted fonts
├── calendar.js   ← .ics file + Google Calendar hand-off page
└── style.css     ← palette, type, animation
public/
├── art/          ← the painting layers (colour + ink), thoranam and band tiles
├── fonts/        ← Fraunces, Jost, Noto Serif Telugu (woff2)
├── audio/        ← the song
├── og-image.jpg  ← WhatsApp / social preview (1200×630)
└── favicon.svg
```

**Palette** (sampled from the paintings; tokens at the top of `style.css`):
vermilion `#E23823`, turmeric-lemon `#FEFC55`, leaf green `#2F7A3A`,
kolam blue `#3F4AAE`, banana-flower pink `#E0457B`, on ivory `#FBF6EC`.

## Typography

Traditional meets modern, with type doing the bridging:

- **Fraunces** (SemiBold, with its italic for "&" and "with") — the couple's
  names and headings: warm and substantial, where the heritage lives.
- **Jost** (Light / Regular) — everything else: body text, tracked uppercase
  labels, buttons. Clean and editorial, the Paperless Post voice.
- **Noto Serif Telugu** (Medium) — every Telugu line, matched in weight and
  contrast to Fraunces, with a 1.5–1.6 line height.

Every size is one of four steps, set as tokens at the top of `style.css`:
`--fs-display` (names, the date, countdown), `--fs-heading` (section titles,
venue, Sumuhurtham time), `--fs-body`, `--fs-caption` (uppercase, tracked
`0.32em`). Telugu uses the heading step with an optical factor
(`--te-optical`). Use the classes `.display`, `.heading`, `.caption`, `.lead`,
`.joiner` and `.telugu` rather than setting font sizes directly.

The fonts are self-hosted from `public/fonts/` (Latin and Telugu subsets only,
164 KB, SIL Open Font License), so the Telugu never depends on a third party.

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
