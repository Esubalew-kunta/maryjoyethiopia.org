import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve("content");
const manifest = JSON.parse(fs.readFileSync(path.resolve("scrape/manifest.json"), "utf8"));
const OUT = path.resolve("src/data");

const missing = new Set();

function localize(node) {
  if (Array.isArray(node)) return node.forEach(localize);
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === "string") {
        if (/^https:\/\//.test(v) && /\.(jpe?g|png|gif|webp|svg|ico|pdf)(\?|$)/i.test(v)) {
          if (manifest[v]) node[k] = manifest[v];
          else {
            // Asset missing upstream (404 on the live server) — render without it
            // rather than shipping a broken image.
            missing.add(v);
            node[k] = "";
          }
        } else {
          // rewrite internal site links to local routes
          node[k] = v
            .replace(/https?:\/\/maryjoyethiopia\.org\//g, "/")
            .replace(/https?:\/\/www\.maryjoyethiopia\.org\//g, "/");
        }
      } else {
        localize(v);
      }
    }
  }
}

fs.mkdirSync(OUT, { recursive: true });

const order = [
  "home",
  "about-us",
  "what-we-do",
  "programs",
  "projects",
  "e-resource",
  "sponsor-child",
  "cash-donation",
  "in-kind-donation",
  "feeding",
  "membership",
  "event",
  "event-arbaminch-charity-run2025",
  "volunteer",
  "vacancy",
  "news",
  "contact",
  "gallery",
  "thank-you",
  "order",
];

const pages = [];
for (const slug of order) {
  const p = path.join(SRC, slug + ".json");
  if (!fs.existsSync(p)) throw new Error("missing content file: " + slug);
  const json = JSON.parse(fs.readFileSync(p, "utf8"));
  localize(json);
  pages.push(json);
}

fs.writeFileSync(path.join(OUT, "content.json"), JSON.stringify(pages, null, 2), "utf8");
console.log("wrote", pages.length, "pages");
if (missing.size) {
  console.log("\nASSETS NOT DOWNLOADED (" + missing.size + "):");
  for (const m of missing) console.log("  " + m);
} else {
  console.log("all images localized");
}
