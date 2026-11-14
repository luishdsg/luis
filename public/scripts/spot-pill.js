(() => {
    const pill = document.getElementById('spotPill');
    if (!pill) return;

    const ring = pill.querySelector('.spot-pill-ring');
    const fitDots = () => {
        if (!ring || typeof ring.getTotalLength !== 'function') return;
        const length = ring.getTotalLength();
        if (!length) return;
        const period = length / Math.max(1, Math.round(length / 7));
        ring.style.setProperty('--dash', `${period.toFixed(3)}px`);
    };
    fitDots();
    window.addEventListener('resize', fitDots);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitDots);

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const RADIUS = 48;
    const EASE_POS = calm ? 1 : 0.16;
    const EASE_SIZE = calm ? 1 : 0.12;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let targetR = 0;
    let r = 0;
    let rx = 0;
    let ry = 0;
    let raf = null;
    let clock = 0;

    const paint = () => {
        pill.style.setProperty('--mx', `${x.toFixed(1)}px`);
        pill.style.setProperty('--my', `${y.toFixed(1)}px`);
        pill.style.setProperty('--rx', `${Math.max(0.5, rx).toFixed(1)}px`);
        pill.style.setProperty('--ry', `${Math.max(0.5, ry).toFixed(1)}px`);
    };

    const tick = () => {
        clock += 0.016;
        const px = x;
        const py = y;
        x += (tx - x) * EASE_POS;
        y += (ty - y) * EASE_POS;
        r += (targetR - r) * EASE_SIZE;

        const vx = x - px;
        const vy = y - py;
        const kx = Math.min(Math.abs(vx) / 26, 0.6);
        const ky = Math.min(Math.abs(vy) / 26, 0.6);
        const breathe = calm ? 1 : 1 + Math.sin(clock * 2.6) * 0.05 + Math.sin(clock * 4.1) * 0.025;
        const wantRx = r * breathe * (1 + kx) * (1 - ky * 0.35);
        const wantRy = r * breathe * (1 + ky) * (1 - kx * 0.35);
        rx += (wantRx - rx) * 0.22;
        ry += (wantRy - ry) * 0.22;

        paint();

        if (targetR === 0 && r < 0.4) {
            r = 0;
            rx = 0;
            ry = 0;
            paint();
            pill.classList.remove('is-lit');
            raf = null;
            return;
        }
        raf = requestAnimationFrame(tick);
    };

    const run = () => {
        if (raf === null) raf = requestAnimationFrame(tick);
    };

    const localPoint = (event) => {
        const box = pill.getBoundingClientRect();
        return { x: event.clientX - box.left, y: event.clientY - box.top };
    };

    const light = (point) => {
        tx = point.x;
        ty = point.y;
        if (targetR === 0) {
            x = tx;
            y = ty;
        }
        targetR = RADIUS;
        pill.classList.add('is-lit');
        run();
    };

    const dim = () => {
        targetR = 0;
        run();
    };

    pill.addEventListener('pointerenter', (event) => light(localPoint(event)));
    pill.addEventListener('pointermove', (event) => {
        const p = localPoint(event);
        tx = p.x;
        ty = p.y;
        if (targetR === 0) light(p);
    });
    pill.addEventListener('pointerleave', dim);
    pill.addEventListener('pointercancel', dim);

    pill.addEventListener('focus', () => {
        if (!pill.matches(':focus-visible')) return;
        light({ x: pill.offsetWidth / 2, y: pill.offsetHeight / 2 });
    });
    pill.addEventListener('blur', dim);
})();
