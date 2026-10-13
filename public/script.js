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



// ANIMATION OPENING SECTION JOBS
(() => {

    const div = document.querySelector("#jobs");
    const letter1 = document.querySelector("#letter-1");
    const letter2 = document.querySelector("#letter-2");
    const letter3 = document.querySelector("#letter-3");
    const letter4 = document.querySelector("#letter-4");

    let jaAnimou = false;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !jaAnimou) {
                    jaAnimou = true;


                    rolarAteFinalDaDiv(div);
                    iniciarSequencia();

                    observer.unobserve(div);
                }
            });
        }, {
        threshold: 0
    }
    );

    observer.observe(div);

    function iniciarSequencia() {
        div.classList.add("ativo");
        setTimeout(() => {
            letter1.classList.add("letter-1");
        }, 100);
        setTimeout(() => {
            letter2.classList.add("letter-2");
        }, 200);
        setTimeout(() => {
            letter3.classList.add("letter-3");
        }, 300);
        setTimeout(() => {
            letter4.classList.add("letter-4");
        }, 1000);

    }

    function rolarAteFinalDaDiv(elemento) {
        const inicio = window.scrollY;

        const destino = elemento.offsetTop + elemento.offsetHeight - window.innerHeight;

        const destinoLimitado = Math.max(0, destino);

        const distancia = destinoLimitado - inicio;
        const duracao = 1400;
        const tempoInicial = performance.now();

        function animarScroll(tempoAtual) {
            const progresso = Math.min((tempoAtual - tempoInicial) / duracao, 1);

            const suavizado = easeOutExpo(progresso);

            window.scrollTo(0, inicio + distancia * suavizado);

            if (progresso < 1) {
                requestAnimationFrame(animarScroll);
            }
        }

        requestAnimationFrame(animarScroll);
    }

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
})();

