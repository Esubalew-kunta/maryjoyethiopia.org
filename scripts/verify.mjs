import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const pages = [
  "index",
  "about-us/index",
  "what-we-do/index",
  "programs/index",
  "projects/index",
  "e-resource/index",
  "sponsor-child/index",
  "cash-donation/index",
  "in-kind-donation/index",
  "feeding/index",
  "membership/index",
  "event/index",
  "event/arbaminch-charity-run2025/index",
  "volunteer/index",
  "vacancy/index",
  "news/index",
  "contact/index",
  "gallery/index",
  "thank-you/index",
  "order/index",
];

let problems = 0;
let checkedAssets = new Set();

for (const p of pages) {
  const file = path.join(OUT, p + ".html");
  if (!fs.existsSync(file)) {
    console.log("MISSING PAGE", p);
    problems++;
    continue;
  }
  const html = fs.readFileSync(file, "utf8");

  const h1 = (html.match(/<h1[^>]*>/g) || []).length;
  const h2 = (html.match(/<h2[^>]*>/g) || []).length;
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  const desc = /name="description"/.test(html);

  // resolve every local asset reference
  const refs = new Set();
  for (const m of html.matchAll(/(?:src|href)="(\/[^"]+)"/g)) refs.add(m[1]);
  const broken = [];
  for (const r of refs) {
    if (r.startsWith("/_next/")) continue;
    if (r === "/") continue;
    checkedAssets.add(r);
    const clean = r.split("#")[0].split("?")[0];
    if (/\.(jpe?g|png|gif|webp|svg|ico|pdf)$/i.test(clean)) {
      if (!fs.existsSync(path.join(OUT, clean))) broken.push(clean);
    }
  }

  const remote = (html.match(/https:\/\/(?!www\.google|fonts\.g|docs\.google|www\.facebook|www\.instagram|maryjoyethiopia\.org)/g) || []).length;

  console.log(
    `${p.padEnd(42)} h1=${h1} h2=${String(h2).padStart(2)} desc=${desc ? "y" : "N"} broken=${broken.length} | ${title.slice(0, 40)}`
  );
  if (broken.length) {
    broken.forEach((b) => console.log("     BROKEN: " + b));
    problems += broken.length;
  }
  if (h1 === 0) {
    console.log("     !! no <h1>");
    problems++;
  }
}

console.log("\ntotal local asset refs checked:", checkedAssets.size);
console.log(problems === 0 ? "RESULT: all pages OK" : `RESULT: ${problems} problem(s)`);