/* =========================================================
   studio — runtime
   Roteador com transição, stage de hover, cursor, tema,
   preloader, revelação por rolagem e paralaxe.
   Sem dependências externas.
   ========================================================= */
(() => {
  "use strict";

  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------------------------------------------------------
     1. Tema (claro/escuro) — persistido
     --------------------------------------------------------- */
  const theme = {
    key: "studio:theme",

    init() {
      const saved = this.read();
      if (saved) root.dataset.theme = saved;
      document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-theme-toggle]");
        if (btn) this.toggle();
      });
      this.sync();
    },

    read() {
      try {
        return localStorage.getItem(this.key);
      } catch {
        return null;
      }
    },

    current() {
      if (root.dataset.theme) return root.dataset.theme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    },

    toggle() {
      const next = this.current() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem(this.key, next);
      } catch {
        /* storage bloqueado: tema vale só nesta sessão */
      }
      this.sync();
    },

    sync() {
      const dark = this.current() === "dark";
      document.querySelectorAll("[data-theme-toggle]").forEach((b) => {
        b.setAttribute("aria-pressed", String(dark));
        const label = b.querySelector("[data-theme-label]");
        if (label) label.textContent = dark ? "escuro" : "claro";
      });
    },
  };

  /* ---------------------------------------------------------
     2. Cursor customizado
     --------------------------------------------------------- */
  const cursor = {
    dot: null,
    ring: null,
    x: 0,
    y: 0,
    rx: 0,
    ry: 0,
    on: false,

    init() {
      if (!fine.matches || reduced.matches) return;
      this.dot = document.querySelector(".cursor-dot");
      this.ring = document.querySelector(".cursor-ring");
      if (!this.dot || !this.ring) return;

      this.on = true;
      root.classList.add("has-cursor");

      window.addEventListener(
        "pointermove",
        (e) => {
          this.x = e.clientX;
          this.y = e.clientY;
        },
        { passive: true }
      );

      document.addEventListener("pointerover", (e) => {
        const hit = e.target.closest("a, button, [data-cursor]");
        root.classList.toggle("is-hovering", Boolean(hit));
      });

      this.frame();
    },

    frame() {
      if (!this.on) return;
      this.rx = lerp(this.rx, this.x, 0.16);
      this.ry = lerp(this.ry, this.y, 0.16);
      this.dot.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
      this.ring.style.transform = `translate3d(${this.rx}px, ${this.ry}px, 0)`;
      requestAnimationFrame(() => this.frame());
    },
  };

  /* ---------------------------------------------------------
     3. Menu mobile
     --------------------------------------------------------- */
  const menu = {
    init() {
      document.addEventListener("click", (e) => {
        if (e.target.closest("[data-menu-toggle]")) {
          this.toggle();
          return;
        }
        if (e.target.closest(".sheet a")) this.close();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.close();
      });
    },

    toggle() {
      root.classList.toggle("is-menu");
      root.classList.toggle("is-locked", root.classList.contains("is-menu"));
      const btn = document.querySelector("[data-menu-toggle]");
      if (btn)
        btn.setAttribute(
          "aria-expanded",
          String(root.classList.contains("is-menu"))
        );
    },

    close() {
      root.classList.remove("is-menu", "is-locked");
      const btn = document.querySelector("[data-menu-toggle]");
      if (btn) btn.setAttribute("aria-expanded", "false");
    },
  };

  /* ---------------------------------------------------------
     4. Revelação por rolagem
     --------------------------------------------------------- */
  function reveals(scope) {
    const items = scope.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (reduced.matches || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    items.forEach((el, i) => {
      el.style.setProperty("--d", `${Math.min(i * 60, 360)}ms`);
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------
     5. Paralaxe leve nas imagens de case
     --------------------------------------------------------- */
  function parallax(scope) {
    const items = [...scope.querySelectorAll("[data-parallax] img")];
    if (!items.length || reduced.matches) return () => {};

    let raf = 0;
    const apply = () => {
      const vh = window.innerHeight;
      items.forEach((img) => {
        const box = img.parentElement.getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh + 200) return;
        const progress = (box.top + box.height / 2 - vh / 2) / vh;
        img.style.transform = `translate3d(0, ${(-progress * 6).toFixed(2)}%, 0) scale(1.12)`;
      });
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    items.forEach((img) => {
      img.style.transform = "scale(1.12)";
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    apply();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }

  /* ---------------------------------------------------------
     6. Stage da home — thumb que segue o ponteiro
     --------------------------------------------------------- */
  function workStage(scope) {
    const work = scope.querySelector(".work");
    if (!work) return () => {};

    const stage = work.querySelector(".stage");
    const inner = work.querySelector(".stage-inner");
    const links = [...work.querySelectorAll(".projects a")];
    if (!stage || !inner || !links.length) return () => {};

    // uma <img> por projeto, criada e pré-carregada uma vez
    const frames = links.map((link) => {
      const img = new Image();
      img.src = link.dataset.img;
      img.alt = "";
      img.decoding = "async";
      img.loading = "eager";
      inner.appendChild(img);
      return img;
    });

    let target = { x: innerWidth / 2, y: innerHeight / 2 };
    let pos = { ...target };
    let active = -1;
    let raf = 0;
    const idle = !fine.matches || reduced.matches;

    const show = (i) => {
      if (i === active) return;
      frames.forEach((f, n) => f.classList.toggle("is-active", n === i));
      active = i;
      work.classList.toggle("has-active", i > -1);
      // foco por teclado não gera pointermove: reposiciona o stage na hora
      if (!raf && !idle) raf = requestAnimationFrame(frame);
    };

    links.forEach((link, i) => {
      link.addEventListener("pointerenter", () => show(i));
      link.addEventListener("focus", () => show(i));
      link.addEventListener("pointerleave", () => show(-1));
      link.addEventListener("blur", () => show(-1));
    });

    work.addEventListener("pointerleave", () => show(-1));

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!raf && !idle) raf = requestAnimationFrame(frame);
    };

    function frame() {
      pos.x = lerp(pos.x, target.x, 0.12);
      pos.y = lerp(pos.y, target.y, 0.12);

      // inclinação proporcional à velocidade residual
      const tiltY = (target.x - pos.x) * 0.06;
      const tiltX = (pos.y - target.y) * 0.06;

      // só posição aqui; a escala de entrada é da transição das imagens (CSS)
      stage.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      inner.style.transform = `rotateY(${tiltY.toFixed(2)}deg) rotateX(${tiltX.toFixed(2)}deg)`;

      const settled =
        Math.abs(target.x - pos.x) < 0.2 && Math.abs(target.y - pos.y) < 0.2;
      raf = settled ? 0 : requestAnimationFrame(frame);
    }

    if (!idle) {
      work.addEventListener("pointermove", onMove, { passive: true });
      frame();
    }

    return () => {
      work.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }

  /* ---------------------------------------------------------
     7. Preloader
     --------------------------------------------------------- */
  function preloader() {
    const loader = document.querySelector(".loader");
    if (!loader) {
      root.classList.add("is-ready");
      return;
    }

    const fill = loader.querySelector(".loader-fill");
    const num = loader.querySelector(".loader-num");
    const imgs = [...document.images].filter((i) => !i.complete);
    const total = imgs.length;
    let done = 0;
    let shown = 0;

    const paint = (pct) => {
      shown = Math.max(shown, Math.round(pct));
      if (fill) fill.style.width = `${shown}%`;
      if (num) num.textContent = `${String(shown).padStart(3, "0")}%`;
    };

    const finish = () => {
      paint(100);
      setTimeout(() => {
        root.classList.add("is-ready");
        loader.setAttribute("aria-hidden", "true");
      }, 240);
    };

    if (!total) {
      // sem imagens pendentes: anima o contador rapidamente e libera
      let t = 0;
      const tick = setInterval(() => {
        t += 12;
        paint(Math.min(t, 100));
        if (t >= 100) {
          clearInterval(tick);
          finish();
        }
      }, 40);
      return;
    }

    const step = () => {
      done += 1;
      paint((done / total) * 100);
      if (done >= total) finish();
    };

    imgs.forEach((img) => {
      img.addEventListener("load", step, { once: true });
      img.addEventListener("error", step, { once: true });
    });

    // rede lenta não deve prender a página
    setTimeout(finish, 6000);
  }

  /* ---------------------------------------------------------
     8. Roteador — navegação com transição (History API)
     --------------------------------------------------------- */
  const router = {
    outlet: null,
    cache: new Map(),
    teardown: [],
    busy: false,

    init() {
      this.outlet = document.getElementById("router");
      if (!this.outlet || !("fetch" in window) || !history.pushState) return;

      document.addEventListener("click", (e) => this.onClick(e));
      document.addEventListener("pointerover", (e) => this.onHover(e));
      window.addEventListener("popstate", () => this.go(location.href, false));

      history.replaceState({ url: location.href }, "");
    },

    /** `/work/x/index.html`, `/work/x/` e `/work/x` são a mesma página. */
    norm(pathname) {
      return pathname.replace(/index\.html$/, "").replace(/\/+$/, "") || "/";
    },

    internal(a) {
      if (!a || a.hasAttribute("data-no-router")) return false;
      if (a.target && a.target !== "_self") return false;
      if (a.origin !== location.origin) return false;
      const href = a.getAttribute("href") || "";
      if (href.startsWith("#") || href.startsWith("mailto:")) return false;
      if (/\.(pdf|zip|png|jpe?g|svg|webp|mp4)$/i.test(a.pathname)) return false;
      return true;
    },

    onHover(e) {
      const a = e.target.closest("a");
      if (!this.internal(a)) return;
      this.prefetch(a.href);
    },

    onClick(e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
        return;
      const a = e.target.closest("a");
      if (!this.internal(a)) return;

      const url = new URL(a.href);
      if (
        this.norm(url.pathname) === this.norm(location.pathname) &&
        url.search === location.search
      ) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduced.matches ? "auto" : "smooth" });
        return;
      }

      e.preventDefault();
      menu.close();
      this.go(a.href, true);
    },

    async prefetch(url) {
      if (this.cache.has(url)) return this.cache.get(url);
      const p = fetch(url, { headers: { "X-Router": "1" } })
        .then((r) => (r.ok ? r.text() : Promise.reject(new Error(r.status))))
        .catch(() => {
          this.cache.delete(url);
          return null;
        });
      this.cache.set(url, p);
      return p;
    },

    async go(url, push) {
      if (this.busy) return;
      this.busy = true;

      const html = await this.prefetch(url);
      if (!html) {
        // falha de rede: navegação normal, sem engolir o clique
        location.href = url;
        return;
      }

      const doc = new DOMParser().parseFromString(html, "text/html");
      const next = doc.getElementById("router")?.firstElementChild;
      if (!next) {
        location.href = url;
        return;
      }

      const current = this.outlet.firstElementChild;
      const wipe = reduced.matches ? 0 : 450;

      root.classList.add("is-navigating");
      if (current) current.classList.add("is-out");

      await new Promise((r) => setTimeout(r, wipe));

      this.teardown.forEach((fn) => fn());
      this.teardown = [];

      this.outlet.replaceChildren(next);
      document.title = doc.title;
      this.syncHead(doc);
      root.dataset.namespace = next.dataset.namespace || "";
      next.classList.add("is-in");

      if (push) history.pushState({ url }, "", url);
      window.scrollTo(0, 0);

      this.mount(next);
      this.markActive();

      setTimeout(() => {
        root.classList.remove("is-navigating");
        next.classList.remove("is-in");
        this.busy = false;
      }, reduced.matches ? 10 : 500);

      // foco no início do conteúdo, para leitores de tela
      next.setAttribute("tabindex", "-1");
      next.focus({ preventScroll: true });
      next.removeAttribute("tabindex");
    },

    syncHead(doc) {
      const desc = doc.querySelector('meta[name="description"]')?.content;
      const here = document.querySelector('meta[name="description"]');
      if (desc && here) here.content = desc;
    },

    markActive() {
      const here = this.norm(location.pathname);
      document.querySelectorAll(".ui-nav a, .sheet a").forEach((a) => {
        if (a.origin !== location.origin) return;
        const same = this.norm(a.pathname) === here;
        if (same) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    },

    mount(scope) {
      reveals(scope);
      this.teardown.push(parallax(scope));
      this.teardown.push(workStage(scope));
    },
  };

  /* ---------------------------------------------------------
     boot
     --------------------------------------------------------- */
  function boot() {
    theme.init();
    cursor.init();
    menu.init();
    router.init();

    const page = document.querySelector("#router > .page") || document.body;
    router.mount(page);
    router.markActive();
    preloader();

    // ano no rodapé
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
