import fs from "node:fs";
import path from "node:path";

const MANIFEST = path.resolve("scrape/manifest.json");
const OUT = path.resolve("scrape/assets");
const LIST = path.resolve("scrape/missing.txt");

async function getBin(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0 Safari/537.36" },
        signal: AbortSignal.timeout(600000),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (i === 2) throw e;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

const urls = fs
  .readFileSync(LIST, "utf8")
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter(Boolean);

let added = 0;
for (const url of urls) {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  if (manifest[url]) {
    console.log("have", url);
    continue;
  }
  const rel = new URL(url).pathname.replace(/^\/wp-content\/uploads\//, "");
  const dest = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    const buf = await getBin(url);
    fs.writeFileSync(dest, buf);
    manifest[url] = "/uploads/" + rel;
    fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
    added++;
    console.log("ok", rel, buf.length);
  } catch (e) {
    console.log("FAIL", rel, e.message);
  }
}
console.log("DONE added", added);
