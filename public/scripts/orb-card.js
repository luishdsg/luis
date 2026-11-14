(() => {
    const btn = document.getElementById('btn');
    const orb = document.getElementById('orb');
    const ball = document.getElementById('orbBall');
    const card = document.getElementById('orbCard');
    const turb = document.getElementById('orbTurb');
    const glassStage = document.getElementById('glassStage');
    if (!btn || !orb || !ball || !card || !window.gsap) return;

    const lines = Array.from(card.querySelectorAll('.orb-line'));
    const disp = turb ? turb.nextElementSibling : null;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const PAD = 80;

    let isOpen = false;
    let tl = null;
    const wobble = { amp: 0 };

    function origin() {
        const r = btn.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    function diameter(o) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const dx = Math.max(o.x, w - o.x);
        const dy = Math.max(o.y, h - o.y);
        return (Math.hypot(dx, dy) + PAD) * 2;
    }

    function place(o) {
        const dia = diameter(o);
        gsap.set(ball, { width: dia, height: dia, left: o.x, top: o.y, xPercent: -50, yPercent: -50 });
    }

    function paintWobble() {
        if (!disp) return;
        disp.setAttribute('scale', wobble.amp.toFixed(1));
    }

    function setLabel(open) {
        btn.classList.toggle('is-close', open);
        btn.setAttribute('aria-label', open ? 'Fechar cartão de apresentação' : 'Abrir cartão de apresentação');
    }

    function openOrb() {
        if (tl) tl.kill();
        isOpen = true;

        place(origin());

        orb.classList.add('is-mounted', 'is-moving');
        orb.setAttribute('aria-hidden', 'false');
        document.body.classList.add('orb-open');
        setLabel(true);
        if (window.lenis) window.lenis.stop();

        const d = calm ? 0.01 : 1;

        tl = gsap.timeline({
            defaults: { overwrite: 'auto' },
            onComplete() {
                orb.classList.remove('is-moving');
                orb.classList.add('is-open');
                const first = card.querySelector('a');
                if (first) first.focus({ preventScroll: true });
            }
        });

        tl.fromTo(ball,
            { scale: 0 },
            { scale: 1, duration: 1.7 * d, ease: 'expo.inOut' }, 0);

        tl.to(wobble, { amp: 70, duration: 0.7 * d, ease: 'sine.in', onUpdate: paintWobble }, 0);
        tl.to(wobble, { amp: 0, duration: 1.1 * d, ease: 'sine.out', onUpdate: paintWobble }, 0.7 * d);

        tl.fromTo(lines,
            { opacity: 0, y: 26, filter: 'blur(6px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 * d, ease: 'power3.out', stagger: 0.07 * d },
            0.85 * d);
    }

    function closeOrb() {
        if (tl) tl.kill();
        isOpen = false;

        orb.classList.remove('is-open');
        orb.classList.add('is-moving');
        setLabel(false);

        const d = calm ? 0.01 : 1;

        tl = gsap.timeline({
            defaults: { overwrite: 'auto' },
            onComplete() {
                orb.classList.remove('is-mounted', 'is-moving');
                orb.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('orb-open');
                wobble.amp = 0;
                paintWobble();
                if (window.lenis) window.lenis.start();
                btn.focus({ preventScroll: true });
            }
        });

        tl.to(lines, {
            opacity: 0, y: -14, filter: 'blur(4px)',
            duration: 0.4 * d, ease: 'power2.in', stagger: { each: 0.03 * d, from: 'end' }
        }, 0);

        tl.to(ball, { scale: 0, duration: 1.25 * d, ease: 'expo.inOut' }, 0.2 * d);

        tl.to(wobble, { amp: 60, duration: 0.6 * d, ease: 'sine.in', onUpdate: paintWobble }, 0.2 * d);
        tl.to(wobble, { amp: 0, duration: 0.8 * d, ease: 'sine.out', onUpdate: paintWobble }, 0.8 * d);
    }

    btn.addEventListener('click', (event) => {
        if (glassStage && glassStage.classList.contains('is-open')) return;
        event.preventDefault();
        if (isOpen) closeOrb();
        else openOrb();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen) closeOrb();
    });

    window.addEventListener('resize', () => {
        if (!isOpen || (tl && tl.isActive())) return;
        place(origin());
    });

    window.orbCard = { open: openOrb, close: closeOrb, isOpen: () => isOpen };
})();
