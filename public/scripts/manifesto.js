(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGsap = typeof gsap !== 'undefined';
    const jitter = (base, spread) => base + (Math.random() - 0.5) * spread;

    const init = (root) => {
        const lines = Array.from(root.querySelectorAll('.fade-line'));
        if (lines.length < 2) return;

        const hold = Number(root.dataset.hold) || 2800;
        const instant = root.dataset.animate === 'none';
        const section = root.closest('.manifesto');
        const mark = section ? section.querySelector('.manifesto-mark') : null;
        const eyebrow = section ? section.querySelector('.manifesto-eyebrow') : null;
        const fontSize = parseFloat(getComputedStyle(root).fontSize) || 16;
        const lift = Math.min(26, fontSize * 0.5);
        const blurIn = Math.min(14, fontSize * 0.25);
        const blurOut = Math.min(10, fontSize * 0.18);

        lines.forEach((line) => {
            line.setAttribute('aria-hidden', 'true');
            if (instant) return;
            const nodes = Array.from(line.childNodes);
            line.textContent = '';
            nodes.forEach((node) => {
                const extra = node.nodeType === 1 ? node.className : '';
                node.textContent.split(/(\s+)/).forEach((token) => {
                    if (!token) return;
                    if (/^\s+$/.test(token)) {
                        line.appendChild(document.createTextNode(' '));
                        return;
                    }
                    const span = document.createElement('span');
                    span.className = extra ? `fade-word ${extra}` : 'fade-word';
                    span.textContent = token;
                    line.appendChild(span);
                });
            });
        });

        const wordsOf = (line) => Array.from(line.querySelectorAll('.fade-word'));

        let index = 0;
        let timer = null;
        let started = false;
        let visible = false;
        let busy = false;

        const enter = (line, delay = 0) => {
            line.classList.add('is-active');
            line.removeAttribute('aria-hidden');
            if (instant) return Promise.resolve();
            if (!hasGsap || calm) {
                line.classList.add('is-in');
                line.classList.remove('is-out');
                return Promise.resolve();
            }
            const words = wordsOf(line);
            const each = Math.min(0.065, 1.1 / words.length);
            return new Promise((resolve) => {
                gsap.fromTo(
                    words,
                    { opacity: 0, y: lift, filter: `blur(${blurIn}px)`, scale: 0.985 },
                    {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        scale: 1,
                        duration: jitter(1.25, 0.3),
                        delay,
                        ease: 'power3.out',
                        stagger: { each, from: 'start' },
                        onComplete: resolve,
                    }
                );
            });
        };

        const leave = (line) => {
            line.setAttribute('aria-hidden', 'true');
            if (instant) {
                line.classList.remove('is-active');
                return Promise.resolve();
            }
            if (!hasGsap || calm) {
                line.classList.remove('is-in');
                line.classList.add('is-out');
                setTimeout(() => line.classList.remove('is-active', 'is-out'), 900);
                return Promise.resolve();
            }
            const words = wordsOf(line);
            const each = Math.min(0.045, 0.7 / words.length);
            return new Promise((resolve) => {
                gsap.to(words, {
                    opacity: 0,
                    y: -lift * 0.75,
                    filter: `blur(${blurOut}px)`,
                    scale: 1.01,
                    duration: jitter(0.85, 0.2),
                    ease: 'power2.inOut',
                    stagger: { each, from: 'start' },
                    onComplete: () => {
                        line.classList.remove('is-active');
                        resolve();
                    },
                });
            });
        };

        const schedule = () => {
            clearTimeout(timer);
            if (!visible) return;
            timer = setTimeout(next, hold);
        };

        const next = async () => {
            if (busy || !visible) return;
            busy = true;
            const current = lines[index];
            index = (index + 1) % lines.length;
            const upcoming = lines[index];
            const out = leave(current);
            await enter(upcoming, hasGsap && !calm && !instant ? 0.35 : 0);
            await out;
            busy = false;
            schedule();
        };

        const start = async () => {
            started = true;
            root.classList.add('is-live');
            if (section) section.classList.add('is-live');
            if (hasGsap && !calm) {
                if (mark) {
                    gsap.fromTo(mark, { opacity: 0, rotate: -90, scale: 0.6 }, { opacity: 1, rotate: 0, scale: 1, duration: 1.4, ease: 'expo.out' });
                }
                if (eyebrow) {
                    gsap.fromTo(eyebrow, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.2, ease: 'power2.out' });
                }
            }
            await enter(lines[index], hasGsap && !calm && !instant ? 0.45 : 0);
            schedule();
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    visible = entry.isIntersecting;
                    if (visible && !started) {
                        start();
                    } else if (visible) {
                        if (!busy) schedule();
                    } else {
                        clearTimeout(timer);
                    }
                });
            },
            { threshold: 0.35 }
        );
        observer.observe(root);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearTimeout(timer);
            } else if (visible && started && !busy) {
                schedule();
            }
        });
    };

    document.querySelectorAll('[data-fade-loop]').forEach(init);
})();