// INTERACTIVE JOBS CARDS
(() => {
    "use strict";

    const galleryAssets = [
        "./assets/myeshop.png",
        "./assets/tgt.png",
        "./assets/imovestock.png",
        "./assets/mocar.png",
    ];

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const toOptionNumber = (indexValue) => String(indexValue + 1).padStart(2, "0");

    function initGallery() {
        const root = document.documentElement;
        const body = document.body;
        const stage = document.querySelector("#gallery-stage");
        const viewport = document.querySelector("#gallery-viewport");
        const canvas = document.querySelector("#gallery-canvas");
        const focusButton = document.querySelector("#gallery-focus-button");
        const backButton = document.querySelector("#gallery-back-button");
        const zoomControl = document.querySelector("#gallery-zoom-control");
        const galleryItems = Array.from(canvas.querySelectorAll(".gallery-option"));
        const gridSize = Number.parseInt(stage.dataset.galleryGridSize, 10) || 2;
        const zoomStep = Number.parseFloat(zoomControl.step) || 0.05;
        const minZoom = Number.parseFloat(zoomControl.min);
        const maxZoom = Number.parseFloat(zoomControl.max);
        let selectedIndex = galleryItems.findIndex((item) => item.classList.contains("gallery-option--selected"));
        let currentZoom = Number.parseFloat(zoomControl.value);
        let loadFinished = false;
        let coordinates = {
            x: 0,
            y: 0
        };
        let stageMetrics = {
            width: 0,
            height: 0
        };

        if (selectedIndex < 0) {
            selectedIndex = 0;
        }

        const getGridCoordinates = (indexValue) => ({
            x: indexValue % gridSize,
            y: Math.floor(indexValue / gridSize)
        });

        // CENTRALIZACAO
        // A conta antiga reconstruia a posicao da celula a partir de
        // stage.getBoundingClientRect() + os gaps lidos no CSS, e ainda somava
        // um deslocamento fixo por indice (galleryFrameOffsets). Resultado: a
        // imagem seleciona parava fora do centro -- o rect e afetado por
        // qualquer transform/escala de ancestral (a secao #jobs anima), e os
        // offsets de -24/+16/-12px desalinhavam de proposito, inclusive do
        // botao de foco, que e centrado pelo CSS.
        // Agora le-se a posicao real da celula no layout: offsetLeft/offsetTop
        // sao relativos ao canvas, imunes a transform, e ja embutem o gap.
        let lastCanvasTransform = "";

        const centerSelected = (instant) => {
            const item = galleryItems[selectedIndex];

            if (!item) {
                return;
            }

            const xOffset = (viewport.clientWidth - item.offsetWidth) / 2 - item.offsetLeft;
            const yOffset = (viewport.clientHeight - item.offsetHeight) / 2 - item.offsetTop;
            const transform = `translate3d(${xOffset.toFixed(2)}px, ${yOffset.toFixed(2)}px, 0)`;

            if (transform === lastCanvasTransform) {
                return;
            }

            lastCanvasTransform = transform;

            // resize / primeira pintura nao devem animar: o canvas iria
            // deslizar de 0,0 ate o lugar certo na frente do usuario
            if (instant) {
                canvas.classList.add("gallery-canvas--instant");
                canvas.style.transform = transform;
                void canvas.offsetWidth;
                canvas.classList.remove("gallery-canvas--instant");
                return;
            }

            canvas.style.transform = transform;
        };

        const syncStageMetrics = () => {
            stageMetrics = {
                width: viewport.clientWidth,
                height: viewport.clientHeight
            };

            centerSelected(true);
        };

        const moveToIndex = (indexValue) => {
            coordinates = getGridCoordinates(indexValue);
            centerSelected(false);
        };

        const setZoom = (zoomValue) => {
            currentZoom = clamp(Number.parseFloat(zoomValue), minZoom, maxZoom);
            stage.style.setProperty("--gallery-zoom", currentZoom.toFixed(2));
            zoomControl.value = currentZoom.toFixed(2);
        };

        const setSelectedClasses = (indexValue, shouldSelect) => {
            const optionClassMethod = shouldSelect ? "add" : "remove";

            galleryItems[indexValue].classList[optionClassMethod]("gallery-option--selected", "selected");
        };

        const makeSelection = (nextIndex) => {
            if (nextIndex === selectedIndex || nextIndex < 0 || nextIndex >= galleryItems.length) {
                return;
            }

            setSelectedClasses(selectedIndex, false);
            selectedIndex = nextIndex;
            setSelectedClasses(selectedIndex, true);
            moveToIndex(selectedIndex);
        };

        const handleSelection = (event) => {
            const selectedControl = event.target.closest("[data-gallery-index]");

            if (!selectedControl) {
                return;
            }

            const nextIndex = Number.parseInt(selectedControl.dataset.galleryIndex, 10);

            if (Number.isNaN(nextIndex) || nextIndex === selectedIndex) {
                return;
            }

            event.preventDefault();
            makeSelection(nextIndex);
            event.stopPropagation();
        };

        const handleToggleOpen = (event) => {
            event.preventDefault();
            root.classList.toggle("gallery-root--open");
            focusButton.setAttribute("aria-expanded", String(root.classList.contains("gallery-root--open")));
            event.stopPropagation();
        };

        const handleZoomInput = (event) => {
            setZoom(event.target.value);
        };

        // A roda so mexe no zoom quando o gesto e MESMO de zoom: ponteiro
        // sobre o palco + ctrl/cmd (o mesmo gesto do pinch no trackpad, que
        // chega como wheel + ctrlKey). Antes o listener estava no document
        // inteiro e sem condicao nenhuma: rolar a pagina em qualquer lugar
        // mexia no zoom das imagens.
        const handleZoomFromWheel = (event) => {
            if (!event.ctrlKey && !event.metaKey) {
                return;
            }

            if (root.classList.contains("gallery-root--open")) {
                return;
            }

            if (!event.target.closest("#gallery-stage")) {
                return;
            }

            // segura o zoom nativo do navegador, ja que o gesto foi consumido
            event.preventDefault();

            const direction = event.deltaY < 0 ? 1 : -1;
            setZoom(currentZoom + direction * zoomStep);
        };

        const handleKeyboard = (event) => {
            const handledKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"]);

            if (!handledKeys.has(event.key) || event.target === zoomControl) {
                return;
            }

            // mesmo problema da roda: o listener e do document, entao as setas
            // da galeria engoliam a rolagem por teclado da pagina inteira. So
            // responde quando a galeria esta aberta ou com o foco dentro dela.
            const galleryHasFocus =
                root.classList.contains("gallery-root--open") ||
                stage.contains(document.activeElement);

            if (!galleryHasFocus) {
                return;
            }

            event.preventDefault();

            if (event.key === "Enter") {
                handleToggleOpen(event);
                return;
            }

            let nextX = coordinates.x;
            let nextY = coordinates.y;
            const maxCoordinate = gridSize - 1;

            if (event.key === "ArrowLeft") {
                nextX -= 1;
            }

            if (event.key === "ArrowRight") {
                nextX += 1;
            }

            if (event.key === "ArrowUp") {
                nextY -= 1;
            }

            if (event.key === "ArrowDown") {
                nextY += 1;
            }

            coordinates = {
                x: clamp(nextX, 0, maxCoordinate),
                y: clamp(nextY, 0, maxCoordinate)
            };

            makeSelection(coordinates.y * gridSize + coordinates.x);
            event.stopPropagation();
        };

        // A trava existe so para ligar o will-change durante o pan. Ela NAO
        // bloqueia mais clique/teclado: uma transicao interrompida dispara
        // transitioncancel (que nao era escutado), a trava ficava presa em
        // true e a galeria parava de responder de vez.
        let transitionTimer = 0;

        const finishTransition = (event) => {
            if (event && event.target !== canvas && event.target !== viewport) {
                return;
            }

            if (event && event.propertyName !== "transform") {
                return;
            }

            window.clearTimeout(transitionTimer);
            transitionTimer = 0;
            body.classList.remove("gallery-is-panning");
        };

        const beginTransition = (event) => {
            if (event.target !== canvas && event.target !== viewport) {
                return;
            }

            if (event.propertyName !== "transform") {
                return;
            }

            body.classList.add("gallery-is-panning");

            // rede de seguranca: se nenhum evento de fim chegar (aba oculta,
            // transicao substituida no meio), a trava cai sozinha
            window.clearTimeout(transitionTimer);
            transitionTimer = window.setTimeout(finishTransition, 1400);
        };

        const buildResponsiveAssetUrl = (assetUrl) => {
            const requestedWidth = Math.max(640, Math.round(stageMetrics.width * 1.5));
            const requestedHeight = Math.max(480, Math.round(stageMetrics.height * 1.5));

            return assetUrl
                .replace(/w=\d+/g, `w=${requestedWidth}`)
                .replace(/h=\d+/g, `h=${requestedHeight}`);
        };

        const markGalleryLoaded = () => {
            if (loadFinished) {
                return;
            }

            loadFinished = true;
            root.classList.remove("gallery-root--loading");
            root.classList.add("gallery-root--loaded");
        };

        const loadGalleryImages = () => {
            let finishedAssets = 0;
            const fallbackTimer = window.setTimeout(markGalleryLoaded, 3500);

            const completeImageLoad = () => {
                finishedAssets += 1;

                if (finishedAssets === galleryItems.length) {
                    window.clearTimeout(fallbackTimer);
                    window.setTimeout(markGalleryLoaded, 300);
                }
            };

            galleryItems.forEach((galleryOption, optionIndex) => {
                const optionNumber = toOptionNumber(optionIndex);
                const galleryOptionImage = new Image();

                galleryOptionImage.id = `gallery-image-option-${optionNumber}`;
                galleryOptionImage.className = `gallery-option-image gallery-option-image--${optionNumber}`;
                galleryOptionImage.dataset.galleryIndex = String(optionIndex);
                galleryOptionImage.alt = `Imagem da galeria ${optionIndex + 1}`;
                galleryOptionImage.crossOrigin = "anonymous";
                galleryOptionImage.onload = completeImageLoad;
                galleryOptionImage.onerror = () => {
                    galleryOption.classList.add("gallery-option--image-error");
                    completeImageLoad();
                };
                galleryOptionImage.src = buildResponsiveAssetUrl(galleryAssets[optionIndex]);
                galleryOption.replaceChildren(galleryOptionImage);
            });
        };

        canvas.addEventListener("click", handleSelection, false);
        focusButton.addEventListener("click", handleToggleOpen, false);
        backButton.addEventListener("click", handleToggleOpen, false);
        zoomControl.addEventListener("input", handleZoomInput);
        stage.addEventListener("wheel", handleZoomFromWheel, {
            passive: false
        });
        document.addEventListener("keydown", handleKeyboard);

        [canvas, viewport].forEach((element) => {
            element.addEventListener("transitionrun", beginTransition);
            element.addEventListener("transitionend", finishTransition);
            element.addEventListener("transitioncancel", finishTransition);
        });

        setZoom(currentZoom);
        coordinates = getGridCoordinates(selectedIndex);
        syncStageMetrics();

        if ("ResizeObserver" in window) {
            // o canvas tambem: mudanca de gap/breakpoint muda a posicao da
            // celula sem mudar o tamanho do palco
            const galleryResizeObserver = new ResizeObserver(syncStageMetrics);
            galleryResizeObserver.observe(stage);
            galleryResizeObserver.observe(canvas);
        }

        window.addEventListener("resize", syncStageMetrics);
        loadGalleryImages();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initGallery, {
            once: true
        });
    } else {
        initGallery();
    }
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

        glassToggle.setAttribute('aria-disabled', 'true');
        glassToggle.removeAttribute('aria-label');
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
            rewindAnimation();
        });
    }
})();