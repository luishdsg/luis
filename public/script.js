// GET VIEWS COUNTER
async function registrarVisita() {

    try {

        const resposta = await fetch(
            "/api/views", {
            method: "POST"
        }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                dados.erro || "Erro ao registrar visita"
            );

        }

        document.getElementById("contador").textContent =
            Number(dados.total).toLocaleString("pt-BR");

        console.log(
            dados.total
        );

    } catch (erro) {

        console.error(
            erro
        );

        document.getElementById("contador").textContent =
            "...";
    }
}

// navbar NAVEGATION
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();

        const alvo = document.querySelector(link.getAttribute('href'));

        if (!alvo) return;

        const offset = window.innerHeight * 0.1; // 10% do topo

        const posicao =
            alvo.getBoundingClientRect().top +
            window.pageYOffset -
            offset;

        window.scrollTo({
            top: posicao,
            behavior: 'smooth'
        });
    });
});


// DONT CLICK HERE
(() => {
    let initial = 0,
        interval = 1000;

    const randle = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const animateTitle = star => {
        star.style.setProperty("--star-left", `${randle(-10, 100)}%`);
        star.style.setProperty("--star-top", `${randle(-40, 80)}%`);

        star.style.animation = "none";
        star.offsetHeight;
        star.style.animation = "";
    }

    for (const star of document.getElementsByClassName("magic-star")) {
        setTimeout(() => {
            animateTitle(star);

            setInterval(() => animateTitle(star), 1000);
        }, initial++ * (interval / 3))
    }


    registrarVisita();
})();


/* ANIMATION SCROLLING */
(() => {
    const lenis = new Lenis();
    // exposto para quem precisa travar o scroll (ex: o painel de vidro)
    window.lenis = lenis;

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);


})();




