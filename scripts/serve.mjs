import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("out");
const PORT = Number(process.env.PORT || 4321);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400).end("Bad request");
    return;
  }

  let file = path.join(ROOT, urlPath);
  // prevent path traversal outside out/
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, "index.html");
  }

  if (!fs.existsSync(file) && !path.extname(file)) {
    // allow extensionless access to a route dir
    const alt = path.join(file, "index.html");
    if (fs.existsSync(alt)) file = alt;
  }

  if (!fs.existsSync(file)) {
    const notFound = path.join(ROOT, "404.html");
    res.writeHead(404, { "Content-Type": MIME[".html"] });
    res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : "Not found");
    return;
  }

  const type = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache" });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Serving static export at http://localhost:${PORT}`);
});