import fs from "node:fs";
import path from "node:path";

const ORIGIN = "https://maryjoyethiopia.org";
const OUT = path.resolve("scrape");

const PAGES = [
  ["home", "/"],
  ["about-us", "/about-us/"],
  ["what-we-do", "/what-we-do/"],
  ["programs", "/programs/"],
  ["projects", "/projects/"],
  ["e-resource", "/e-resource/"],
  ["sponsor-child", "/sponsor-child/"],
  ["cash-donation", "/cash-donation/"],
  ["in-kind-donation", "/in-kind-donation/"],
  ["feeding", "/feeding/"],
  ["membership", "/membership/"],
  ["event", "/event/"],
  ["event-arbaminch-charity-run2025", "/event/arbaminch-charity-run2025/"],
  ["volunteer", "/volunteer/"],
  ["vacancy", "/vacancy/"],
  ["news", "/news/"],
  ["contact", "/contact/"],
  ["gallery", "/gallery/"],
  ["thank-you", "/thank-you/"],
  ["order", "/order/"],
];

async function get(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,*/*",
        },
        signal: AbortSignal.timeout(60000),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.text();
    } catch (e) {
      if (i === tries - 1) throw e;
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
}

async function getBin(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0 Safari/537.36" },
    signal: AbortSignal.timeout(120000),
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return Buffer.from(await res.arrayBuffer());
}

fs.mkdirSync(path.join(OUT, "html"), { recursive: true });

// ---- 1. HTML ----
for (const [slug, route] of PAGES) {
  const dest = path.join(OUT, "html", slug + ".html");
  if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
    console.log("skip html", slug);
    continue;
  }
  try {
    const html = await get(ORIGIN + route);
    fs.writeFileSync(dest, html, "utf8");
    console.log("html ok", slug, html.length);
  } catch (e) {
    console.log("HTML FAIL", slug, e.message);
  }
}

// ---- 2. Assets ----
const allHtml = fs
  .readdirSync(path.join(OUT, "html"))
  .map((f) => fs.readFileSync(path.join(OUT, "html", f), "utf8"))
  .join("\n");

const assets = new Set();
for (const m of allHtml.matchAll(/https:\/\/maryjoyethiopia\.org\/wp-content\/uploads\/[^\s"'\\)<>]+/g)) {
  let u = m[0].replace(/&amp;/g, "&").replace(/[.,;:'"]+$/, "");
  if (/\.(jpe?g|png|gif|webp|svg|pdf|ico)$/i.test(u)) assets.add(u);
}
// gravatar + placeholder fallbacks are not needed for a static clone
const list = [...assets].sort();
console.log("assets found:", list.length);

const manifest = {};
for (const url of list) {
  const rel = new URL(url).pathname.replace(/^\/wp-content\/uploads\//, "");
  const dest = path.join(OUT, "assets", rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    manifest[url] = "/uploads/" + rel;
    continue;
  }
  try {
    const buf = await getBin(url);
    fs.writeFileSync(dest, buf);
    manifest[url] = "/uploads/" + rel;
    console.log("asset ok", rel, buf.length);
  } catch (e) {
    console.log("ASSET FAIL", rel, e.message);
  }
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("manifest entries:", Object.keys(manifest).length);
