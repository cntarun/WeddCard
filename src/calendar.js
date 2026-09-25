/* ============================================================
   CALENDAR — one .ics file (Apple / Outlook / most phones) and a
   Google Calendar link, both generated from config.js. The .ics
   is emitted as a static file at build time (see vite.config.js),
   which opens more reliably on iPhones than a script download.
   ============================================================ */

// "2026-12-13T16:00:00+05:30" → "20261213T103000Z"
const utcStamp = (iso) =>
  new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const escapeIcs = (s) => s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");

// RFC 5545: content lines longer than 75 octets are folded.
const fold = (line) => {
  const out = [];
  let rest = line;
  while (rest.length > 72) {
    out.push(rest.slice(0, 72));
    rest = " " + rest.slice(72);
  }
  out.push(rest);
  return out.join("\r\n");
};

export function eventDetails(config) {
  const { groom, bride, wedding, venue } = config;
  return {
    title: `Wedding of ${groom.name} & ${bride.name}`,
    location: `${venue.name}, ${venue.city}`,
    description:
      `${wedding.dateLong}\n${wedding.muhurthamLabel} ${wedding.muhurtham}\n` +
      `${wedding.afterMuhurtham}.\n\nMap: ${venue.mapUrl}`,
    start: utcStamp(wedding.startISO),
    end: utcStamp(wedding.endISO),
  };
}

export function buildIcs(config) {
  const e = eventDetails(config);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tarun and Priyamvada//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-${e.start}@tarun-priyamvada`,
    `DTSTAMP:${utcStamp(new Date().toISOString())}`,
    `DTSTART:${e.start}`,
    `DTEND:${e.end}`,
    `SUMMARY:${escapeIcs(e.title)}`,
    `LOCATION:${escapeIcs(e.location)}`,
    `DESCRIPTION:${escapeIcs(e.description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(e.title)} — tomorrow`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

// Google's own "Add to Google Calendar" link — a pre-filled event form.
// The dates keep a literal "/".
export function googleCalendarUrl(config) {
  const e = eventDetails(config);
  const q = (s) => encodeURIComponent(s);
  return (
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${q(e.title)}` +
    `&dates=${e.start}/${e.end}` +
    `&ctz=Asia/Kolkata` +
    `&details=${q(e.description)}` +
    `&location=${q(e.location)}`
  );
}

/* On phones, a tapped link to calendar.google.com is handed straight to the
   Google Calendar app, which opens without the event. So the button goes to
   this small page on our own site instead; it forwards to Google's form by
   script, a moment after loading. Phones don't hand script redirects to
   apps, so the pre-filled form opens in the browser. */
export function buildGoogleRedirectPage(config) {
  const url = googleCalendarUrl(config);
  const attr = url.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Adding to Google Calendar…</title>
<style>
  body { margin: 0; min-height: 100svh; display: grid; place-items: center; padding: 2rem;
         background: #fbf6ec; color: #3a2a22; text-align: center;
         font: 300 1.05rem/1.7 "Helvetica Neue", Arial, sans-serif; letter-spacing: .02em; }
  p { margin: 0 0 1.2rem; }
  a { color: #bf2417; }
  .small { font-size: .85rem; color: #6a5448; }
</style>
</head>
<body>
<main>
  <p>Opening Google Calendar with the wedding details…</p>
  <p class="small">Nothing happening? <a href="${attr}" rel="noopener">Continue to Google Calendar</a>,
  or <a href="wedding.ics">add it to your phone's calendar</a> instead.</p>
</main>
<script>
  setTimeout(function () { location.replace(${JSON.stringify(url)}); }, 600);
</script>
</body>
</html>
`;
}
