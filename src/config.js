// Template settings read from the template URL query string.
//
//   orientation  landscape (default) | portrait
//   rotate       degrees to rotate the stage. Defaults to 90 in portrait so a
//                9:16 layout fills a 16:9 recording (rotate the final video back
//                for Instagram). Use rotate=0 if the recording itself is portrait.
//   category     header + footer category text, e.g. "SOLO CATEGORY"
//   centerText   text shown in the bar between the battler names
//   footer       footer items separated by "|"
//   live         "false" hides the LIVE badge
//   demo         "true" renders the layout with sample names, no meeting needed

const params = new URLSearchParams(window.location.search);

const get = (key, fallback) => {
  const value = params.get(key);
  return value === null || value === "" ? fallback : value;
};

const orientation =
  get("orientation", "landscape").toLowerCase() === "portrait"
    ? "portrait"
    : "landscape";

const parseRotation = (value) => {
  const degrees = parseInt(value, 10);
  return Number.isFinite(degrees) && degrees % 90 === 0 ? degrees : 0;
};

const category = get("category", "SOLO CATEGORY");

export const templateConfig = {
  orientation,
  rotate: parseRotation(get("rotate", orientation === "portrait" ? "90" : "0")),
  category,
  centerText: get("centerText", ""),
  live: get("live", "true") !== "false",
  footer: get(
    "footer",
    `BEATLANDBATTLE.COM|20 SEPTEMBER 2026|ONLINE|${category}|BLOC 42 · NUANU CITY · BALI · INDONESIA`
  )
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean),
  demo: get("demo", "false") === "true",
};
