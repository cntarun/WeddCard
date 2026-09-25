import { defineConfig } from "vite";
import { config } from "./src/config.js";
import { buildIcs, buildGoogleRedirectPage } from "./src/calendar.js";

const escAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Fills the page title / description from config.js and serves the calendar
// file (wedding.ics) and the Google Calendar hand-off page, so all three
// always match the config.
function invitation() {
  return {
    name: "invitation",
    transformIndexHtml: (html) =>
      html
        .replaceAll("%TITLE%", escAttr(config.title))
        .replaceAll("%DESCRIPTION%", escAttr(config.description))
        .replaceAll("%SITE_URL%", escAttr(config.siteUrl)),
    configureServer(server) {
      server.middlewares.use("/wedding.ics", (_req, res) => {
        res.setHeader("Content-Type", "text/calendar; charset=utf-8");
        res.end(buildIcs(config));
      });
      server.middlewares.use("/add-to-google.html", (_req, res) => {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(buildGoogleRedirectPage(config));
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "wedding.ics", source: buildIcs(config) });
      this.emitFile({ type: "asset", fileName: "add-to-google.html", source: buildGoogleRedirectPage(config) });
    },
  };
}

// Relative base so the build works on GitHub Pages (/WeddCard/) or any domain.
export default defineConfig({
  base: "./",
  plugins: [invitation()],
});
