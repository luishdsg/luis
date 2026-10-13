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




// cursor ANIMATION
(() => {

    console.clear();
    const circleElement = document.querySelector('.circle');
    const mouse = {
        x: 0,
        y: 0
    };
    const previousMouse = {
        x: 0,
        y: 0
    }
    const circle = {
        x: 0,
        y: 0
    };
    let currentScale = 0;
    let currentAngle = 0;
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    const speed = 0.17;
    let frameId = 0;

    const tick = () => {
        circle.x += (mouse.x - circle.x) * speed;
        circle.y += (mouse.y - circle.y) * speed;
        const translateTransform = `translate(${circle.x}px, ${circle.y}px)`;
        const deltaMouseX = mouse.x - previousMouse.x;
        const deltaMouseY = mouse.y - previousMouse.y;
        previousMouse.x = mouse.x;
        previousMouse.y = mouse.y;
        const mouseVelocity = Math.min(Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 4, 150);
        const scaleValue = (mouseVelocity / 150) * 0.5;
        currentScale += (scaleValue - currentScale) * speed;
        const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;
        const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;
        if (mouseVelocity > 20) {
            currentAngle = angle;
        }
        const rotateTransform = `rotate(${currentAngle}deg)`;
        circleElement.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;
        frameId = window.requestAnimationFrame(tick);
    }

    frameId = window.requestAnimationFrame(tick);

    // Liga/desliga o cursor que segue o ponteiro. Usado pelo painel de vidro:
    // o canvas da rede neural ja consome o frame, e este laco escrevendo
    // transform a cada frame por cima disso pesa sem necessidade.
    window.cursorFollow = {
        running: true,
        stop() {
            if (!this.running) return;
            this.running = false;
            if (frameId) window.cancelAnimationFrame(frameId);
            frameId = 0;
            circleElement.classList.add('circle-off');
        },
        start() {
            if (this.running) return;
            this.running = true;
            circleElement.classList.remove('circle-off');
            // reposiciona antes de voltar, senao ele atravessa a tela
            // vindo de onde parou
            circle.x = mouse.x;
            circle.y = mouse.y;
            previousMouse.x = mouse.x;
            previousMouse.y = mouse.y;
            currentScale = 0;
            frameId = window.requestAnimationFrame(tick);
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
        let isTransitioning = false;
        let loadFinished = false;
        let coordinates = {
            x: 0,
            y: 0
        };
        let stageMetrics = {
            width: 0,
            height: 0,
            columnGap: 0,
            rowGap: 0
        };

        if (selectedIndex < 0) {
            selectedIndex = 0;
        }

        const getGridCoordinates = (indexValue) => ({
            x: indexValue % gridSize,
            y: Math.floor(indexValue / gridSize)
        });
        const galleryFrameOffsets = [{
            x: 0,
            y: 0
        },
        {
            x: -24,
            y: 0
        },
        {
            x: 16,
            y: -10
        },
        {
            x: -12,
            y: 18
        }
        ];
        const translateCanvas = () => {
            const frameOffset = galleryFrameOffsets[selectedIndex];
            const xOffset = -coordinates.x * (stageMetrics.width + stageMetrics.columnGap) + frameOffset.x;
            const yOffset = -coordinates.y * (stageMetrics.height + stageMetrics.rowGap) + frameOffset.y;
            canvas.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
        };

        const syncStageMetrics = () => {
            const stageBox = stage.getBoundingClientRect();
            const canvasStyles = window.getComputedStyle(canvas);
            const columnGap = Number.parseFloat(canvasStyles.columnGap);
            const rowGap = Number.parseFloat(canvasStyles.rowGap);

            stageMetrics = {
                width: stageBox.width,
                height: stageBox.height,
                columnGap: Number.isNaN(columnGap) ? 0 : columnGap,
                rowGap: Number.isNaN(rowGap) ? 0 : rowGap
            };

            translateCanvas();
        };

        const moveToIndex = (indexValue) => {
            coordinates = getGridCoordinates(indexValue);
            translateCanvas();
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

            if (!selectedControl || isTransitioning) {
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
            if (isTransitioning) {
                return;
            }

            event.preventDefault();
            root.classList.toggle("gallery-root--open");
            focusButton.setAttribute("aria-expanded", String(root.classList.contains("gallery-root--open")));
            event.stopPropagation();
        };

        const handleZoomInput = (event) => {
            if (isTransitioning) {
                return;
            }

            setZoom(event.target.value);
        };

        const handleZoomFromWheel = (event) => {
            if (isTransitioning) {
                return;
            }

            const direction = event.deltaY < 0 ? 1 : -1;
            setZoom(currentZoom + direction * zoomStep);
        };

        const handleKeyboard = (event) => {
            const handledKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"]);

            if (!handledKeys.has(event.key) || event.target === zoomControl || isTransitioning) {
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

        const beginTransition = (event) => {
            if (event.target !== canvas && event.target !== viewport) {
                return;
            }

            isTransitioning = true;
            body.classList.add("gallery-is-panning");
        };

        const finishTransition = (event) => {
            if (event.target !== canvas && event.target !== viewport) {
                return;
            }

            isTransitioning = false;
            body.classList.remove("gallery-is-panning");
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
        document.addEventListener("wheel", handleZoomFromWheel, {
            passive: true
        });
        document.addEventListener("keydown", handleKeyboard);

        canvas.addEventListener("transitionrun", beginTransition);
        canvas.addEventListener("transitionstart", beginTransition);
        canvas.addEventListener("transitionend", finishTransition);
        viewport.addEventListener("transitionrun", beginTransition);
        viewport.addEventListener("transitionstart", beginTransition);
        viewport.addEventListener("transitionend", finishTransition);

        setZoom(currentZoom);
        moveToIndex(selectedIndex);
        syncStageMetrics();

        if ("ResizeObserver" in window) {
            const stageResizeObserver = new ResizeObserver(syncStageMetrics);
            stageResizeObserver.observe(stage);
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
    const btnReverse = document.getElementById('btn-reverse');
    const glassStage = document.getElementById('glassStage');

    // O painel acompanha o botao Rebobinar: abre com ele e fecha com ele.
    // Monta primeiro (display) e so no frame seguinte dispara a transicao,
    // senao o navegador nao tem estado inicial para animar.
    function openStage() {
        if (!glassStage) return;
        glassStage.classList.add('is-mounted');
        requestAnimationFrame(() => glassStage.classList.add('is-open'));
        if (window.lenis) window.lenis.stop();
        if (window.cursorFollow) window.cursorFollow.stop();
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
    }

    const animationDuration = 1000;
    const maxDelay = 200;
    const totalTransitionTime = animationDuration + maxDelay; // 1800ms
    const centerPauseTime = 800; // 2s no centro

    function startAnimation() {
        // Oculta o botão de início

        // 1. Entra na tela até se encontrarem
        topPanels.forEach(p => { p.classList.remove('academic-offscreen'); p.classList.add('academic-center'); });
        bottomPanels.forEach(p => { p.classList.remove('academic-offscreen'); p.classList.add('academic-center'); });

        // 2. Aguarda a chegada + pausa de 2s e dispersa
        setTimeout(() => {
            topPanels.forEach(p => { p.classList.remove('academic-center'); p.classList.add('academic-dispersed'); });
            bottomPanels.forEach(p => { p.classList.remove('academic-center'); p.classList.add('academic-dispersed'); });

            // 3. Exibe o botão de rebobinar
            setTimeout(() => {
                btnStart.classList.add('hide');

                btnReverse.classList.add('show');
                openStage();
            }, totalTransitionTime - centerPauseTime - 100);

        }, totalTransitionTime + centerPauseTime);
    }

    function rewindAnimation() {
        // Oculta o botão de rebobinar

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
                btnReverse.classList.remove('show');
                btnStart.classList.remove('hide');
            }, totalTransitionTime - centerPauseTime - 100);

        }, totalTransitionTime + centerPauseTime);
    }

    // Event listeners
    btnStart.addEventListener('click', startAnimation);
    btnReverse.addEventListener('click', rewindAnimation);
})();