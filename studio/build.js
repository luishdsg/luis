#!/usr/bin/env node
/* =========================================================
   studio — gerador estático
   Lê data/content.js e escreve todas as páginas HTML.
   Uso: node studio/build.js
   ========================================================= */

const fs = require("fs");
const path = require("path");
const { site, projects, journal } = require("./data/content.js");

const OUT = __dirname;

/* ---------- helpers ---------- */
const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Caminho relativo da raiz do site para uma página em `depth` níveis. */
const up = (depth) => (depth === 0 ? "" : "../".repeat(depth));

const fmtDate = (iso) => {
  const months = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
  ];
  const [y, m, d] = iso.split("-");
  return `${d} ${months[Number(m) - 1]} ${y}`;
};

/** Resolve uma URL de asset: absoluta fica, relativa recebe prefixo. */
const asset = (src, depth) => (/^https?:\/\//.test(src) ? src : up(depth) + src);

function write(relPath, html) {
  const full = path.join(OUT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, "utf8");
  return relPath;
}

/* ---------- shell ---------- */
function shell({ title, description, namespace, depth, body }) {
  const r = up(depth);
  const nav = [
    { href: `${r}index.html`, label: "Trabalhos" },
    { href: `${r}about/index.html`, label: "Sobre" },
    { href: `${r}journal/index.html`, label: "Diário" },
  ];

  const navLinks = nav
    .map((n) => `<a href="${n.href}">${n.label}</a>`)
    .join("\n            ");

  const sheetLinks = nav
    .map((n) => `<a href="${n.href}">${n.label}</a>`)
    .join("\n      ");

  const social = site.social
    .map(
      (s) =>
        `<a href="${esc(s.url)}" data-no-router${
          s.url.startsWith("http") ? ' target="_blank" rel="noopener"' : ""
        }>${esc(s.label)}</a>`
    )
    .join("\n          ");

  return `<!DOCTYPE html>
<html lang="pt-BR" data-namespace="${namespace}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="color-scheme" content="light dark" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap"
    rel="stylesheet" />
  <link rel="stylesheet" href="${r}css/app.css" />
  <script>
    // evita flash de tema errado antes do app.js carregar
    try {
      var t = localStorage.getItem("studio:theme");
      if (t) document.documentElement.dataset.theme = t;
    } catch (e) {}
  </script>
</head>
<body>
  <a class="skip" href="#main">Pular para o conteúdo</a>

  <div class="loader" role="status" aria-live="polite">
    <div class="loader-num">000%</div>
    <div class="loader-track"><div class="loader-fill"></div></div>
    <span class="sr">Carregando</span>
  </div>

  <div class="grain" aria-hidden="true"></div>
  <div class="curtain" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>

  <div class="cursor" aria-hidden="true">
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>
  </div>

  <header class="ui">
    <a class="ui-logo" href="${r}index.html">
      <span class="dot" aria-hidden="true"></span>
      <span>${esc(site.name)}</span>
    </a>

    <nav class="ui-nav" aria-label="Principal">
      <span class="links">
        ${navLinks}
      </span>
      <button type="button" data-theme-toggle aria-pressed="false" aria-label="Alternar tema">
        <span class="track" aria-hidden="true"><span class="knob"></span></span>
      </button>
      <button class="burger" type="button" data-menu-toggle aria-expanded="false" aria-label="Abrir menu">
        <span></span><span></span>
      </button>
    </nav>

    <div class="ui-foot">
      <p class="mono">${esc(site.location)}</p>
      <div class="social mono">
          ${social}
      </div>
      <p class="mono credits">© <span data-year>${site.year}</span> — construído à mão</p>
    </div>
  </header>

  <nav class="sheet" aria-label="Menu">
      ${sheetLinks}
      <a href="mailto:${esc(site.email)}" data-no-router>Contato</a>
  </nav>

  <div id="router">
${body}
  </div>

  <script src="${r}js/app.js"></script>
</body>
</html>
`;
}

/* ---------- home ---------- */
function homePage() {
  const depth = 0;

  const rows = projects
    .map(
      (p, i) => `        <li>
          <a href="work/${p.slug}/index.html" data-img="${esc(asset(p.cover, depth))}">
            <span class="idx">${String(i + 1).padStart(2, "0")}</span>
            <span class="name">${esc(p.title)}</span>
            <span class="meta">
              <span>${esc(p.tags.join(" · "))}</span>
              <span>${esc(p.year)}</span>
            </span>
          </a>
        </li>`
    )
    .join("\n");

  const cards = projects
    .map(
      (p) => `        <a href="work/${p.slug}/index.html">
          <span class="frame"><img src="${esc(asset(p.cover, depth))}" alt="${esc(p.title)}" loading="lazy" /></span>
          <span class="name mono">${esc(p.title)} — ${esc(p.year)}</span>
        </a>`
    )
    .join("\n");

  const services = site.services
    .map((s) => `<li>${esc(s)}</li>`)
    .join("\n          ");

  const stats = site.stats
    .map(
      (s) => `        <div data-reveal>
          <p class="value">${esc(s.value)}</p>
          <p class="mono">${esc(s.label)}</p>
        </div>`
    )
    .join("\n");

  const body = `    <main class="page" id="main" data-namespace="home">
      <section class="hero">
        <p class="mono avail"><i aria-hidden="true"></i> Disponível para projetos — ${esc(site.location)}</p>
        <h1>${esc(site.tagline)} Construo interfaces que carregam rápido e continuam agradáveis de usar depois da primeira impressão.</h1>
        <ul class="services">
          ${services}
        </ul>
      </section>

      <section class="work">
        <div class="work-head">
          <h2 class="mono">Trabalhos selecionados</h2>
          <p class="mono">${projects.length} projetos</p>
        </div>

        <ul class="projects">
${rows}
        </ul>

        <div class="grid">
${cards}
        </div>

        <div class="stage" aria-hidden="true"><div class="stage-inner"></div></div>
      </section>

      <section class="stats">
${stats}
      </section>
    </main>`;

  return write(
    "index.html",
    shell({
      title: `${site.name} — ${site.role}`,
      description: site.tagline,
      namespace: "home",
      depth,
      body,
    })
  );
}

/* ---------- case study ---------- */
function workPage(p, i) {
  const depth = 2;
  const next = projects[(i + 1) % projects.length];

  const meta = [
    ["Cliente", p.client],
    ["Ano", p.year],
    ["Papel", p.role],
    ["Stack", p.stack.join(", ")],
  ]
    .map(
      ([dt, dd]) => `        <div><dt>${esc(dt)}</dt><dd>${esc(dd)}</dd></div>`
    )
    .join("\n");

  const sections = p.sections
    .map(
      (s) => `        <section data-reveal>
          <h2>${esc(s.heading)}</h2>
          <p>${esc(s.body)}</p>
        </section>`
    )
    .join("\n");

  const shots = (p.shots || [p.cover])
    .map(
      (src) => `      <figure class="shot" data-parallax data-reveal>
        <img src="${esc(asset(src, depth))}" alt="${esc(p.title)} — captura de tela" loading="lazy" />
      </figure>`
    )
    .join("\n");

  const liveCta = p.live
    ? `          <p style="margin-top:2rem"><a class="cta" href="${esc(p.live)}" data-no-router target="_blank" rel="noopener">Ver no ar <span aria-hidden="true">↗</span></a></p>`
    : "";

  const body = `    <main class="page" id="main" data-namespace="work">
      <a class="back" href="${up(depth)}index.html"><span aria-hidden="true">←</span> Todos os trabalhos</a>

      <header class="case-hero">
        <h1>${esc(p.title)}</h1>
        <p class="sub">${esc(p.subtitle)}</p>
      </header>

      <dl class="case-meta">
${meta}
      </dl>

${shots}

      <div class="case-body">
        <section data-reveal>
          <h2>Resumo</h2>
          <p>${esc(p.intro)}</p>
        </section>
${sections}
${liveCta}
      </div>

      <a class="next" href="${up(depth)}work/${next.slug}/index.html">
        <span class="mono">Próximo projeto</span>
        <span class="name">${esc(next.title)}</span>
      </a>
    </main>`;

  return write(
    `work/${p.slug}/index.html`,
    shell({
      title: `${p.title} — ${site.name}`,
      description: p.intro,
      namespace: "work",
      depth,
      body,
    })
  );
}

/* ---------- about ---------- */
function aboutPage() {
  const depth = 1;

  const rows = site.services
    .map(
      (s) =>
        `          <li><span>${esc(s)}</span><span class="mono">disponível</span></li>`
    )
    .join("\n");

  const stack = [...new Set(projects.flatMap((p) => p.stack))]
    .sort()
    .map((s) => `          <li><span>${esc(s)}</span></li>`)
    .join("\n");

  const body = `    <main class="page" id="main" data-namespace="about">
      <h1 class="page-title">Sobre</h1>

      <div class="about-grid">
        <div data-reveal>
          <p>Sou ${esc(site.name)}, ${esc(site.role.toLowerCase())}. Trabalho na fatia entre design e engenharia: pego a intenção visual de uma interface e a transformo em algo que roda bem em navegador real, em máquina real.</p>
          <p style="margin-top:1.2rem">Prefiro código que se explica a documentação que compensa código obscuro, e movimento que orienta a leitura a movimento que apenas chama atenção. Todo projeto aqui respeita <code>prefers-reduced-motion</code> e funciona com teclado.</p>
          <p style="margin-top:1.2rem"><a class="cta" href="mailto:${esc(site.email)}" data-no-router>${esc(site.email)}</a></p>
        </div>

        <div data-reveal>
          <h2 class="mono" style="margin-bottom:.8rem">Serviços</h2>
          <ul class="rows">
${rows}
          </ul>

          <h2 class="mono" style="margin:2rem 0 .8rem">Stack</h2>
          <ul class="rows">
${stack}
          </ul>
        </div>
      </div>
    </main>`;

  return write(
    "about/index.html",
    shell({
      title: `Sobre — ${site.name}`,
      description: `Quem é ${site.name}: serviços, stack e forma de trabalho.`,
      namespace: "about",
      depth,
      body,
    })
  );
}

/* ---------- journal ---------- */
function journalPage() {
  const depth = 1;

  const items = journal
    .map(
      (e) => `        <li data-reveal>
          <a href="${up(depth)}journal/index.html#${esc(e.slug)}" id="${esc(e.slug)}">
            <span class="mono">${esc(fmtDate(e.date))}</span>
            <span>
              <h2>${esc(e.title)}</h2>
              <p>${esc(e.excerpt)}</p>
            </span>
          </a>
        </li>`
    )
    .join("\n");

  const body = `    <main class="page" id="main" data-namespace="journal">
      <h1 class="page-title">Diário</h1>
      <ul class="entries">
${items}
      </ul>
    </main>`;

  return write(
    "journal/index.html",
    shell({
      title: `Diário — ${site.name}`,
      description: "Notas curtas sobre front-end, movimento e performance.",
      namespace: "journal",
      depth,
      body,
    })
  );
}

/* ---------- 404 ---------- */
function notFoundPage() {
  const body = `    <main class="page" id="main" data-namespace="error">
      <h1 class="page-title">404</h1>
      <p style="max-width:40ch">Esta página não existe — ou existiu e mudou de endereço.</p>
      <p style="margin-top:2rem"><a class="cta" href="index.html">Voltar ao início</a></p>
    </main>`;

  return write(
    "404.html",
    shell({
      title: `Página não encontrada — ${site.name}`,
      description: "Página não encontrada.",
      namespace: "error",
      depth: 0,
      body,
    })
  );
}

/* ---------- run ---------- */
const written = [
  homePage(),
  aboutPage(),
  journalPage(),
  notFoundPage(),
  ...projects.map(workPage),
];

console.log(`studio: ${written.length} páginas geradas`);
written.forEach((f) => console.log("  ·", f.replace(/\\/g, "/")));
