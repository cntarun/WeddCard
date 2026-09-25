/* ============================================================
   INVITATION CONTENT — edit everything here.
   Names, wording, times, venue and music all live in this file;
   the page, the countdown and the calendar file follow it.
   Items marked [TODO] are waiting on a decision.
   ============================================================ */

export const config = {
  // Browser-tab / link-preview title. [TODO] final title to be confirmed.
  title: "Tarun & Priyamvada · Wedding Invitation",
  description:
    "Tarun Chellaboyina & Priyamvada Mahesh · Sunday, 13 December 2026 · Grand Lawns, Jal Vihaar, Hyderabad",

  // Where the site will live — used for the WhatsApp / social preview image.
  // Leave as-is for GitHub Pages; change if you move to a custom domain.
  siteUrl: "https://cntarun.github.io/WeddCard/",

  blessing: "శ్రీరస్తు · శుభమస్తు · అవిఘ్నమస్తు",

  // "(Late)" is set in italics automatically, as on the printed card.
  hosts: [
    "Smt. Saradamba (Late) & Sri Ch. Siva Rao",
    "Smt. Hemalatha Rao & Wg Cdr S. Srinivasa Rao (Late)",
  ],
  inviteLine: "cordially invite you to the wedding of their grandson",

  groom: {
    name: "Tarun Chellaboyina",
    firstName: "Tarun",
    parents: "son of Dr. S. Kalyani & Dr. C. N. Chandra Sekhar",
  },
  bride: {
    name: "Priyamvada Mahesh",
    firstName: "Priyamvada",
    parents: "daughter of Smt. Geetha & Dr. Mahesh Krishnaswamy",
  },

  wedding: {
    dayName: "Sunday",
    month: "December",
    day: "13",
    year: "2026",
    dateLong: "Sunday, 13 December 2026",
    startsAt: "4:00 PM onwards",
    muhurtham: "7:25 PM",
    afterMuhurtham: "Dinner follows",
    // Times are India Standard Time (+05:30).
    startISO: "2026-12-13T16:00:00+05:30",
    muhurthamISO: "2026-12-13T19:25:00+05:30", // the countdown counts to this
    endISO: "2026-12-13T23:00:00+05:30",
  },

  venue: {
    name: "Grand Lawns, Jal Vihaar", // spelled as on the card — [TODO] confirm vs "Jalavihar"
    city: "Hyderabad",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Grand+Lawns+Jalavihar+Hyderabad",
  },

  // [TODO] song to be chosen. Drop an MP3 into /public/audio/ and set
  // src to e.g. "audio/our-song.mp3" — the music button appears on its own.
  music: {
    src: "",
    title: "",
    artist: "",
  },

  closing: {
    blessing: "శుభమస్తు",
    line: "Your presence and blessings would mean the world to us.",
  },
};
