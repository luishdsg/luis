// EXP-CAROUSEL: carrossel vertical das experiencias
//
// Dentro do painel de experiencias so um cargo aparece por vez. A coluna de
// bolinhas a esquerda e o indicador: a bolinha do cargo visivel e a maior e as
// outras encolhem conforme se afastam dela (as primeiras e as ultimas sao as
// menores). Troca-se de cargo:
//   - clicando numa bolinha;
//   - com as setas do teclado (cima/baixo, PageUp/PageDown, Home/End);
//   - rolando a roda do mouse / trackpad (com acumulo e trava, para a inercia
//     do trackpad nao pular varios de uma vez);
//   - arrastando com o dedo (swipe) ou com o mouse.
// A troca e um crossfade com deslocamento na direcao do movimento, leve zoom e
// desfoque; o conteudo do cargo que entra chega em cascata. Tudo via GSAP.
//
// Expoe window.expCarousel = { goTo, next, prev, reset, index } para o
// experiencias.js voltar ao primeiro cargo sempre que o painel abre.
(() => {
    const panel = document.getElementById('expPanel');
    const root = document.getElementById('expCarousel');
    const dotsNav = document.getElementById('expDots');
    const stage = document.getElementById('expStage');
    if (!panel || !root || !dotsNav || !stage || typeof gsap === 'undefined') return;

    const items = Array.from(stage.querySelectorAll('.exp-item'));
    if (items.length < 2) return;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const n = items.length;

    const counterNow = root.querySelector('.exp-counter-now');
    const counterTotal = root.querySelector('.exp-counter-total');
    const pad = (v) => String(v).padStart(2, '0');
    if (counterTotal) counterTotal.textContent = pad(n);

    // escala de cada bolinha pela distancia ate a ativa: 1, .62, .32, .3 ...
    const dotScale = (dist) => Math.max(0.3, 1 - dist * 0.38 + (dist > 1 ? (dist - 1) * 0.08 : 0));

    // ---- bolinhas -------------------------------------------------------
    const dots = items.map((item, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'exp-dot';
        const when = item.querySelector('.exp-when');
        const title = item.querySelector('h3');
        const whenText = when ? when.textContent.trim() : '';
        const titleText = title ? title.textContent.trim() : 'Experiência ' + (i + 1);
        btn.setAttribute('aria-label', whenText ? whenText + ' — ' + titleText : titleText);
        const ball = document.createElement('span');
        ball.className = 'exp-dot-ball';
        btn.appendChild(ball);
        dotsNav.appendChild(btn);
        btn.addEventListener('click', () => goTo(i));
        return { btn, ball };
    });

    let index = 0;
    let dir = 1;
    const isOpen = () => panel.getAttribute('aria-hidden') === 'false';                 // +1 desce (proximo), -1 sobe (anterior)
    let lockUntil = 0;           // ms: enquanto nao vence, roda/arraste sao ignorados
    // pecas que entram em cascata: num item bento sao os tiles; nos demais,
    // cada linha de texto e cada tag
    const partsOf = (item) => {
        const bento = item.querySelector('.exp-bento');
        if (bento) return bento.children;
        if (item.classList.contains('exp-item--split')) return item.children;
        if (item.classList.contains('exp-item--iso')) return []; // a cena tem entrada propria
        if (item.classList.contains('exp-item--retro')) return item.querySelectorAll('.exp-retro-anim');
        if (item.classList.contains('exp-item--mosaic')) return []; // quadrados tem entrada propria
        return item.querySelectorAll('.exp-when, h3, .exp-where, p, .exp-tags li');
    };

    function paintDots(idx, animate) {
        dots.forEach((d, i) => {
            const dist = Math.abs(i - idx);
            const active = i === idx;
            d.btn.classList.toggle('is-active', active);
            d.btn.setAttribute('aria-current', active ? 'true' : 'false');
            const s = dotScale(dist);
            if (!animate || calm) {
                gsap.set(d.ball, { scale: s });
                return;
            }
            gsap.to(d.ball, {
                scale: s,
                duration: active ? 1.1 : 0.85,
                // a que cresce da uma leve "respirada" elastica; as que encolhem
                // apenas assentam
                ease: active ? 'elastic.out(1, 0.55)' : 'power3.out',
                overwrite: 'auto'
            });
        });
        if (counterNow) counterNow.textContent = pad(idx + 1);
    }

    // ---- deck: mini carrossel horizontal automatico (2a sessao) -----------
    // Cada .exp-deck tem N .exp-deck-slide empilhados. Enquanto o item dele e o
    // ativo e o painel esta aberto, a barrinha do passo atual enche em
    // DECK_EVERY segundos e, ao completar, o proximo slide entra: o atual e
    // "arrastado" para a direita sumindo e o novo vem da esquerda aparecendo.
    // O avanco nao para com o mouse em cima. Clicar em qualquer ponto do deck
    // pula para o proximo; clicar numa barrinha escolhe o slide.
    const DECK_EVERY = 4;
    const deckParts = (slide) => slide.querySelectorAll('.exp-deck-kicker, h3, .exp-when, .exp-where, p, .exp-tags li');

    const decks = items.map((item, i) => {
        const deckRoot = item.querySelector('.exp-deck');
        if (!deckRoot) return null;
        const slides = Array.from(deckRoot.querySelectorAll('.exp-deck-slide'));
        const nav = deckRoot.querySelector('.exp-deck-nav');
        if (slides.length < 2 || !nav) return null;
        const d = { item: i, slides, fills: [], cur: 0, timer: null };
        slides.forEach((slide, j) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'exp-deck-step';
            btn.setAttribute('aria-label', 'Mostrar: ' + (slide.getAttribute('aria-label') || 'parte ' + (j + 1)));
            const fill = document.createElement('span');
            fill.className = 'exp-deck-fill';
            btn.appendChild(fill);
            nav.appendChild(btn);
            btn.addEventListener('click', (event) => {
                event.stopPropagation(); // senao o clique no deck tambem avancaria
                deckShow(d, j, true);
                deckArm(d);
            });
            d.fills.push(fill);
        });
        deckRoot.addEventListener('click', () => {
            if (!isOpen() || d.item !== index) return;
            deckShow(d, (d.cur + 1) % d.slides.length, true);
            deckArm(d);
        });
        deckShow(d, 0, false);
        return d;
    }).filter(Boolean);

    function deckShow(d, j, animate) {
        const from = d.slides[d.cur];
        const to = d.slides[j];
        d.cur = j;
        d.slides.forEach((slide, k) => {
            slide.classList.toggle('is-active', k === j);
            slide.setAttribute('aria-hidden', k === j ? 'false' : 'true');
        });
        d.slides.forEach((slide) => gsap.killTweensOf(deckParts(slide)));
        gsap.killTweensOf(d.slides);
        if (!animate || calm || from === to) {
            gsap.set(d.slides, { autoAlpha: 0, x: 0 });
            gsap.set(to, { autoAlpha: 1 });
            gsap.set(deckParts(to), { clearProps: 'opacity,transform' });
            return;
        }
        gsap.to(from, { autoAlpha: 0, x: 60, duration: 0.55, ease: 'power2.in', overwrite: 'auto' });
        gsap.fromTo(to,
            { autoAlpha: 0, x: -60 },
            { autoAlpha: 1, x: 0, duration: 0.95, ease: 'expo.out', delay: 0.3, overwrite: 'auto' });
        gsap.fromTo(deckParts(to),
            { opacity: 0, x: -24 },
            { opacity: 1, x: 0, duration: 0.85, stagger: 0.05, ease: 'power3.out', delay: 0.36, clearProps: 'opacity,transform' });
    }

    function deckDisarm(d) {
        if (d.timer) { d.timer.kill(); d.timer = null; }
    }

    function deckArm(d) {
        deckDisarm(d);
        if (calm) return;
        d.fills.forEach((fill, k) => gsap.set(fill, { scaleX: k < d.cur ? 1 : 0 }));
        d.timer = gsap.fromTo(d.fills[d.cur], { scaleX: 0 }, {
            scaleX: 1,
            duration: DECK_EVERY,
            ease: 'none',
            onComplete() {
                if (!isOpen() || d.item !== index) { deckDisarm(d); return; }
                deckShow(d, (d.cur + 1) % d.slides.length, true);
                deckArm(d);
            }
        });
    }

    // liga o deck do item ativo e devolve os outros ao primeiro slide
    function decksSync() {
        decks.forEach((d) => {
            if (d.item === index && isOpen()) {
                if (!d.timer) deckArm(d);
            } else {
                deckDisarm(d);
                deckShow(d, 0, false);
                d.fills.forEach((fill) => gsap.set(fill, { scaleX: 0 }));
            }
        });
    }

    // ---- iso: cubos que sobem do chao (3a sessao) --------------------------
    // Fora da sessao os cubos ficam afundados (z negativo) e invisiveis. Ao
    // entrar, cada um sobe com uma mola elastica, em ordem e com um atraso
    // levemente irregular, e depois fica balancando em Z. A etiqueta aparece
    // quando o cubo ja esta quase no lugar.
    const ISO_SUNK = -260;
    const isos = items.map((item, i) => {
        const world = item.querySelector('.exp-iso-world');
        if (!world) return null;
        const cubes = Array.from(world.querySelectorAll('.exp-cube'));
        const mainCube = world.querySelector('.exp-cube--main');
        const body = mainCube && mainCube.querySelector('.exp-cube-body');
        if (body) {
            // gira em torno do centro do bloco (meia altura em Z)
            const hgt = parseFloat(getComputedStyle(mainCube).getPropertyValue('--h')) || 0;
            gsap.set(body, { transformOrigin: '50% 50% ' + (hgt / 2) + 'px' });
        }
        return {
            item: i,
            cubes,
            mainCube,
            mainShadow: mainCube && mainCube.querySelector('.exp-cube-shadow'),
            body,
            flipped: false,
            flipping: false,
            mainBob: null,
            // o fade e feito nas faces: opacidade no cubo achataria o 3D
            faces: cubes.map((cube) => cube.querySelectorAll('.exp-cube-face, .exp-cube-shadow')),
            labels: Array.from(world.querySelectorAll('.exp-cube-label')),
            bobs: [],
            live: false
        };
    }).filter(Boolean);

    function isoRest(d) {
        d.bobs.forEach((t) => t.kill());
        d.bobs = [];
        gsap.killTweensOf(d.cubes);
        gsap.killTweensOf(d.labels);
        d.faces.forEach((faces) => { gsap.killTweensOf(faces); gsap.set(faces, { opacity: 0 }); });
        gsap.set(d.cubes, { z: ISO_SUNK });
        gsap.set(d.labels, { opacity: 0 });
        if (d.body) {
            gsap.killTweensOf(d.body);
            gsap.set(d.body, { rotationX: 0, rotationZ: 0 });
            if (d.mainShadow) gsap.set(d.mainShadow, { opacity: 1, scale: 1.05 });
            d.mainCube.setAttribute('aria-pressed', 'false');
        }
        d.flipped = false;
        d.flipping = false;
        d.mainBob = null;
        d.live = false;
    }

    function isoEnter(d) {
        if (d.live) return;
        d.live = true;
        if (calm) {
            gsap.set(d.cubes, { z: 0 });
            d.faces.forEach((faces) => gsap.set(faces, { opacity: 1 }));
            gsap.set(d.labels, { opacity: 1 });
            return;
        }
        d.cubes.forEach((cube, k) => {
            const jitter = (Math.sin(k * 12.9898) * 43758.5453) % 1;
            const delay = 0.3 + k * 0.12 + Math.abs(jitter) * 0.14;
            gsap.fromTo(d.faces[k], { opacity: 0 }, { opacity: 1, duration: 0.55, delay, ease: 'power2.out' });
            gsap.fromTo(cube, { z: ISO_SUNK }, {
                z: 0,
                duration: 1.7,
                delay,
                ease: 'elastic.out(1, 0.62)',
                onComplete() {
                    // flutuacao continua, cada cubo com ritmo proprio
                    const bob = gsap.to(cube, {
                        z: 5 + (k % 3) * 3,
                        duration: 2.2 + k * 0.27,
                        yoyo: true,
                        repeat: -1,
                        ease: 'sine.inOut'
                    });
                    d.bobs.push(bob);
                    if (cube === d.mainCube) d.mainBob = bob;
                }
            });
        });
        d.labels.forEach((label, k) => {
            gsap.fromTo(label, { opacity: 0 }, { opacity: 1, duration: 0.7, delay: 0.9 + k * 0.12, ease: 'power2.out' });
        });
    }

    // clique no bloco central: ele sobe e gira ate ficar de pe, de frente para
    // a tela, mostrando a face da descricao reta e legivel. O giro e a inversa
    // da rotacao do chao (rotateX 56 / rotateZ -34) somada ao meio-giro que
    // traz a face de baixo para cima: rotateZ 34 e rotateX 124. Outro clique
    // deita o bloco de volta no lugar.
    const FLIP_X = 124;
    const FLIP_Z = 34;
    const FLIP_LIFT = 100; // o cartao de pe tem 240px de altura: sobe para quase nao cruzar o chao
    function isoFlip(d) {
        if (!d.body || d.flipping || !d.live) return;
        d.flipping = true;
        d.flipped = !d.flipped;
        d.mainCube.setAttribute('aria-pressed', d.flipped ? 'true' : 'false');
        d.mainCube.setAttribute('aria-label', d.flipped
            ? 'Voltar para o resumo da experiência na Mocar'
            : 'Ver descrição da experiência na Mocar');
        const up = d.flipped;
        if (calm) {
            gsap.set(d.body, { rotationX: up ? FLIP_X : 0, rotationZ: up ? FLIP_Z : 0 });
            gsap.set(d.mainCube, { z: up ? FLIP_LIFT : 0 });
            d.flipping = false;
            return;
        }
        if (d.mainBob) d.mainBob.pause();
        gsap.killTweensOf(d.mainCube);
        const tl = gsap.timeline({
            onComplete() {
                d.flipping = false;
                // a flutuacao so volta com o bloco deitado: de pe ela puxaria o Z
                if (!up && d.mainBob) d.mainBob.resume();
            }
        });
        if (up) {
            tl.to(d.mainCube, { z: FLIP_LIFT, duration: 0.9, ease: 'power3.out' }, 0)
                .to(d.body, { rotationX: FLIP_X, rotationZ: FLIP_Z, duration: 1.2, ease: 'power3.inOut' }, 0.05);
            if (d.mainShadow) tl.to(d.mainShadow, { opacity: 0.45, scale: 1.2, duration: 0.9, ease: 'power2.out' }, 0);
        } else {
            tl.to(d.body, { rotationX: 0, rotationZ: 0, duration: 1.15, ease: 'power3.inOut' }, 0)
                .to(d.mainCube, { z: 0, duration: 1.0, ease: 'elastic.out(1, 0.6)' }, 0.55);
            if (d.mainShadow) tl.to(d.mainShadow, { opacity: 1, scale: 1.05, duration: 0.8, ease: 'power2.out' }, 0.5);
        }
    }

    isos.forEach((d) => {
        if (!d.mainCube) return;
        d.mainCube.addEventListener('click', () => isoFlip(d));
        d.mainCube.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                isoFlip(d);
            }
        });
    });

    function isosSync() {
        isos.forEach((d) => {
            if (d.item === index && isOpen()) isoEnter(d);
            else isoRest(d);
        });
    }
    isos.forEach(isoRest);

    // ---- mosaico: quadrados que chegam de lados diferentes (5a sessao) ------
    // data-from diz de onde cada quadrado vem (left, right, top, bottom). Fora
    // da sessao ficam deslocados e invisiveis; ao entrar, deslizam ate o lugar
    // com um leve crescimento, em ordem e com atraso irregular.
    const MOSAIC_FROM = {
        left: { x: -110, y: 0 },
        right: { x: 110, y: 0 },
        top: { x: 0, y: -110 },
        bottom: { x: 0, y: 110 }
    };
    const mosaics = items.map((item, i) => {
        const tiles = Array.from(item.querySelectorAll('.exp-sq'));
        return tiles.length ? { item: i, tiles, live: false } : null;
    }).filter(Boolean);
    const mosaicFrom = (tile) => MOSAIC_FROM[tile.dataset.from] || MOSAIC_FROM.bottom;

    function mosaicRest(d) {
        gsap.killTweensOf(d.tiles);
        d.tiles.forEach((tile) => {
            const f = mosaicFrom(tile);
            gsap.set(tile, { x: f.x, y: f.y, opacity: 0, scale: 0.94 });
        });
        d.live = false;
    }

    function mosaicEnter(d) {
        if (d.live) return;
        d.live = true;
        if (calm) {
            gsap.set(d.tiles, { x: 0, y: 0, opacity: 1, scale: 1 });
            return;
        }
        d.tiles.forEach((tile, k) => {
            const f = mosaicFrom(tile);
            const jitter = Math.abs((Math.sin(k * 7.31) * 1000) % 1);
            const delay = 0.28 + k * 0.08 + jitter * 0.1;
            gsap.fromTo(tile, { x: f.x, y: f.y, scale: 0.94 }, {
                x: 0, y: 0, scale: 1, duration: 1.35, delay, ease: 'expo.out'
            });
            gsap.fromTo(tile, { opacity: 0 }, { opacity: 1, duration: 0.6, delay, ease: 'power2.out' });
        });
    }

    function mosaicsSync() {
        mosaics.forEach((d) => {
            if (d.item === index && isOpen()) mosaicEnter(d);
            else mosaicRest(d);
        });
    }
    mosaics.forEach(mosaicRest);

    // quanto o item ainda pode rolar. Itens com overflow hidden (ex.: a cena
    // 3D, cujos cubos estouram a caixa) nao rolam: contam como zero, senao a
    // roda ficaria esperando uma rolagem que nunca acontece.
    function scrollRoom(item) {
        const oy = getComputedStyle(item).overflowY;
        if (oy !== 'auto' && oy !== 'scroll') return 0;
        return item.scrollHeight - item.clientHeight;
    }

    // borda inferior esmaecida enquanto o item ainda tem conteudo para rolar
    function updateFade(item) {
        const room = scrollRoom(item);
        const more = room > 1 && item.scrollTop < room - 1;
        item.style.setProperty('--fade-b', more ? '40px' : '0px');
    }
    items.forEach((item) => item.addEventListener('scroll', () => updateFade(item), { passive: true }));
    window.addEventListener('resize', () => updateFade(items[index]));

    function show(idx) {
        items.forEach((item, i) => {
            const active = i === idx;
            item.classList.toggle('is-active', active);
            item.setAttribute('aria-hidden', active ? 'false' : 'true');
            gsap.set(item, { autoAlpha: active ? 1 : 0, y: 0, scale: 1, filter: 'blur(0px)' });
            gsap.set(partsOf(item), { clearProps: 'opacity,transform' });
            if (active) {
                item.scrollTop = 0;
                updateFade(item);
            }
        });
        decksSync();
        isosSync();
        mosaicsSync();
    }

    function goTo(target, opts) {
        opts = opts || {};
        target = (target % n + n) % n;
        if (target === index) return;
        dir = opts.dir || (target > index ? 1 : -1);

        const out = items[index];
        const inn = items[target];
        index = target;

        if (calm) {
            show(index);
            paintDots(index, false);
            return;
        }

        gsap.killTweensOf(items);
        items.forEach((item) => {
            if (item !== out && item !== inn) gsap.set(item, { autoAlpha: 0 });
            gsap.killTweensOf(partsOf(item));
        });

        items.forEach((item, i) => {
            item.classList.toggle('is-active', i === index);
            item.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        });
        inn.scrollTop = 0;
        updateFade(inn);

        const parts = partsOf(inn);
        const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
        tl.to(out, {
            autoAlpha: 0,
            y: -dir * 44,
            scale: 0.985,
            filter: 'blur(7px)',
            duration: 0.5,
            ease: 'power2.in'
        }, 0)
            .fromTo(inn,
                { autoAlpha: 0, y: dir * 56, scale: 1.015, filter: 'blur(9px)' },
                { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.05, ease: 'expo.out' },
                0.26)
            .fromTo(parts,
                { opacity: 0, y: dir * 26 },
                { opacity: 1, y: 0, duration: 0.9, stagger: 0.045, ease: 'power3.out' },
                0.32);

        paintDots(index, true);
        isosSync();
        mosaicsSync();
        decksSync();
    }

    const next = () => goTo(index + 1, { dir: 1 });
    const prev = () => goTo(index - 1, { dir: -1 });

    function reset() {
        gsap.killTweensOf(items);
        items.forEach((item) => gsap.killTweensOf(partsOf(item)));
        index = 0;
        show(0);
        paintDots(0, false);
        lockUntil = 0;
    }

    // se o cargo ativo for mais alto que o palco, a roda primeiro rola o texto;
    // so quando ele chega na ponta a troca acontece
    function activeCanScroll(delta) {
        const item = items[index];
        const room = scrollRoom(item);
        if (room <= 1) return false;
        if (delta > 0) return item.scrollTop < room - 1;
        return item.scrollTop > 1;
    }

    // ---- teclado ----------------------------------------------------------
    document.addEventListener('keydown', (event) => {
        if (!isOpen()) return;
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        const target = event.target;
        if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
        switch (event.key) {
            case 'ArrowUp':
            case 'PageUp':
                event.preventDefault(); prev(); break;
            case 'ArrowDown':
            case 'PageDown':
                event.preventDefault(); next(); break;
            case 'Home':
                event.preventDefault(); goTo(0, { dir: -1 }); break;
            case 'End':
                event.preventDefault(); goTo(n - 1, { dir: 1 }); break;
            default:
        }
    });

    // ---- roda do mouse / trackpad ------------------------------------------
    const WHEEL_STEP = 70;   // acumulo de deltaY para contar como uma troca
    const WHEEL_LOCK = 850;  // ms de trava depois de uma troca
    let wheelAcc = 0;
    let wheelIdle = 0;

    panel.addEventListener('wheel', (event) => {
        if (!isOpen()) return;
        const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
        if (activeCanScroll(delta)) return;
        event.preventDefault();

        const now = performance.now();
        if (now < lockUntil) { wheelAcc = 0; return; }

        window.clearTimeout(wheelIdle);
        wheelIdle = window.setTimeout(() => { wheelAcc = 0; }, 160);

        wheelAcc += delta;
        if (Math.abs(wheelAcc) < WHEEL_STEP) return;
        if (wheelAcc > 0) next(); else prev();
        wheelAcc = 0;
        lockUntil = now + WHEEL_LOCK;
    }, { passive: false });

    // ---- arraste (toque e mouse) -------------------------------------------
    // Toque usa touchstart/touchend: assim o navegador ainda rola nativamente
    // um cargo mais alto que o palco (touch-action: pan-y) e a troca so
    // acontece quando o texto nao tem mais para onde rolar. Mouse usa pointer.
    const DRAG_STEP = 48;
    let touchY = null;
    let touchScrollable = false;

    stage.addEventListener('touchstart', (event) => {
        if (!isOpen() || event.touches.length !== 1) return;
        touchY = event.touches[0].clientY;
        touchScrollable = activeCanScroll(1) || activeCanScroll(-1);
    }, { passive: true });
    stage.addEventListener('touchend', (event) => {
        if (touchY === null) return;
        const dy = event.changedTouches[0].clientY - touchY;
        touchY = null;
        if (Math.abs(dy) < DRAG_STEP || touchScrollable) return;
        const now = performance.now();
        if (now < lockUntil) return;
        // arrastar para cima traz o proximo (como rolar a pagina)
        if (dy < 0) next(); else prev();
        lockUntil = now + WHEEL_LOCK;
    }, { passive: true });
    stage.addEventListener('touchcancel', () => { touchY = null; }, { passive: true });

    let dragY = null;
    let dragId = null;

    stage.addEventListener('pointerdown', (event) => {
        if (!isOpen() || event.pointerType !== 'mouse' || event.button !== 0) return;
        dragY = event.clientY;
        dragId = event.pointerId;
    });
    stage.addEventListener('pointermove', (event) => {
        if (dragY === null || event.pointerId !== dragId) return;
        const dy = event.clientY - dragY;
        if (Math.abs(dy) < DRAG_STEP) return;
        dragY = null;
        if (activeCanScroll(-dy)) return;
        const now = performance.now();
        if (now < lockUntil) return;
        if (dy < 0) next(); else prev();
        lockUntil = now + WHEEL_LOCK;
    });
    const endDrag = () => { dragY = null; dragId = null; };
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('pointerleave', endDrag);

    reset();
    window.expCarousel = { goTo, next, prev, reset, get index() { return index; } };
})();
