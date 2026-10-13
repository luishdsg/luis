/* ============================================================
   NEURAL FIELD — rede neural interativa de tecnologias
   - 17 palavras espalhadas que vagam lentamente
   - fios religam-se sozinhos quando as palavras se cruzam
   - hover: a palavra expande e o fundo vira o wallpaper daquela tecnologia
     (gradiente da marca + logo oficial), em fade-in / fade-out
   - o mouse nao cria vapor, ele empurra o vapor que ja existe
   ============================================================ */
(function () {
    const field = document.getElementById("neuralField");
    const canvas = document.getElementById("neuralCanvas");
    if (!field || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* Cada palavra mostra o wallpaper da PROPRIA tecnologia: gradiente na cor
       da marca + o logo oficial, composto aqui no canvas (nada de link morto
       de site de wallpaper). Logos: devicon via jsDelivr, licenca MIT.
       A cor de cada palavra foi tirada do proprio SVG do logo. */
    const WORDS = [
        { label: "React", color: [97, 218, 251], icon: "react" },
        { label: "React Native", color: [88, 164, 232], icon: "react" },
        { label: "Angular", color: [228, 0, 53], icon: "angular" },
        { label: "TypeScript", color: [0, 122, 204], icon: "typescript" },
        { label: "JavaScript", color: [240, 219, 79], icon: "javascript" },
        { label: "Node.js", color: [63, 135, 63], icon: "nodejs" },
        { label: "NestJs", color: [223, 35, 79], icon: "nestjs" },
        { label: "Docker", color: [0, 170, 218], icon: "docker" },
        { label: "MongoDB", color: [67, 153, 52], icon: "mongodb" },
        { label: "MySql", color: [0, 97, 138], icon: "mysql" },
        { label: "Git", color: [243, 79, 41], icon: "git" },
        { label: "Html&Css", color: [228, 77, 38], icon: ["html5", "css3"] },
        { label: "Java", color: [234, 45, 46], icon: "java" },
        { label: "Golang", color: [106, 215, 229], icon: "go" },
        { label: "Supabase", color: [62, 207, 142], icon: "supabase" },
        { label: "Ionic", color: [78, 142, 247], icon: "ionic" },
        // o SVG do Railway e branco: repintado na cor da marca para aparecer
        { label: "Railway", color: [48, 48, 62], icon: "railway", invert: true }
    ];
    const VAPOR_SCALE = 0.22;
    const PUFF_COUNT = 24;
    const NEIGHBORS = 2;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vapor = document.createElement("canvas");
    const vctx = vapor.getContext("2d");

    const state = {
        w: 0,
        h: 0,
        dpr: 1,
        fontSize: 16,
        nodes: [],
        links: new Map(),
        puffs: [],
        pulses: [],
        pointer: { x: -9999, y: -9999, vx: 0, vy: 0, inside: false, stamp: 0 },
        drag: { id: -1, ox: 0, oy: 0, pointerId: null },
        hover: -1,
        time: 0,
        last: 0,
        frame: 0,
        pulseClock: 0,
        hoverStamp: 0,
        backdrop: 0,
        tabVisible: true,
        onScreen: true,
        ready: false
    };

    const rand = (min, max) => min + Math.random() * (max - min);
    const ease = (current, target, rate, dt) =>
        current + (target - current) * (1 - Math.exp(-rate * dt));

    function applyFont(scale) {
        ctx.font = `600 ${state.fontSize * (scale || 1)}px "DM Sans", system-ui, sans-serif`;
    }

    function roundRect(c, x, y, w, h, r) {
        const rr = Math.min(r, w * 0.5, h * 0.5);
        c.beginPath();
        c.moveTo(x + rr, y);
        c.lineTo(x + w - rr, y);
        c.quadraticCurveTo(x + w, y, x + w, y + rr);
        c.lineTo(x + w, y + h - rr);
        c.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
        c.lineTo(x + rr, y + h);
        c.quadraticCurveTo(x, y + h, x, y + h - rr);
        c.lineTo(x, y + rr);
        c.quadraticCurveTo(x, y, x + rr, y);
        c.closePath();
    }

    /* ---------- layout ---------------------------------------------------- */

    function gridShape(aspect, count) {
        const rows = aspect >= 2.1 ? 3 : aspect >= 1.15 ? 4 : 6;
        return { rows: rows, cols: Math.ceil(count / rows) };
    }

    function buildNodes() {
        const total = WORDS.length;
        const { cols } = gridShape(state.w / state.h, total);
        const rows = Math.ceil(total / cols);
        const padX = Math.max(60, state.w * 0.07);
        const padY = Math.max(34, state.h * 0.14);
        const cellW = (state.w - padX * 2) / cols;
        const cellH = (state.h - padY * 2) / rows;

        state.nodes = WORDS.map((word, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            // centraliza a ultima fileira quando ela fica incompleta
            const inRow = Math.min(cols, total - row * cols);
            const offset = (cols - inRow) * cellW * 0.5;
            return {
                label: word.label,
                color: word.color,
                icon: word.icon,
                invert: !!word.invert,
                logos: null,
                tile: null,
                logoKey: 0,
                x: padX + offset + cellW * (col + 0.5) + rand(-cellW * 0.22, cellW * 0.22),
                y: padY + cellH * (row + 0.5) + rand(-cellH * 0.22, cellH * 0.22),
                heading: rand(0, Math.PI * 2),
                turn: rand(0.18, 0.42) * (Math.random() < 0.5 ? -1 : 1),
                speed: rand(15, 31) * (calm ? 0.12 : 1),
                vx: 0,
                vy: 0,
                hover: 0,
                glow: 0,
                halfW: 0,
                halfH: 0
            };
        });

        measureNodes();
    }

    function measureNodes() {
        applyFont(1);
        const padH = state.fontSize * 0.95;
        const padV = state.fontSize * 0.72;
        for (const node of state.nodes) {
            node.halfW = ctx.measureText(node.label).width * 0.5 + padH;
            node.halfH = state.fontSize * 0.5 + padV;
        }
    }

    function buildPuffs() {
        state.puffs = [];
        const base = Math.min(state.h, state.w * 0.4);
        for (let i = 0; i < PUFF_COUNT; i++) {
            const warm = Math.random() < 0.38;
            state.puffs.push({
                x: rand(-0.1, 1.1) * state.w,
                y: rand(-0.15, 1.15) * state.h,
                r: base * rand(0.34, 0.86),
                alpha: rand(0.045, 0.115),
                color: warm ? [253, 198, 138] : [255, 253, 246],
                bvx: rand(3, 11) * (Math.random() < 0.22 ? -0.6 : 1) * (calm ? 0.3 : 1),
                bvy: rand(-3.5, 3.5) * (calm ? 0.3 : 1),
                pvx: 0,
                pvy: 0,
                phase: rand(0, Math.PI * 2),
                drift: rand(0.1, 0.3)
            });
        }
    }

    /* ---------- wallpaper da marca (montado sob demanda) ------------------ */

    const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";
    const TILE = 108;

    const rgba = (c, a) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
    const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

    // o SVG do devicon so tem viewBox; sem width/height o canvas rasteriza
    // em tamanho padrao e o logo sai borrado ao ampliar
    function logoPx() {
        const want = state.h * state.dpr * 0.9;
        return Math.max(256, Math.min(1024, Math.ceil(want / 128) * 128));
    }

    function loadLogo(name, px, tint) {
        return fetch(DEVICON + name + "/" + name + "-original.svg")
            .then((res) => (res.ok ? res.text() : Promise.reject(new Error(name))))
            .then((svg) => {
                if (tint) svg = svg.replace(/#(ffffff|fff)(?![0-9a-f])/gi, tint);
                if (!/<svg[^>]*\swidth=/i.test(svg)) {
                    svg = svg.replace("<svg", '<svg width="' + px + '" height="' + px + '"');
                }
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
                });
            });
    }

    // textura de wallpaper: o logo pequeno repetido, em alta resolucao
    function makeTile(imgs) {
        const d = state.dpr;
        const tile = document.createElement("canvas");
        tile.width = Math.round(TILE * imgs.length * d);
        tile.height = Math.round(TILE * d);
        const tctx = tile.getContext("2d");
        if (!tctx) return null;
        const size = TILE * d * 0.46;
        imgs.forEach((img, i) => {
            tctx.drawImage(img, (i + 0.5) * TILE * d - size / 2, TILE * d * 0.5 - size / 2, size, size);
        });
        try {
            return ctx.createPattern(tile, "repeat");
        } catch (err) {
            return null;
        }
    }

    function ensureLogo(node) {
        if (!node.icon) return;
        const px = logoPx();
        if (node.logoKey === px) return;
        node.logoKey = px;

        const names = Array.isArray(node.icon) ? node.icon : [node.icon];
        const tint = node.invert ? hex(node.color) : null;
        Promise.all(names.map((name) => loadLogo(name, px, tint)))
            .then((imgs) => {
                // so troca quando tudo decodificou: nunca pisca
                node.logos = imgs;
                node.tile = makeTile(imgs);
            })
            .catch(() => {
                node.logoKey = 0; // deixa tentar de novo no proximo hover
            });
    }

    // Converte coordenada de tela para coordenada do campo. getBoundingClientRect
    // devolve a caixa JA multiplicada pelo transform dos ancestrais, e o
    // .glass-stage-panel abre com scale(0.94) -> dividir pela escala real
    // mantem o ponteiro alinhado com o desenho durante a abertura do painel.
    function pointerToField(event) {
        const rect = field.getBoundingClientRect();
        const scaleX = rect.width ? field.clientWidth / rect.width : 1;
        const scaleY = rect.height ? field.clientHeight / rect.height : 1;

        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    }

    function resize() {
        // clientWidth/clientHeight em vez de getBoundingClientRect pelo mesmo
        // motivo: medido durante o scale(0.94) de abertura, o rect dava 94% do
        // tamanho real. O canvas era fixado nesse tamanho menor via style
        // inline e, com inset:0 (onde left vence right), encostava no canto
        // superior esquerdo do campo em vez de preencher e centralizar.
        const width = field.clientWidth;
        const height = field.clientHeight;
        if (!width || !height) return;

        const prev = { w: state.w, h: state.h, nodes: state.nodes };
        state.dpr = Math.min(window.devicePixelRatio || 1, 2);
        state.w = width;
        state.h = height;
        state.fontSize = Math.max(12, Math.min(19, state.w * 0.0132));

        // so o bitmap: o tamanho do elemento quem define e o CSS
        // (position:absolute + inset:0 + 100%), entao ele cobre o campo exato
        canvas.width = Math.round(state.w * state.dpr);
        canvas.height = Math.round(state.h * state.dpr);
        ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

        vapor.width = Math.max(1, Math.round(state.w * VAPOR_SCALE));
        vapor.height = Math.max(1, Math.round(state.h * VAPOR_SCALE));

        if (prev.nodes.length && prev.w > 0 && prev.h > 0) {
            // mantem as posicoes relativas no redimensionamento
            const sx = state.w / prev.w;
            const sy = state.h / prev.h;
            for (const node of prev.nodes) {
                node.x *= sx;
                node.y *= sy;
            }
            measureNodes();
            for (const puff of state.puffs) {
                puff.x *= sx;
                puff.y *= sy;
            }
        } else {
            buildNodes();
            buildPuffs();
        }

        state.ready = true;
    }

    /* ---------- movimento das palavras ------------------------------------ */

    function updateNodes(dt) {
        const nodes = state.nodes;
        const marginX = state.w * 0.045;
        const marginY = state.h * 0.08;

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            // palavra sendo arrastada: gruda no cursor e ignora o proprio
            // vagar, mas continua empurrando as vizinhas normalmente
            if (state.drag.id === i) {
                const tx = Math.max(node.halfW + marginX,
                    Math.min(state.w - node.halfW - marginX, state.pointer.x + state.drag.ox));
                const ty = Math.max(node.halfH + marginY,
                    Math.min(state.h - node.halfH - marginY, state.pointer.y + state.drag.oy));
                // guarda a velocidade real do arrasto: vira o impulso ao soltar
                node.vx = (tx - node.x) / Math.max(dt, 0.001);
                node.vy = (ty - node.y) / Math.max(dt, 0.001);
                node.x = tx;
                node.y = ty;
                node.hover = ease(node.hover, 1, 7, dt);
                node.glow = ease(node.glow, 1, 4.2, dt);
                continue;
            }

            // rumo em caminhada aleatoria suave
            node.heading += node.turn * dt;
            node.turn += rand(-0.55, 0.55) * dt;
            node.turn = Math.max(-0.6, Math.min(0.6, node.turn));

            const slow = 1 - node.hover * 0.82; // palavra sob o mouse quase para
            let ax = Math.cos(node.heading) * node.speed * slow;
            let ay = Math.sin(node.heading) * node.speed * slow * 0.62;

            // repulsao suave para os rotulos nao se sobreporem
            for (let j = 0; j < nodes.length; j++) {
                if (i === j) continue;
                const other = nodes[j];
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const minX = (node.halfW + other.halfW) * 0.98;
                const minY = (node.halfH + other.halfH) * 1.18;
                const nx = dx / minX;
                const ny = dy / minY;
                const d2 = nx * nx + ny * ny;
                if (d2 < 1 && d2 > 0.0001) {
                    const push = (1 - d2) * 52;
                    const len = Math.sqrt(d2);
                    ax += (nx / len) * push;
                    ay += (ny / len) * push;
                }
            }

            // contencao organica nas bordas
            const left = node.halfW + marginX;
            const right = state.w - node.halfW - marginX;
            const top = node.halfH + marginY;
            const bottom = state.h - node.halfH - marginY;
            if (node.x < left) ax += (left - node.x) * 1.6;
            if (node.x > right) ax -= (node.x - right) * 1.6;
            if (node.y < top) ay += (top - node.y) * 1.6;
            if (node.y > bottom) ay -= (node.y - bottom) * 1.6;

            node.vx = ease(node.vx, ax, 3.8, dt);
            node.vy = ease(node.vy, ay, 3.8, dt);
            node.x += node.vx * dt;
            node.y += node.vy * dt;

            const target = state.hover === i ? 1 : 0;
            node.hover = ease(node.hover, target, target ? 7 : 5.2, dt);
            node.glow = ease(node.glow, target, target ? 4.2 : 3, dt);
        }
    }

    /* ---------- fios que se trocam ---------------------------------------- */

    function linkKey(i, j) {
        return i < j ? i + ":" + j : j + ":" + i;
    }

    function updateLinks(dt) {
        const nodes = state.nodes;
        const maxDist = Math.max(state.w, state.h) * 0.52;
        const wanted = new Set();

        for (let i = 0; i < nodes.length; i++) {
            const near = [];
            for (let j = 0; j < nodes.length; j++) {
                if (i === j) continue;
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                near.push({ j: j, d: Math.sqrt(dx * dx + dy * dy) });
            }
            near.sort((a, b) => a.d - b.d);
            for (let k = 0; k < Math.min(NEIGHBORS, near.length); k++) {
                if (near[k].d <= maxDist) wanted.add(linkKey(i, near[k].j));
            }
        }

        // nasce o fio novo
        wanted.forEach((key) => {
            if (!state.links.has(key)) {
                const parts = key.split(":");
                state.links.set(key, {
                    a: +parts[0],
                    b: +parts[1],
                    s: 0,
                    phase: rand(0, Math.PI * 2),
                    sag: rand(0.06, 0.12)
                });
            }
        });

        // cresce ou desaparece
        state.links.forEach((link, key) => {
            const target = wanted.has(key) ? 1 : 0;
            link.s = ease(link.s, target, target ? 2.6 : 2.1, dt);
            if (!target && link.s < 0.004) state.links.delete(key);
        });
    }

    function linkCurve(link) {
        const a = state.nodes[link.a];
        const b = state.nodes[link.b];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const breathe = 1 + Math.sin(state.time * 0.55 + link.phase) * 0.3;
        const sag = dist * link.sag * breathe;
        return {
            a: a,
            b: b,
            dist: dist,
            cx: (a.x + b.x) * 0.5 - (dy / dist) * sag * 0.25,
            cy: (a.y + b.y) * 0.5 + sag
        };
    }

    function updatePulses(dt) {
        if (calm) return;
        state.pulseClock -= dt;
        if (state.pulseClock <= 0) {
            state.pulseClock = rand(0.35, 0.95);
            const live = [];
            state.links.forEach((link, key) => {
                if (link.s > 0.55) live.push(key);
            });
            if (live.length && state.pulses.length < 16) {
                state.pulses.push({
                    key: live[(Math.random() * live.length) | 0],
                    t: 0,
                    speed: rand(0.35, 0.75)
                });
            }
        }
        for (let i = state.pulses.length - 1; i >= 0; i--) {
            const pulse = state.pulses[i];
            pulse.t += pulse.speed * dt;
            if (pulse.t >= 1 || !state.links.has(pulse.key)) state.pulses.splice(i, 1);
        }
    }

    /* ---------- vapor do fundo -------------------------------------------- */

    function updateVapor(dt) {
        const p = state.pointer;
        const radius = Math.max(state.h * 0.6, state.w * 0.16);
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

        for (const puff of state.puffs) {
            if (p.inside && speed > 2) {
                const dx = puff.x - p.x;
                const dy = puff.y - p.y;
                const d2 = dx * dx + dy * dy;
                const falloff = Math.exp(-d2 / (2 * radius * radius));
                if (falloff > 0.002) {
                    const len = Math.sqrt(d2) || 1;
                    // empurra o vapor na direcao do movimento
                    puff.pvx += p.vx * falloff * dt * 2.1;
                    puff.pvy += p.vy * falloff * dt * 2.1;
                    // e enrola um pouco ao redor do cursor
                    puff.pvx += (-dy / len) * speed * falloff * dt * 0.5;
                    puff.pvy += (dx / len) * speed * falloff * dt * 0.5;
                }
            }

            puff.pvx *= Math.exp(-dt * 1.35);
            puff.pvy *= Math.exp(-dt * 1.35);

            puff.phase += puff.drift * dt;
            puff.x += (puff.bvx + puff.pvx) * dt;
            puff.y += (puff.bvy + Math.sin(puff.phase) * 6 + puff.pvy) * dt;

            const r = puff.r;
            if (puff.x - r > state.w) puff.x = -r;
            if (puff.x + r < 0) puff.x = state.w + r;
            if (puff.y - r > state.h) puff.y = -r;
            if (puff.y + r < 0) puff.y = state.h + r;
        }
    }

    function drawVapor() {
        const q = VAPOR_SCALE;
        vctx.clearRect(0, 0, vapor.width, vapor.height);
        for (const puff of state.puffs) {
            const x = puff.x * q;
            const y = puff.y * q;
            const r = Math.max(1, puff.r * q);
            const g = vctx.createRadialGradient(x, y, 0, x, y, r);
            const c = puff.color;
            g.addColorStop(0, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${puff.alpha})`);
            g.addColorStop(0.55, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${puff.alpha * 0.4})`);
            g.addColorStop(1, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0)`);
            vctx.fillStyle = g;
            vctx.beginPath();
            vctx.arc(x, y, r, 0, Math.PI * 2);
            vctx.fill();
        }

        ctx.save();
        ctx.imageSmoothingEnabled = true;
        if (ctx.imageSmoothingQuality) ctx.imageSmoothingQuality = "high";
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(vapor, 0, 0, state.w, state.h);
        ctx.restore();
    }

    /* ---------- fundo que troca no hover ---------------------------------- */

    // wallpaper da marca: gradiente + logos repetidos + logo grande
    function drawWallpaper(node, g) {
        const c = node.color;
        const deep = [Math.round(c[0] * 0.55), Math.round(c[1] * 0.55), Math.round(c[2] * 0.55)];

        const grad = ctx.createLinearGradient(0, 0, state.w, state.h);
        grad.addColorStop(0, rgba(c, 0.34 * g));
        grad.addColorStop(0.55, rgba(c, 0.14 * g));
        grad.addColorStop(1, rgba(deep, 0.32 * g));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, state.w, state.h);

        if (!node.logos) return false;

        // textura: o logo pequeno repetido, deslizando devagar
        if (node.tile) {
            const d = state.dpr;
            const slide = (state.time * 6) % (TILE * d);
            ctx.save();
            ctx.globalAlpha = 0.09 * g;
            ctx.scale(1 / d, 1 / d);
            ctx.translate(-slide, -slide * 0.45);
            ctx.fillStyle = node.tile;
            ctx.fillRect(0, 0, (state.w + TILE) * d, (state.h + TILE) * d);
            ctx.restore();
        }

        // logo grande, marca d'agua no centro
        const n = node.logos.length;
        const size = state.h * (n > 1 ? 0.5 : 0.72);
        const span = size * 1.08 * (n - 1);
        ctx.save();
        ctx.globalAlpha = 0.44 * g;
        for (let i = 0; i < n; i++) {
            const x = state.w * 0.5 - span * 0.5 + i * size * 1.08;
            ctx.drawImage(node.logos[i], x - size * 0.5, state.h * 0.5 - size * 0.5, size, size);
        }
        ctx.restore();
        return true;
    }

    function drawHoverBackdrop() {
        state.backdrop = 0;
        for (const node of state.nodes) {
            if (node.glow < 0.004) continue;
            const c = node.color;
            const g = node.glow;

            const shown = drawWallpaper(node, g);
            const k = shown ? 0.45 : 1;
            if (shown) state.backdrop = Math.max(state.backdrop, g);

            const r = Math.max(state.w, state.h) * 0.62;
            const halo = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r);
            halo.addColorStop(0, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${0.3 * g * k})`);
            halo.addColorStop(0.45, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${0.1 * g * k})`);
            halo.addColorStop(1, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0)`);
            ctx.fillStyle = halo;
            ctx.fillRect(0, 0, state.w, state.h);
        }
    }

    /* ---------- render ---------------------------------------------------- */

    function drawLinks() {
        state.links.forEach((link) => {
            if (link.s < 0.004) return;
            const curve = linkCurve(link);
            const fade = 1 - Math.min(1, curve.dist / (Math.max(state.w, state.h) * 0.6));
            const a = state.nodes[link.a];
            const b = state.nodes[link.b];
            const lit = Math.max(a.glow, b.glow);
            const alpha = link.s * (0.1 + fade * 0.26) * (1 + lit * 1.4);
            const tint = a.glow > b.glow ? a.color : b.color;
            const col = lit > 0.01
                ? `rgba(${Math.round(43 + (tint[0] - 43) * lit)}, ${Math.round(43 + (tint[1] - 43) * lit)}, ${Math.round(48 + (tint[2] - 48) * lit)}, ${alpha})`
                : `rgba(43, 43, 48, ${alpha})`;

            ctx.strokeStyle = col;
            ctx.lineWidth = 1 + link.s * 0.35 + lit * 0.5;
            ctx.beginPath();
            ctx.moveTo(curve.a.x, curve.a.y);
            ctx.quadraticCurveTo(curve.cx, curve.cy, curve.b.x, curve.b.y);
            ctx.stroke();
        });
    }

    function drawPulses() {
        for (const pulse of state.pulses) {
            const link = state.links.get(pulse.key);
            if (!link || link.s < 0.2) continue;
            const curve = linkCurve(link);
            const t = pulse.t;
            const u = 1 - t;
            const x = u * u * curve.a.x + 2 * u * t * curve.cx + t * t * curve.b.x;
            const y = u * u * curve.a.y + 2 * u * t * curve.cy + t * t * curve.b.y;
            const fade = Math.sin(Math.PI * t) * link.s;
            const r = 2.6 + fade * 1.4;

            const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.4);
            g.addColorStop(0, `rgba(217, 53, 31, ${0.5 * fade})`);
            g.addColorStop(1, "rgba(217, 53, 31, 0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, r * 3.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 238, 220, ${0.8 * fade})`;
            ctx.beginPath();
            ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawNodes() {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (const node of state.nodes) {
            const h = node.hover;
            const scale = 1 + h * 0.16;
            const c = node.color;

            ctx.save();
            ctx.translate(node.x, node.y);
            ctx.scale(scale, scale);

            const w = node.halfW * 2;
            const hh = node.halfH * 2;

            if (h > 0.01) {
                ctx.shadowColor = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${0.45 * h})`;
                ctx.shadowBlur = 26 * h;
            }
            const body = Math.min(0.94, 0.42 + h * 0.46 + state.backdrop * 0.26);
            ctx.fillStyle = `rgba(255, 252, 245, ${body})`;
            roundRect(ctx, -node.halfW, -node.halfH, w, hh, hh * 0.5);
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.strokeStyle = `rgba(${Math.round(218 + (c[0] - 218) * h)}, ${Math.round(210 + (c[1] - 210) * h)}, ${Math.round(191 + (c[2] - 191) * h)}, ${0.55 + h * 0.4})`;
            ctx.lineWidth = 1 + h * 0.6;
            ctx.stroke();

            applyFont(1);
            ctx.fillStyle = `rgba(${Math.round(30 + (c[0] - 30) * h * 0.75)}, ${Math.round(30 + (c[1] - 30) * h * 0.75)}, ${Math.round(34 + (c[2] - 34) * h * 0.75)}, ${0.82 + h * 0.18})`;
            ctx.fillText(node.label, 0, 0.5);

            ctx.restore();

            // nucleo do neuronio
            ctx.fillStyle = `rgba(217, 53, 31, ${0.3 + h * 0.6})`;
            ctx.beginPath();
            ctx.arc(node.x, node.y - node.halfH * scale, 2.1 + h * 1.4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function hitTest() {
        const p = state.pointer;
        if (!p.inside) return -1;
        let found = -1;
        let best = Infinity;
        for (let i = 0; i < state.nodes.length; i++) {
            const node = state.nodes[i];
            const dx = Math.abs(p.x - node.x) / (node.halfW * 1.05);
            const dy = Math.abs(p.y - node.y) / (node.halfH * 1.15);
            const d = Math.max(dx, dy);
            if (d <= 1 && d < best) {
                best = d;
                found = i;
            }
        }
        return found;
    }

    function frame(now) {
        state.frame = 0;
        if (!state.ready) resize();

        const dt = Math.min(0.05, Math.max(0.001, (now - state.last) / 1000 || 0.016));
        state.last = now;
        state.time += dt;

        // a velocidade do ponteiro decai: o empurrao no vapor se dissolve
        state.pointer.vx *= Math.exp(-dt * 3.4);
        state.pointer.vy *= Math.exp(-dt * 3.4);

        // arrastando, o foco fica preso na palavra presa ao cursor
        const hover = state.drag.id !== -1 ? state.drag.id : hitTest();
        if (hover !== state.hover) {
            state.hover = hover;
            state.hoverStamp = state.time;
            field.classList.toggle("is-pointing", hover !== -1);
        }
        // so busca a foto depois de uma pausa curta sobre a palavra: arrastar
        // o mouse pelo retangulo nao dispara um download por palavra tocada
        if (hover !== -1 && state.time - state.hoverStamp > 0.12) {
            ensureLogo(state.nodes[hover]);
        }

        updateNodes(dt);
        updateLinks(dt);
        updatePulses(dt);
        updateVapor(dt);

        ctx.clearRect(0, 0, state.w, state.h);
        drawHoverBackdrop();
        drawVapor();
        drawLinks();
        drawPulses();
        drawNodes();

        if (state.tabVisible && state.onScreen) {
            state.frame = requestAnimationFrame(frame);
        }
    }

    function start() {
        if (state.frame || !state.tabVisible || !state.onScreen) return;
        state.last = performance.now();
        state.frame = requestAnimationFrame(frame);
    }

    function stop() {
        if (!state.frame) return;
        cancelAnimationFrame(state.frame);
        state.frame = 0;
    }

    /* ---------- eventos --------------------------------------------------- */

    field.addEventListener(
        "pointermove",
        (event) => {
            const point = pointerToField(event);
            const x = point.x;
            const y = point.y;
            const p = state.pointer;
            const now = performance.now();
            const dt = Math.max(0.008, Math.min(0.1, (now - p.stamp) / 1000 || 0.016));

            if (p.inside) {
                const vx = (x - p.x) / dt;
                const vy = (y - p.y) / dt;
                const cap = 1400;
                const mag = Math.sqrt(vx * vx + vy * vy);
                const clamp = mag > cap ? cap / mag : 1;
                p.vx = p.vx * 0.72 + vx * clamp * 0.28;
                p.vy = p.vy * 0.72 + vy * clamp * 0.28;
            }

            p.x = x;
            p.y = y;
            p.stamp = now;
            p.inside = true;
            start();
        },
        { passive: true }
    );

    field.addEventListener("pointerleave", () => {
        // segurando uma palavra o cursor pode sair do retangulo sem soltar
        if (state.drag.id !== -1) return;
        state.pointer.inside = false;
        state.pointer.x = -9999;
        state.pointer.y = -9999;
    });

    /* ---------- arrastar as palavras -------------------------------------- */

    field.addEventListener("pointerdown", (event) => {
        const point = pointerToField(event);
        const p = state.pointer;
        p.x = point.x;
        p.y = point.y;
        p.stamp = performance.now();
        p.inside = true;

        const hit = hitTest();
        if (hit === -1) return;

        const node = state.nodes[hit];
        state.drag.id = hit;
        state.drag.ox = node.x - p.x;
        state.drag.oy = node.y - p.y;
        state.drag.pointerId = event.pointerId;
        state.hover = hit;
        field.classList.add("is-dragging");
        ensureLogo(node); // pegou a palavra: ja busca o wallpaper dela

        // captura: o arrasto sobrevive ao cursor sair do retangulo
        if (field.setPointerCapture) {
            try {
                field.setPointerCapture(event.pointerId);
            } catch (err) {
                /* navegador sem captura: o arrasto ainda funciona por dentro */
            }
        }
        event.preventDefault();
        start();
    });

    function endDrag() {
        if (state.drag.id === -1) return;
        const node = state.nodes[state.drag.id];
        if (node) {
            // arremesso: limita o impulso para a palavra nao disparar pela tela
            const cap = 420;
            const mag = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
            if (mag > cap) {
                node.vx *= cap / mag;
                node.vy *= cap / mag;
            }
            // retoma o vagar na direcao em que foi solta
            if (mag > 30) node.heading = Math.atan2(node.vy, node.vx);
        }
        state.drag.id = -1;
        state.drag.pointerId = null;
        field.classList.remove("is-dragging");
    }

    field.addEventListener("pointerup", endDrag);
    field.addEventListener("pointercancel", endDrag);
    field.addEventListener("lostpointercapture", endDrag);

    document.addEventListener("visibilitychange", () => {
        state.tabVisible = !document.hidden;
        if (state.tabVisible) start();
        else stop();
    });

    window.addEventListener(
        "resize",
        () => {
            state.ready = false;
            resize();
        },
        { passive: true }
    );

    if (typeof ResizeObserver === "function") {
        new ResizeObserver(() => {
            state.ready = false;
            resize();
        }).observe(field);
    }

    if (typeof IntersectionObserver === "function") {
        new IntersectionObserver(
            (entries) => {
                state.onScreen = entries[0].isIntersecting;
                if (state.onScreen) start();
                else stop();
            },
            { rootMargin: "120px" }
        ).observe(field);
    }

    resize();
    start();
})();