// CURSOR ANIMATION
// O circulo que segue o ponteiro. Regras desta versao:
//   - o laco nunca e cancelado, entao ele nunca "volta do zero" nem salta;
//   - o amortecimento e por tempo (exp), nao por frame: a 30fps ele chega no
//     ponteiro na mesma velocidade que a 144fps, so com menos quadros. Sem
//     isso, qualquer queda de fps fazia o circulo parecer lento e arrastado;
//   - so escreve no DOM quando a posicao realmente muda, entao com o mouse
//     parado o laco custa praticamente nada;
//   - transform em translate3d + will-change: a atualizacao fica na GPU e nao
//     dispara layout/paint da pagina.
(() => {

    const circleElement = document.querySelector('.circle');
    if (!circleElement) return;

    // ponteiro grosso (touch) nao tem cursor para seguir
    if (!window.matchMedia('(pointer: fine)').matches) {
        circleElement.remove();
        window.cursorFollow = { running: false, stop() {}, start() {} };
        return;
    }

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // rate do amortecimento em 1/s. 11.2 reproduz o antigo lerp de 0.17/frame
    // a 60fps: 1 - e^(-11.2/60) ~= 0.17
    const FOLLOW = 11.2;
    // velocidade (px/s) em que o alongamento chega no maximo
    const MAX_SPEED = 2250;
    // abaixo disso o angulo fica congelado: evita o circulo girar sozinho
    // quando o mouse quase nao se move
    const TURN_SPEED = 300;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let prevPointerX = pointerX;
    let prevPointerY = pointerY;

    let x = pointerX;
    let y = pointerY;
    let stretch = 0;
    let angle = 0;

    let lastTransform = '';
    let last = 0;
    let visible = false;

    const onMove = (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!visible) {
            // primeira posicao conhecida: aparece ja no lugar certo
            visible = true;
            x = pointerX;
            y = pointerY;
            prevPointerX = pointerX;
            prevPointerY = pointerY;
            circleElement.classList.add('is-visible');
        }
    };

    // pointerrawupdate entrega os movimentos sem esperar o frame; o handler so
    // guarda dois numeros, entao o custo extra e irrelevante e a posicao lida
    // no inicio do frame e a mais recente possivel
    if ('onpointerrawupdate' in window) {
        window.addEventListener('pointerrawupdate', onMove, { passive: true });
    } else {
        window.addEventListener('pointermove', onMove, { passive: true });
    }

    const tick = (now) => {
        window.requestAnimationFrame(tick);

        // dt em segundos, limitado: um frame perdido (aba em segundo plano,
        // GC, troca de pagina) faz alpha -> 1 e o circulo gruda no ponteiro em
        // vez de atravessar a tela devagar
        const dt = Math.min(0.1, Math.max(0.001, (now - last) / 1000 || 0.016));
        last = now;

        const dx = pointerX - prevPointerX;
        const dy = pointerY - prevPointerY;
        prevPointerX = pointerX;
        prevPointerY = pointerY;

        const alpha = calm ? 1 : 1 - Math.exp(-FOLLOW * dt);
        x += (pointerX - x) * alpha;
        y += (pointerY - y) * alpha;

        if (!calm) {
            const speed = Math.sqrt(dx * dx + dy * dy) / dt;
            const target = Math.min(speed / MAX_SPEED, 1) * 0.5;
            stretch += (target - stretch) * alpha;
            if (speed > TURN_SPEED) {
                angle = Math.atan2(dy, dx) * 180 / Math.PI;
            }
        }

        // encostou no alvo: encosta de vez e para de escrever no DOM
        if (Math.abs(pointerX - x) < 0.05 && Math.abs(pointerY - y) < 0.05) {
            x = pointerX;
            y = pointerY;
        }
        if (stretch < 0.0005) stretch = 0;

        const transform =
            'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) ' +
            'rotate(' + angle.toFixed(1) + 'deg) ' +
            'scale(' + (1 + stretch).toFixed(3) + ',' + (1 - stretch).toFixed(3) + ')';

        if (transform !== lastTransform) {
            lastTransform = transform;
            circleElement.style.transform = transform;
        }
    };

    window.requestAnimationFrame((now) => {
        last = now;
        tick(now);
    });

    // Liga/desliga a VISIBILIDADE do circulo (o painel de vidro usa isso).
    // O laco continua rodando de proposito: parar e religar era o que fazia o
    // circulo sumir, voltar atrasado e atravessar a tela correndo atras do
    // ponteiro.
    window.cursorFollow = {
        running: true,
        stop() {
            if (!this.running) return;
            this.running = false;
            circleElement.classList.add('circle-off');
        },
        start() {
            if (this.running) return;
            this.running = true;
            circleElement.classList.remove('circle-off');
        }
    };
})();

