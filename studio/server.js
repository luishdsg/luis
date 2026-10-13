#!/usr/bin/env node
/* =========================================================
   studio — servidor estático de desenvolvimento
   Uso: node studio/server.js [porta]
   O roteador usa fetch + History API, então o site precisa
   ser servido por HTTP (abrir via file:// desativa as
   transições e cai na navegação normal do navegador).
   ========================================================= */

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = Number(process.argv[2] || process.env.PORT || 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  let file = path.join(ROOT, path.normalize(clean).replace(/^(\.\.[/\\])+/, ""));

  // impede escapar da raiz do site
  if (!file.startsWith(ROOT)) return null;

  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, "index.html");
  }
  if (!fs.existsSync(file) && !path.extname(file)) {
    const asDir = path.join(file, "index.html");
    if (fs.existsSync(asDir)) file = asDir;
  }
  return fs.existsSync(file) && fs.statSync(file).isFile() ? file : null;
}

const server = http.createServer((req, res) => {
  const file = resolve(req.url);

  if (!file) {
    const fallback = path.join(ROOT, "404.html");
    const body = fs.existsSync(fallback)
      ? fs.readFileSync(fallback)
      : "404 não encontrado";
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    res.end(body);
    return;
  }

  res.writeHead(200, {
    "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`studio em http://localhost:${PORT}`);
});
