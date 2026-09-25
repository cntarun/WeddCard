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
      `${wedding.dateLong}\n${wedding.startsAt} · Muhurtham ${wedding.muhurtham}\n` +
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

// Google's "eventedit" form opens a pre-filled event in any browser. (The
// older render?action=TEMPLATE link is often handed to the Calendar app on
// phones, which opens without the event.) The dates keep a literal "/".
export function googleCalendarUrl(config) {
  const e = eventDetails(config);
  const q = (s) => encodeURIComponent(s);
  return (
    "https://calendar.google.com/calendar/r/eventedit" +
    `?text=${q(e.title)}` +
    `&dates=${e.start}/${e.end}` +
    `&ctz=Asia/Kolkata` +
    `&details=${q(e.description)}` +
    `&location=${q(e.location)}`
  );
}
