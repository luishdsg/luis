// EXPERIENCIAS: painel que derruba a vitrine
//
// O link "Experiencias" da nav traz um painel pela direita ate ele cobrir 70%
// da tela. No instante em que ele entra, todo componente visivel da pagina se
// solta do lugar como se tivesse sido derrubado de uma prateleira: cai com
// gravidade, tomba, quica no chao da tela, esbarra nos outros e vai sendo
// varrido pela borda do painel ate virar uma pilha bagunçada no canto
// inferior esquerdo (os 30% que sobram).
//
// Simulacao, por subpasso fixo (1/120 s):
//   - cada objeto e um corpo com posicao, velocidade, angulo e giro. A massa
//     e a area dele: cards pesam mais que letras;
//   - gravidade, atrito no chao e um torque que deita o objeto no lado mais
//     proximo (0 ou 90 graus) quando ele encosta no piso;
//   - chao = base da tela, parede = borda esquerda, placa = borda esquerda do
//     painel (posicao vinda de um tween GSAP "expo.out": chega rapido e freia).
//     Quem a placa alcanca e arremessado na velocidade dela, com um giro;
//   - objetos largos demais para os 30% sao "esmagados" (escala) ao serem
//     prensados entre a placa e a parede;
//   - colisao entre objetos por circulos (raio pela area), com separacao de
//     posicao e troca de velocidade: e isso que forma a pilha em vez de tudo
//     se atravessar;
//   - squash & stretch no impacto com o chao.
//
// Ao fechar, a placa recua e cada objeto volta para o lugar por uma mola
// propria (os leves chegam antes), e no fim o DOM e devolvido ao estado
// anterior: transforms e tweens originais (flutuacao dos cards) retomados.
(() => {
    const panel = document.getElementById('expPanel');
    const backdrop = document.getElementById('expBackdrop');
    const toggle = document.getElementById('spotPill');
    const closeBtn = document.getElementById('expClose');
    const scroller = panel && panel.querySelector('.exp-scroll');
    if (!panel || !backdrop || !toggle || typeof gsap === 'undefined') return;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // o que cai. Cada seletor vira varios corpos independentes (cada letra,
    // cada card). Blocos com filhos ja animados entram inteiros (stats-inner).
    const SELECTORS = [
        '.nav .logo', '.nav .switcher', '.nav #btn',
        '.small-team .word', '.big-results .letter', '.card',
        '.subline .arrow-pill', '.subline-text',
        '.team-head .eyebrow', '.team-head h2', '.intro-text', '.coruja', '#formation',
        '.stats-inner',
        '.footer .content > div > div', '.footer .content > div > .image', '.footer .content p',
        '.glass-stage.is-mounted .glass-stage-panel'
    ];

    const STEP = 1 / 120;      // subpasso fixo da simulacao
    const MAX_STEPS = 8;       // frames muito atrasados viram camera lenta, nao explosao
    const GRAVITY = 2600;      // px/s^2
    const FLOOR_PAD = 6;       // chao = base da tela menos isso
    const PAD = 12;            // folga para o esmagamento de objetos largos
    const FRICTION = 7;        // atrito no chao (1/s)
    const AIR = 0.25;          // arrasto no ar (1/s)
    const RADIUS_K = 0.68;     // raio de colisao em relacao a sqrt(area)/2
    const SLEEP_FRAMES = 24;   // frames parados para o laco dormir
    const SETTLE = 1.4;        // s de assentamento depois que o painel chega; dai congela

    let isOpen = false;
    let mode = 'idle';         // idle | fall | return
    let objects = [];
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let panelW = 0;
    let rafId = 0;
    let lastTime = 0;
    let acc = 0;
    let simTime = 0;
    let prevW = 0;
    let quietFrames = 0;
    let settleUntil = Infinity; // simTime em que a pilha congela de vez

    // 0 = painel fora da tela, 1 = painel em 70%
    const drive = { p: 0 };

    // hash deterministico: cada objeto tem a sua "personalidade" fixa
    const noise = (i, salt) => {
        const s = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
        return s - Math.floor(s);
    };

    const HALF_PI = Math.PI / 2;
    const flatError = (a) => a - Math.round(a / HALF_PI) * HALF_PI;

    function measure() {
        const seen = new Set();
        const found = [];

        SELECTORS.forEach((sel) => {
            document.querySelectorAll(sel).forEach((el) => {
                if (seen.has(el)) return;
                const r = el.getBoundingClientRect();
                if (r.width < 2 || r.height < 2) return;
                if (r.bottom < -40 || r.top > vh + 40) return; // fora da tela: nao ve
                seen.add(el);
                found.push({ el, r });
            });
        });

        // ninguem pode ser filho de outro corpo, senao e movido duas vezes
        objects = found
            .filter(({ el }) => !found.some((o) => o.el !== el && o.el.contains(el)))
            .map(({ el, r }, i) => {
                const w = r.width, h = r.height;
                const area = w * h;
                const returnFreq = 0.9 + noise(i, 5) * 0.5;
                return {
                    el,
                    w, h, hw: w / 2, hh: h / 2,
                    cx: r.left + w / 2,
                    cy: r.top + h / 2,
                    mass: area,
                    invMass: 1 / area,
                    r: Math.sqrt(area) / 2 * RADIUS_K,
                    hasGsap: !!el._gsap,
                    baseX: parseFloat(gsap.getProperty(el, 'x')) || 0,
                    baseY: parseFloat(gsap.getProperty(el, 'y')) || 0,
                    baseRot: parseFloat(gsap.getProperty(el, 'rotation')) || 0,
                    origin: getComputedStyle(el).transformOrigin,
                    // tweens proprios da pagina (ex.: flutuacao dos cards) ficam
                    // em pausa enquanto o corpo e nosso
                    tweens: gsap.getTweensOf(el).filter((t) => t.isActive()),
                    // corpo
                    x: 0, y: 0, vx: 0, vy: 0, a: 0, av: 0,
                    // solta da prateleira com um atraso e um tranco proprios
                    delay: noise(i, 3) * 0.45,
                    awake: false,
                    kickX: (noise(i, 4) - 0.5) * 260,
                    kickY: -(60 + noise(i, 6) * 240),
                    kickA: (noise(i, 7) - 0.5) * 6,
                    hit: false,
                    bounce: 0.18 + noise(i, 8) * 0.25,
                    // squash & stretch e esmagamento
                    sq: 1, sqv: 0,
                    cs: 1, csv: 0, csT: 1,
                    // mola da volta
                    omega: 2 * Math.PI * returnFreq,
                    zeta: 0.8 + noise(i, 9) * 0.12
                };
            });
    }

    // meia-largura e meia-altura do retangulo girado
    function extents(o) {
        const c = Math.abs(Math.cos(o.a)), s = Math.abs(Math.sin(o.a));
        const hw = o.hw * o.cs, hh = o.hh * o.cs;
        return { ex: c * hw + s * hh, ey: s * hw + c * hh };
    }

    function fallStep(dt, W, plateV, zone) {
        const floor = vh - FLOOR_PAD;
        const n = objects.length;

        for (let i = 0; i < n; i++) {
            const o = objects[i];

            if (!o.awake) {
                if (simTime < o.delay) continue;
                o.awake = true;
                o.vx = o.kickX;
                o.vy = o.kickY;
                o.av = o.kickA;
            }

            o.vy += GRAVITY * dt;
            o.vx *= Math.max(0, 1 - AIR * dt);
            // painel ja chegou: a pilha perde energia rapido para assentar
            if (simTime > settleUntil - SETTLE) {
                const calmDown = Math.max(0, 1 - 3 * dt);
                o.vx *= calmDown;
                o.av *= calmDown;
            }
            o.x += o.vx * dt;
            o.y += o.vy * dt;
            o.a += o.av * dt;

            // esmagamento e squash sao molas rigidas
            const wc = 26;
            o.csv += (-(wc * wc) * (o.cs - o.csT) - 2 * 0.8 * wc * o.csv) * dt;
            o.cs += o.csv * dt;
            const wq = 34;
            o.sqv += (-(wq * wq) * (o.sq - 1) - 2 * 0.55 * wq * o.sqv) * dt;
            o.sq += o.sqv * dt;

            const { ex, ey } = extents(o);
            const cx = o.cx + o.x;
            const cy = o.cy + o.y;

            // chao
            if (cy + ey > floor) {
                o.y -= cy + ey - floor;
                if (o.vy > 0) {
                    const impact = o.vy;
                    o.vy = -o.vy * o.bounce;
                    if (Math.abs(o.vy) < 70) o.vy = 0;
                    // amassa no impacto e rola um pouco na direcao que vinha
                    o.sq = Math.max(0.6, o.sq - impact / 5200);
                    o.av += o.vx * 0.0025;
                }
                o.vx *= Math.max(0, 1 - FRICTION * dt);
                // deita no lado mais proximo
                const err = flatError(o.a);
                o.av += (-err * 70 - o.av * 9) * dt;
                // quase parado no chao: para de vez, sem tremer
                if (o.vy === 0 && Math.abs(o.vx) < 12 && Math.abs(o.av) < 0.25) {
                    o.vx = 0;
                    o.av = 0;
                }
            }

            // parede esquerda
            if (cx - ex < 0) {
                o.x -= cx - ex;
                if (o.vx < 0) o.vx = -o.vx * o.bounce;
                o.av *= 0.9;
            }

            // placa do painel
            if (o.cs * o.w > zone - 2 * PAD && !o.hit && cx + ex > W) {
                // largo demais para os 30%: e prensado e esmaga ate caber
                o.csT = (zone - 2 * PAD) / o.w;
            }
            if (2 * ex >= W) {
                // prensado entre a placa e a parede: fica no meio ate caber
                o.x = W / 2 - o.cx;
                o.vx = 0;
                o.hit = true;
            } else if (cx + ex > W) {
                o.x -= cx + ex - W;
                if (o.vx > plateV) o.vx = plateV * 1.05 - 20;
                if (!o.hit) {
                    o.hit = true;
                    o.av += (noise(i, 10) - 0.5) * 10;
                    o.vy -= 120;
                }
            }
        }

        // colisao entre corpos: circulos, separacao posicional + impulso
        for (let i = 0; i < n; i++) {
            const a = objects[i];
            if (!a.awake) continue;
            for (let j = i + 1; j < n; j++) {
                const b = objects[j];
                if (!b.awake) continue;

                const dx = (b.cx + b.x) - (a.cx + a.x);
                const dy = (b.cy + b.y) - (a.cy + a.y);
                const ra = a.r * a.cs, rb = b.r * b.cs;
                const minD = ra + rb;
                const d2 = dx * dx + dy * dy;
                if (d2 >= minD * minD || d2 === 0) continue;

                const d = Math.sqrt(d2);
                const nx = dx / d, ny = dy / d;
                const overlap = minD - d;
                const total = a.invMass + b.invMass;
                const push = overlap * 0.45;
                a.x -= nx * push * (a.invMass / total);
                a.y -= ny * push * (a.invMass / total);
                b.x += nx * push * (b.invMass / total);
                b.y += ny * push * (b.invMass / total);

                const rvx = b.vx - a.vx, rvy = b.vy - a.vy;
                const vn = rvx * nx + rvy * ny;
                if (vn < 0) {
                    const jn = -(1 + 0.12) * vn / total;
                    a.vx -= nx * jn * a.invMass;
                    a.vy -= ny * jn * a.invMass;
                    b.vx += nx * jn * b.invMass;
                    b.vy += ny * jn * b.invMass;
                    // o esbarrao gira os dois
                    a.av += (rvx * ny - rvy * nx) * 0.0006;
                    b.av -= (rvx * ny - rvy * nx) * 0.0006;
                }
            }
        }
    }

    // volta para casa: molas em x, y, angulo e escalas
    function returnStep(dt) {
        for (let i = 0; i < objects.length; i++) {
            const o = objects[i];
            const k = o.omega * o.omega, c = 2 * o.zeta * o.omega;
            o.vx += (-k * o.x - c * o.vx) * dt;
            o.vy += (-k * o.y - c * o.vy) * dt;
            o.av += (-k * o.a - c * o.av) * dt;
            o.x += o.vx * dt;
            o.y += o.vy * dt;
            o.a += o.av * dt;
            o.csv += (-k * (o.cs - 1) - c * o.csv) * dt;
            o.cs += o.csv * dt;
            o.sqv += (-k * (o.sq - 1) - c * o.sqv) * dt;
            o.sq += o.sqv * dt;
        }
    }

    function tick(now) {
        rafId = window.requestAnimationFrame(tick);

        const dt = Math.min(1 / 15, Math.max(0.001, (now - lastTime) / 1000 || 1 / 60));
        lastTime = now;

        const p = drive.p;
        const W = vw - panelW * p; // borda esquerda da placa
        const zone = vw - panelW;  // os 30% finais
        const plateV = (W - prevW) / dt;
        prevW = W;
        gsap.set(panel, { x: panelW * (1 - p) });

        acc += dt;
        const steps = Math.min(MAX_STEPS, Math.floor(acc / STEP));
        acc -= steps * STEP;
        for (let k = 0; k < steps; k++) {
            if (mode === 'fall') fallStep(STEP, W, plateV, zone);
            else if (mode === 'return') returnStep(STEP);
            simTime += STEP;
        }

        let quiet = true;
        for (let i = 0; i < objects.length; i++) {
            const o = objects[i];
            const stretch = 1 + (1 - o.sq) * 0.6;
            gsap.set(o.el, {
                x: o.baseX + o.x,
                y: o.baseY + o.y,
                rotation: o.baseRot + o.a * 180 / Math.PI,
                scaleX: o.cs * stretch,
                scaleY: o.cs * o.sq
            });

            if (mode === 'fall') {
                if (!o.awake || Math.abs(o.vx) > 6 || Math.abs(o.vy) > 6 || Math.abs(o.av) > 0.08) quiet = false;
            } else if (Math.abs(o.x) > 0.3 || Math.abs(o.y) > 0.3 || Math.abs(o.a) > 0.003 ||
                Math.abs(o.vx) > 4 || Math.abs(o.vy) > 4 || Math.abs(o.cs - 1) > 0.002) {
                quiet = false;
            }
        }

        if (gsap.isTweening(drive)) { quietFrames = 0; return; }
        quietFrames = quiet ? quietFrames + 1 : 0;

        if (mode === 'fall' && quietFrames < SLEEP_FRAMES && simTime < settleUntil) return;
        if (mode === 'return' && !quiet) return;

        // tudo parado (ou o prazo de assentamento venceu): o laco para e nada
        // mais se mexe ate o painel fechar. Fechado, devolve a pagina ao normal.
        window.cancelAnimationFrame(rafId);
        rafId = 0;
        if (mode === 'return') restore();
    }

    function startLoop() {
        if (rafId) return;
        window.requestAnimationFrame((now) => {
            lastTime = now;
            acc = 0;
            prevW = vw - panelW * drive.p;
            tick(now);
        });
    }

    // devolve cada corpo ao estado anterior a queda
    function restore() {
        objects.forEach((o) => {
            if (o.hasGsap) {
                gsap.set(o.el, {
                    x: o.baseX, y: o.baseY, rotation: o.baseRot,
                    scaleX: 1, scaleY: 1, transformOrigin: o.origin
                });
            } else {
                gsap.set(o.el, { clearProps: 'transform,transformOrigin' });
            }
            o.tweens.forEach((t) => t.paused(false));
        });
        objects = [];
        mode = 'idle';
        panel.classList.remove('is-mounted');
        backdrop.classList.remove('is-mounted');
    }

    function openPanel() {
        if (isOpen) return;
        isOpen = true;

        vw = window.innerWidth;
        vh = window.innerHeight;
        panelW = panel.offsetWidth;

        if (!objects.length && !calm) {
            measure();
            objects.forEach((o) => {
                o.tweens.forEach((t) => t.paused(true));
                // gira pelo centro (as letras giram pela base no CSS)
                gsap.set(o.el, { transformOrigin: '50% 50%' });
            });
        }
        mode = 'fall';
        simTime = 0;
        quietFrames = 0;
        settleUntil = Infinity;

        panel.classList.add('is-mounted');
        backdrop.classList.add('is-mounted');
        window.requestAnimationFrame(() => backdrop.classList.add('is-open'));
        document.body.classList.add('exp-open');
        panel.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        if (window.lenis) window.lenis.stop();

        gsap.killTweensOf(drive);
        gsap.to(drive, {
            p: 1,
            duration: calm ? 0.01 : 1.9,
            ease: 'expo.out',
            onComplete() {
                // o painel chegou: a pilha tem SETTLE segundos para assentar
                settleUntil = simTime + SETTLE;
            }
        });

        const content = panel.querySelectorAll('.exp-head > *, .exp-carousel');
        gsap.killTweensOf(content);
        gsap.fromTo(content,
            { opacity: 0, x: 48 },
            { opacity: 1, x: 0, duration: 0.9, stagger: 0.06, ease: 'power3.out', delay: calm ? 0 : 0.3 });

        if (scroller) scroller.scrollTop = 0;
        if (window.expCarousel) window.expCarousel.reset();
        startLoop();
        if (closeBtn) closeBtn.focus({ preventScroll: true });
    }

    function closePanel() {
        if (!isOpen) return;
        isOpen = false;

        backdrop.classList.remove('is-open');
        document.body.classList.remove('exp-open');
        panel.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        if (window.lenis) window.lenis.start();

        // a placa recua e cada peca volta para a vitrine pela sua mola
        mode = objects.length ? 'return' : 'idle';
        objects.forEach((o) => { o.awake = true; o.csT = 1; });
        quietFrames = 0;
        settleUntil = Infinity;

        gsap.killTweensOf(drive);
        gsap.to(drive, {
            p: 0,
            duration: calm ? 0.01 : 1.15,
            ease: 'power3.inOut',
            onComplete() {
                if (mode === 'idle') restore();
            }
        });

        startLoop();
        toggle.focus({ preventScroll: true });
    }

    toggle.addEventListener('click', (event) => {
        event.preventDefault();
        if (isOpen) closePanel(); else openPanel();
    });
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    backdrop.addEventListener('click', closePanel);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen) closePanel();
    });

    // o Lenis escuta a roda na window; parado, ele cancela o evento. Dentro do
    // painel a rolagem e nativa, entao o evento nao pode chegar ate ele.
    panel.addEventListener('wheel', (event) => event.stopPropagation(), { passive: true });
    panel.addEventListener('touchmove', (event) => event.stopPropagation(), { passive: true });

    window.addEventListener('resize', () => {
        vw = window.innerWidth;
        vh = window.innerHeight;
        panelW = panel.offsetWidth;
    });
})();
