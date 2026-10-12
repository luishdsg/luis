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

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);


})();


// CONTACT MODAL
(() => {
    const btn = document.getElementById("btn");
    const glassContainer =
        document.getElementById("glassContainer");
    btn.addEventListener("click", () => {
        if (!glassContainer.classList.contains("glassContainerActive")) {
            glassContainer.classList.add("glassContainerActive");
            glassContainer.classList.remove("glassContainerInactive");

        } else if (glassContainer.classList.contains("glassContainerActive")) {
            glassContainer.classList.add("glassContainerInactive");
            glassContainer.classList.remove("glassContainerActive");

        }
    });
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
        window.requestAnimationFrame(tick);
    }

    tick();


})();


// skills section
(() => {

    const elts = {
        habilidades: document.getElementById("habilidades"),
        skills: document.getElementById("skills")
    };

    // The strings to morph between. You can change these to anything you want!
    const texts = [
        "Habilidades",
        "Skills",
        "Tecnologias",
        "Aptidões",
        "Competências",

    ];

    // Controls the speed of morphing.
    const morphTime = 1;
    const cooldownTime = 0.25;

    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;

    elts.habilidades.textContent = texts[textIndex % texts.length];
    elts.skills.textContent = texts[(textIndex + 1) % texts.length];

    function doMorph() {
        morph -= cooldown;
        cooldown = 0;

        let fraction = morph / morphTime;

        if (fraction > 1) {
            cooldown = cooldownTime;
            fraction = 1;
        }

        setMorph(fraction);
    }

    // A lot of the magic happens here, this is what applies the blur filter to the text.
    function setMorph(fraction) {
        // fraction = Math.cos(fraction * Math.PI) / -2 + .5;

        elts.skills.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        elts.skills.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        fraction = 1 - fraction;
        elts.habilidades.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        elts.habilidades.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        elts.habilidades.textContent = texts[textIndex % texts.length];
        elts.skills.textContent = texts[(textIndex + 1) % texts.length];
    }

    function doCooldown() {
        morph = 0;

        elts.skills.style.filter = "";
        elts.skills.style.opacity = "100%";

        elts.habilidades.style.filter = "";
        elts.habilidades.style.opacity = "0%";
    }

    // Animation loop, which is called every frame.
    function animate() {
        requestAnimationFrame(animate);

        let newTime = new Date();
        let shouldIncrementIndex = cooldown > 0;
        let dt = (newTime - time) / 1000;
        time = newTime;

        cooldown -= dt;

        if (cooldown <= 0) {
            if (shouldIncrementIndex) {
                textIndex++;
            }

            doMorph();
        } else {
            doCooldown();
        }
    }

    // Start the animation.
    animate();
})();


// ANIMATION JOBS TITLE
(() => {

    var TextSlider = function () {
        this.container = $('#home-animation-wrapper');
        this.currentSlide = 1;
        this.slidesLength = this.container.find('.slide').length - 1; // To start at 0
        this.content = {
            text1: '',
            text2: '',
            text3: ''
        };

        this.allowChange = true;

        this.init();
    };

    TextSlider.prototype = {

        init: function () {
            console.log('init');

            this.bind();

            this.initSvg();

        },

        bind: function () {
            console.log('bind');

            var self = this;

            // Bind interval
            var timerDuration = 4000,
                timer = setInterval(function () {
                    self.resetSlide();
                }, timerDuration);

            // Bind restart on click with next slide
            this.container.on('click', function () {

                // Do not allow to change slide until last transition is complete
                if (!self.allowChange) {
                    return;
                }
                self.allowChange = false;
                setTimeout(function () {
                    self.allowChange = true;
                }, 800);

                self.resetSlide();

                clearInterval(timer);
                timer = setInterval(function () {
                    self.resetSlide();
                }, timerDuration);


            });


        },

        initSvg: function () {
            console.log('initSvg');

            this.bubblesRandomColors();
            this.setTexts();
            this.triggerSlide();
        },

        setTexts: function () {
            console.log('setTexts');

            var texts = this.container.find('#svg-texts');

            // Get texts
            this.content.text1 = this.container.find('.slide[count="' + this.currentSlide + '"]').attr('data-1');
            this.content.text2 = this.container.find('.slide[count="' + this.currentSlide + '"]').attr('data-2');
            this.content.text3 = this.container.find('.slide[count="' + this.currentSlide + '"]').attr('data-3');

            // UpperCase Texts
            this.content.text1 = this.content.text1.toUpperCase();
            this.content.text2 = this.content.text2.toUpperCase();
            this.content.text3 = this.content.text3.toUpperCase();

            // Append Texts
            texts.find('text:nth-child(1)').html(this.content.text1);
            texts.find('text:nth-child(2)').html(this.content.text2);
            texts.find('text:nth-child(3)').html(this.content.text3);
        },

        bubblesRandomColors: function () {
            console.log('bubblesRandomColors');

            var bubblesGroup = this.container.find('#bubbles'),
                colors = ['#7700ff', '#f58b4e', '#112b39'];

            bubblesGroup.find('path').each(function () {
                var rand = getRand(0, colors.length);
                TweenMax.set(this, {
                    fill: colors[rand],
                    scale: 0,
                    transformOrigin: 'center'
                });
            })
        },

        triggerSlide: function () {
            console.log('triggerSlide');

            // Container loads invisible, needs this to be shown on the first iteration
            TweenMax.set(this.container, {
                autoAlpha: 1
            });

            var bubbles = this.container.find('#bubbles path');
            bubbles.each(function () {
                var rotateRand = getRand(-30, 30);
                TweenMax.to(this, 1.5, {
                    scale: 1.2,
                    rotation: rotateRand,
                    ease: Power2.easeInOut
                });
            })
        },

        resetSlide: function () {
            console.log('hideSlide');

            var self = this;

            this.currentSlide++;
            if (this.currentSlide > this.slidesLength) {
                this.currentSlide = 0;
            };

            var bubbles = this.container.find('#bubbles path');
            TweenMax.to(bubbles, 1.5, {
                scale: 0,
                ease: Power2.easeInOut,
                onComplete: triggerContinue
            });

            // Workaround gsap onComplete
            function triggerContinue() {
                self.initSvg();
            }
        },


    }

    function getRand(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    window.LLOS = window.LLOS || {};
    if ($('#home-animation-wrapper').length) {
        window.LLOS.TextSlider = new TextSlider();
    }

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