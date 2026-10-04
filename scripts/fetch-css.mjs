import fs from "node:fs";
import path from "node:path";

const HTML = path.resolve("scrape/html");
const CSS = path.resolve("scrape/css");
fs.mkdirSync(CSS, { recursive: true });

async function get(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0 Safari/537.36" },
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.text();
}

const ids = {};
for (const f of fs.readdirSync(HTML).filter((x) => x.endsWith(".html"))) {
  const slug = f.replace(/\.html$/, "");
  const html = fs.readFileSync(path.join(HTML, f), "utf8");
  const m = html.match(/page-id-(\d+)/);
  ids[slug] = m ? m[1] : null;
  // kit id
  const k = html.match(/elementor-kit-(\d+)/);
  if (k && !ids["__kit"]) ids["__kit"] = k[1];
}
console.log(ids);

const jobs = Object.entries(ids).filter(([, v]) => v);
for (const [slug, id] of jobs) {
  const url = `https://maryjoyethiopia.org/wp-content/uploads/elementor/css/post-${id}.css`;
  const dest = path.join(CSS, `${slug}.css`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 100) continue;
  try {
    const css = await get(url);
    fs.writeFileSync(dest, css, "utf8");
    console.log("css ok", slug, id, css.length);
  } catch (e) {
    console.log("CSS FAIL", slug, id, e.message);
  }
}