// ACADEMIC ANIMATION
(() => {

    const topPanels = document.querySelectorAll('.academic-top');
    const bottomPanels = document.querySelectorAll('.academic-bottom');
    const btnStart = document.getElementById('btn-start');
    const glassStage = document.getElementById('glassStage');
    // a bola de vidro da nav: "+" parada, "x" com o painel aberto. Ela
    // substituiu o antigo botao "Rebobinar Animacao", que ficava dentro do
    // painel e disputava espaco com o campo neural.
    const glassToggle = document.getElementById('btn');

    let stageOpen = false;
    // enquanto a cortina esta correndo, clique nao vale: dois rewinds
    // sobrepostos deixariam os timers brigando pelo estado dos paineis
    let busy = false;

    // O painel acompanha a bola de vidro: abre com ela virando "x" e fecha
    // com ela voltando a "+". Monta primeiro (display) e so no frame seguinte
    // dispara a transicao, senao o navegador nao tem estado inicial para
    // animar.
    function openStage() {
        if (!glassStage) return;
        glassStage.classList.add('is-mounted');
        requestAnimationFrame(() => glassStage.classList.add('is-open'));
        if (window.lenis) window.lenis.stop();
        if (window.cursorFollow) window.cursorFollow.stop();
        stageOpen = true;
        setToggleState(true);
    }

    // Fecha sem transicao nenhuma. So deve ser chamado no instante em que os
    // paineis estao no centro cobrindo a tela inteira: a magica acontece fora
    // das cameras e o espectador nunca ve o painel sumindo.
    function closeStage() {
        if (!glassStage) return;
        glassStage.classList.remove('is-open');
        glassStage.classList.remove('is-mounted');
        if (window.lenis) window.lenis.start();
        if (window.cursorFollow) window.cursorFollow.start();
        stageOpen = false;
        setToggleState(false);
    }

    // "+" <-> "x" e o rotulo que o leitor de tela anuncia. Fechado, a bola e
    // so decoracao: nao tem acao, entao tambem nao se apresenta como botao
    // clicavel.
    function setToggleState(isClose) {
        if (!glassToggle) return;
        glassToggle.classList.toggle('is-close', isClose);

        if (isClose) {
            glassToggle.setAttribute('aria-label', 'Fechar o painel de tecnologias');
            glassToggle.removeAttribute('aria-disabled');
            return;
        }

        glassToggle.removeAttribute('aria-disabled');
        glassToggle.setAttribute('aria-label', 'Abrir cartão de apresentação');
    }

    const animationDuration = 1000;
    const maxDelay = 200;
    const totalTransitionTime = animationDuration + maxDelay; // 1800ms
    const centerPauseTime = 800; // 2s no centro

    function startAnimation() {
        if (busy || stageOpen) return;
        busy = true;

        // 1. Entra na tela até se encontrarem
        topPanels.forEach(p => { p.classList.remove('academic-offscreen'); p.classList.add('academic-center'); });
        bottomPanels.forEach(p => { p.classList.remove('academic-offscreen'); p.classList.add('academic-center'); });

        // 2. Aguarda a chegada + pausa de 2s e dispersa
        setTimeout(() => {
            topPanels.forEach(p => { p.classList.remove('academic-center'); p.classList.add('academic-dispersed'); });
            bottomPanels.forEach(p => { p.classList.remove('academic-center'); p.classList.add('academic-dispersed'); });

            // 3. Abre o painel e troca o "+" da nav pelo "x"
            setTimeout(() => {
                btnStart.classList.add('hide');
                openStage();
                busy = false;
            }, totalTransitionTime - centerPauseTime - 100);

        }, totalTransitionTime + centerPauseTime);
    }

    function rewindAnimation() {
        if (busy || !stageOpen) return;
        busy = true;

        // 1. Volta para o centro
        topPanels.forEach(p => { p.classList.remove('academic-dispersed'); p.classList.add('academic-center'); });
        bottomPanels.forEach(p => { p.classList.remove('academic-dispersed'); p.classList.add('academic-center'); });

        // 2. Aguarda a junção no centro + pausa de 2s e esconde para fora da tela
        setTimeout(() => {
            // os paineis estao no centro, cobrindo tudo: e aqui que o painel
            // de vidro sai de cena, sem ninguem ver
            closeStage();

            topPanels.forEach(p => { p.classList.remove('academic-center'); p.classList.add('academic-offscreen'); });
            bottomPanels.forEach(p => { p.classList.remove('academic-center'); p.classList.add('academic-offscreen'); });

            // 3. Reexibe o botão inicial após finalizar a saída
            setTimeout(() => {
                btnStart.classList.remove('hide');
                busy = false;
            }, totalTransitionTime - centerPauseTime - 100);

        }, totalTransitionTime + centerPauseTime);
    }

    // Event listeners
    btnStart.addEventListener('click', startAnimation);

    // Enquanto e "+" a bola nao faz nada; virou "x", ela rebobina.
    if (glassToggle) {
        setToggleState(false);
        glassToggle.addEventListener('click', (event) => {
            event.preventDefault();
            if (!stageOpen) return;
            rewindAnimation();
        });
    }
})();