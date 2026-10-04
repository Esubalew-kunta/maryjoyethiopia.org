import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const HTML = path.resolve("scrape/html");
const OUT = path.resolve("scrape/content");

fs.mkdirSync(OUT, { recursive: true });

const dec = (s) =>
  (s || "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

function txt($el) {
  return dec($el.text().replace(/\s+/g, " "));
}

// Elements that are chrome, not content
const SKIP = [
  "script",
  "style",
  "noscript",
  "iframe",
  "form",
  "svg",
  "link",
  "button",
  "input",
  "select",
  "textarea",
  ".elementor-post__thumbnail",
];

function nodeOut($, el, depth) {
  const tag = el.tagName;
  const cls = (el.attribs?.class || "").replace(/elementor-element|elementor-widget/g, "").trim();
  const pad = "  ".repeat(depth);

  if (SKIP.includes(tag) || SKIP.some((s) => s.startsWith(".") && cls.split(/\s+/).includes(s.slice(1)))) return "";

  const lines = [];

  if (/^h[1-6]$/.test(tag)) {
    const t = txt($(el));
    if (t) lines.push(`${pad}[${tag.toUpperCase()}] ${t}`);
    return lines.join("\n");
  }

  if (tag === "img") {
    const src = el.attribs.src || "";
    if (src && !src.includes("gravatar") && !src.includes("placeholder.png")) {
      lines.push(`${pad}[IMG] src=${src}`);
      lines.push(`${pad}      alt=${el.attribs.alt || ""} ${el.attribs.width ? "w=" + el.attribs.width : ""} ${el.attribs.height ? "h=" + el.attribs.height : ""}`);
    }
    return lines.join("\n");
  }

  if (tag === "a") {
    const href = el.attribs.href || "";
    const t = txt($(el));
    if (t && t.length < 120 && !$(el).find("img").length) {
      lines.push(`${pad}[LINK] "${t}" -> ${href}`);
    }
  }

  if (tag === "li" || tag === "p" || tag === "span") {
    const direct = dec(
      $(el)
        .contents()
        .filter(function () {
          return this.type === "text";
        })
        .text()
    );
    if (direct && direct.length > 2 && !["li"].includes(tag)) {
      lines.push(`${pad}[${tag}] ${direct}`);
      return lines.join("\n");
    }
  }

  // recurse
  const kids = [];
  $(el).contents().each((_, c) => {
    if (c.type === "tag") kids.push(nodeOut($, c, depth + 1));
  });
  const inner = kids.filter(Boolean).join("\n");

  const isWidget = cls.includes("elementor-widget");
  const isContainer = cls.includes("elementor-element") || cls.includes("e-con");

  if ((isWidget || isContainer) && inner) {
    const kind = cls.replace(/elementor-widget-|elementor-element-/g, "").split(/\s+/).filter((x) => x && !x.startsWith("e-con")).slice(0, 2).join(".");
    lines.push(`${pad}<${kind || "box"}>`);
  }
  lines.push(inner);
  return lines.filter((l) => l !== undefined).join("\n");
}

for (const f of fs.readdirSync(HTML).filter((x) => x.endsWith(".html"))) {
  const slug = f.replace(/\.html$/, "");
  const html = fs.readFileSync(path.join(HTML, f), "utf8");
  const $ = cheerio.load(html);

  // locate the Elementor main wrapper for this page
  const $el = $(".elementor").first();
  if (!$el.length) {
    console.log("NO ELEMENTOR", slug);
    continue;
  }

  let out = "";
  out += `### PAGE: ${slug}\n`;
  out += `### TITLE: ${dec($("title").text())}\n`;
  const md = $('meta[name="description"]').attr("content");
  out += `### META: ${dec(md || "")}\n`;
  const ogImg = $('meta[property="og:image"]').attr("content");
  if (ogImg) out += `### OGIMG: ${ogImg}\n\n`;

  // top-level elementor children
  $el.children().each((_, c) => {
    if (c.type !== "tag") return;
    const id = $(c).attr("data-id") || "";
    const cls = ($(c).attr("class") || "").replace(/elementor-element/g, "").trim();
    out += `\n--- SECTION data-id=${id} class=${cls}\n`;
    const kids = [];
    $(c)
      .contents()
      .each((_, cc) => {
        if (cc.type === "tag") kids.push(nodeOut($, cc, 2));
      });
    out += kids.filter(Boolean).join("\n");
  });

  out += "\n\n";
  fs.writeFileSync(path.join(OUT, slug + ".txt"), out, "utf8");
  console.log("digest", slug, out.length);
}
