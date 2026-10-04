import fs from "node:fs";
import path from "node:path";

const APP = path.resolve("src/app");

// [dir, slug] — slug null means src/app/<dir>/page.tsx is the root route
const ROUTES = [
  [null, "home"],
  ["about-us", "about-us"],
  ["what-we-do", "what-we-do"],
  ["programs", "programs"],
  ["projects", "projects"],
  ["e-resource", "e-resource"],
  ["sponsor-child", "sponsor-child"],
  ["cash-donation", "cash-donation"],
  ["in-kind-donation", "in-kind-donation"],
  ["feeding", "feeding"],
  ["membership", "membership"],
  ["event", "event"],
  ["event/arbaminch-charity-run2025", "event-arbaminch-charity-run2025"],
  ["volunteer", "volunteer"],
  ["vacancy", "vacancy"],
  ["news", "news"],
  ["contact", "contact"],
  ["gallery", "gallery"],
  ["thank-you", "thank-you"],
  ["order", "order"],
];

for (const [dir, slug] of ROUTES) {
  const target = dir ? path.join(APP, dir) : APP;
  fs.mkdirSync(target, { recursive: true });
  const file = path.join(target, "page.tsx");

  if (fs.existsSync(file)) {
    console.log("exists, skipping", file);
    continue;
  }

  const source = `import PageTemplate, { buildMetadata } from "@/components/PageTemplate";

export const metadata = buildMetadata("${slug}");

export default function Page() {
  return <PageTemplate slug="${slug}" />;
}
`;

  fs.writeFileSync(file, source, "utf8");
  console.log("wrote", file);
}

console.log("total routes:", ROUTES.length);
