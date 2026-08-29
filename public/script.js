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


registrarVisita();

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// INITIAL STATES + APPLY DATA-ROT
// ============================================================
gsap.set("#nav", {
    opacity: 0,
    y: -20
});
gsap.set(".small-team .word > span", {
    y: "105%"
});
gsap.set(".big-results .letter", {
    y: 80,
    opacity: 0
});
gsap.set("#subline", {
    opacity: 0,
    y: 20
});
gsap.set(".t-card", {
    opacity: 0
});
gsap.set(".stats-inner", {
    opacity: 0
});

// Apply each card's natural rotation as the rest-state, but start them off-screen above + rotated
document.querySelectorAll(".card").forEach((card) => {
    const rot = parseFloat(card.dataset.rot) || 0;
    card.dataset.restRot = rot;
    gsap.set(card, {
        y: -800,
        rotation: rot + 25,
        opacity: 0,
        scale: 0.7
    });
});

// ============================================================
// INTRO TIMELINE
// ============================================================
const intro = gsap.timeline({
    defaults: {
        ease: "power3.out"
    }
});
intro
    .to("#nav", {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, 0.1)
    .to(
        ".small-team .word > span", {
            y: "0%",
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out"
        },
        0.3
    )
    .to(
        ".big-results .letter", {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.05,
            ease: "back.out(1.6)"
        },
        0.55
    )
    .to(
        ".card", {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: (i, el) => parseFloat(el.dataset.restRot) || 0,
            duration: 1.1,
            stagger: {
                each: 0.08,
                from: "center"
            },
            ease: "back.out(1.4)"
        },
        0.8
    )
    .to("#subline", {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, 1.6);

// ============================================================
// CONTINUOUS FLOAT ON CARDS
// ============================================================
document.querySelectorAll(".card").forEach((card, i) => {
    const rot = parseFloat(card.dataset.restRot) || 0;
    gsap.to(card, {
        y: `+=${8 + (i % 3) * 5}`,
        rotation: rot + (i % 2 === 0 ? 1.5 : -1.5),
        duration: 3 + (i % 4) * 0.5,
        delay: 1.8 + i * 0.1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });
});

// ============================================================
// MOUSE PARALLAX ON CARDS
// ============================================================
const hero = document.querySelector(".hero");
let mx = 0,
    my = 0,
    tx = 0,
    ty = 0;
hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
});
hero.addEventListener("mouseleave", () => {
    mx = 0;
    my = 0;
});

function parallax() {
    tx += (mx - tx) * 0.05;
    ty += (my - ty) * 0.05;
    document.querySelectorAll(".card").forEach((card) => {
        const d = parseFloat(card.dataset.depth) || 8;
        card.style.translate = `${tx * d}px ${ty * d * 0.5}px`;
    });
    requestAnimationFrame(parallax);
}
parallax();

// ============================================================
// CARD HOVER 3D LIFT
// ============================================================
document.querySelectorAll(".card").forEach((card) => {
    const restRot = parseFloat(card.dataset.restRot) || 0;
    card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
            rotateX: -py * 16,
            rotateY: px * 16,
            scale: 1.12,
            zIndex: 20,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 700,
            overwrite: "auto"
        });
    });
    card.addEventListener("mouseleave", () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            zIndex: card.style.zIndex || "",
            duration: 0.8,
            ease: "elastic.out(1, 0.6)",
            overwrite: "auto"
        });
    });
    card.addEventListener("click", () => {
        gsap.fromTo(
            card, {
                scale: 1.15
            }, {
                scale: 1.05,
                duration: 0.15,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            }
        );
    });
});

// ============================================================
// SCROLL: CARDS FAN OUT, "big results" SCALES UP
// ============================================================
ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 0.8,
    onUpdate: (self) => {
        const p = self.progress;
        // Big results scales up and stays gray
        gsap.set(".big-results", {
            scale: 1 + 0.15 * p,
            opacity: 1 - 0.4 * p
        });
        // Small team rises out
        gsap.set(".small-team", {
            y: -60 * p,
            opacity: 1 - p * 1.5
        });
        // Cards: outer cards fly further out, center cards drift up more
        const moves = [{
                x: -260,
                y: -40,
                rot: -25
            }, // 1
            {
                x: -200,
                y: 20,
                rot: -18
            }, // 2
            {
                x: -120,
                y: 80,
                rot: -10
            }, // 3
            {
                x: -40,
                y: 120,
                rot: -4
            }, // 4
            {
                x: 40,
                y: 120,
                rot: 4
            }, // 5
            {
                x: 120,
                y: 80,
                rot: 12
            }, // 6
            {
                x: 200,
                y: 20,
                rot: 22
            }, // 7
            {
                x: 260,
                y: -40,
                rot: 28
            } // 8
        ];
        document.querySelectorAll(".card").forEach((card, i) => {
            const m = moves[i];
            const rest = parseFloat(card.dataset.restRot) || 0;
            gsap.set(card, {
                x: m.x * p,
                y: m.y * p,
                rotation: rest + m.rot * p
            });
        });
        gsap.set("#subline", {
            opacity: 1 - p * 2
        });
    }
});

// ============================================================
// TEAM GRID REVEAL ON SCROLL
// ============================================================
gsap.from(".eyebrow, .team-head h2, .team-head p", {
    opacity: 0,
    y: 50,
    duration: 1,
    skewY: 7,
    stagger: 1,
    ease: "power4.out",
    stagger: {
        amount: 0.3
    },
    scrollTrigger: {
        trigger: ".team-head",
        start: "top 80%"
    }
});

gsap.to(".t-card", {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.08,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".team-grid",
        start: "top 80%"
    }
});
gsap.from(".t-card", {
    y: 80,
    scale: 0.9,
    rotation: (i) => (i % 2 === 0 ? -3 : 3),
    duration: 1,
    stagger: 0.08,
    ease: "back.out(1.3)",
    scrollTrigger: {
        trigger: ".team-grid",
        start: "top 80%"
    }
});

// ============================================================
// STATS REVEAL + COUNTERS
// ============================================================
gsap.to(".stats-inner", {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".stats",
        start: "top 80%"
    }
});
gsap.from(".stats-inner", {
    y: 60,
    scale: 0.97,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".stats",
        start: "top 80%"
    }
});

ScrollTrigger.create({
    trigger: ".stats",
    start: "top 75%",
    onEnter: () => {
        document.querySelectorAll(".stat-block .num").forEach((el) => {
            const target = parseFloat(el.dataset.count);
            const span = el.querySelector("span");
            gsap.to({
                v: 0
            }, {
                v: target,
                duration: 2,
                ease: "power2.out",
                onUpdate: function () {
                    span.textContent = Math.floor(this.targets()[0].v).toLocaleString();
                }
            });
        });
    },
    once: true
});

// ============================================================
// CTA / BUTTON CLICKS
// ============================================================
document.querySelectorAll(".nav-cta, .arrow-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
        gsap.fromTo(
            btn, {
                scale: 1
            }, {
                scale: 0.93,
                duration: 0.12,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            }
        );
    });
});

// Big results: subtle letter rise on hover of the wrap
document
    .querySelector(".big-results-wrap")
    .addEventListener("mouseenter", () => {
        gsap.to(".big-results .letter", {
            y: -8,
            duration: 0.5,
            stagger: 0.03,
            ease: "back.out(1.6)"
        });
    });
document
    .querySelector(".big-results-wrap")
    .addEventListener("mouseleave", () => {
        gsap.to(".big-results .letter", {
            y: 0,
            duration: 0.6,
            stagger: 0.03,
            ease: "elastic.out(1, 0.6)"
        });
    });








// new zone
/* suave scroll */

const lenis = new Lenis();

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// + click
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


// cursor
/**
 * YouTube Tutorial:
 * https://youtu.be/wG_5453Vq98
 */

console.clear();

// Select the circle element
const circleElement = document.querySelector('.circle');

// Create objects to track mouse position and custom cursor position
const mouse = {
    x: 0,
    y: 0
}; // Track current mouse position
const previousMouse = {
    x: 0,
    y: 0
} // Store the previous mouse position
const circle = {
    x: 0,
    y: 0
}; // Track the circle position

// Initialize variables to track scaling and rotation
let currentScale = 0; // Track current scale value
let currentAngle = 0; // Track current angle value

// Update mouse position on the 'mousemove' event
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Smoothing factor for cursor movement speed (0 = smoother, 1 = instant)
const speed = 0.17;

// Start animation
const tick = () => {
    // MOVE
    // Calculate circle movement based on mouse position and smoothing
    circle.x += (mouse.x - circle.x) * speed;
    circle.y += (mouse.y - circle.y) * speed;
    // Create a transformation string for cursor translation
    const translateTransform = `translate(${circle.x}px, ${circle.y}px)`;

    // SQUEEZE
    // 1. Calculate the change in mouse position (deltaMouse)
    const deltaMouseX = mouse.x - previousMouse.x;
    const deltaMouseY = mouse.y - previousMouse.y;
    // Update previous mouse position for the next frame
    previousMouse.x = mouse.x;
    previousMouse.y = mouse.y;
    // 2. Calculate mouse velocity using Pythagorean theorem and adjust speed
    const mouseVelocity = Math.min(Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 4, 150);
    // 3. Convert mouse velocity to a value in the range [0, 0.5]
    const scaleValue = (mouseVelocity / 150) * 0.5;
    // 4. Smoothly update the current scale
    currentScale += (scaleValue - currentScale) * speed;
    // 5. Create a transformation string for scaling
    const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;

    // ROTATE
    // 1. Calculate the angle using the atan2 function
    const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;
    // 2. Check for a threshold to reduce shakiness at low mouse velocity
    if (mouseVelocity > 20) {
        currentAngle = angle;
    }
    // 3. Create a transformation string for rotation
    const rotateTransform = `rotate(${currentAngle}deg)`;

    // Apply all transformations to the circle element in a specific order: translate -> rotate -> scale
    circleElement.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;

    // Request the next frame to continue the animation
    window.requestAnimationFrame(tick);
}

// Start the animation loop
tick();


// cards-project
const cards = document.querySelectorAll(".card");

const imageModal =
    document.getElementById("imageModal");

const modalCard =
    document.getElementById("modalCard");

const modalImage =
    document.getElementById("modalImage");

    const modalContent =
    document.getElementById("modalContent");

const modalDate =
    document.getElementById("modalDate");

const modalTitle =
    document.getElementById("modalTitle");

const modalText =
    document.getElementById("modalText");

const modalClose =
    document.getElementById("modalClose");

const modalPrev =
    document.getElementById("modalPrev");

const modalNext =
    document.getElementById("modalNext");

const modalCounter =
    document.getElementById("modalCounter");


let currentIndex = 0;

let currentCard = null;

let isAnimating = false;


/* =========================================
   ABRIR CARD
========================================= */

cards.forEach((card, index) => {

    card.addEventListener("click", () => {

        if (isAnimating) return;

        currentIndex = index;

        currentCard = cards[currentIndex];

        abrirModal();

    });

});


/* =========================================
   CARREGAR INFORMAÇÕES
========================================= */

function carregarCard(index) {

    const card = cards[index];

    const image =
        card.querySelector("img");

    const info =
        card.querySelector(".card-info");


    const date =
        info.querySelector(".info-date");

    const title =
        info.querySelector(".info-title");

    const text =
        info.querySelector(".info-text");


    modalImage.setAttribute("href", image.src);
   
modalContent.style.backgroundImage = `url(${image.src})`;
    modalImage.alt = image.alt;


    modalDate.textContent =
        date.textContent;


    modalTitle.textContent =
        title.textContent;


    modalText.textContent =
        text.textContent;


    modalCounter.textContent =
        `${index + 1} / ${cards.length}`;

}


/* =========================================
   ABRIR MODAL
========================================= */

function abrirModal() {

    const card =
        cards[currentIndex];


    const image =
        card.querySelector("img");


    const rect =
        card.getBoundingClientRect();


    carregarCard(currentIndex);


    isAnimating = true;


    imageModal.classList.add("active");

    document.body.classList.add("modal-open");


    /*
        Começa exatamente onde
        a card está.
    */

    modalCard.style.left =
        `${rect.left}px`;

    modalCard.style.top =
        `${rect.top}px`;

    modalCard.style.width =
        `${rect.width}px`;

    modalCard.style.height =
        `${rect.height}px`;


    modalCard.style.borderRadius =
        getComputedStyle(card).borderRadius;


    /*
        Força o browser a registrar
        o estado inicial.
    */

    modalCard.getBoundingClientRect();


    /*
        TAMANHO FINAL
    */

    const finalWidth =
        Math.min(
            window.innerWidth * 0.80,
            1200
        );


    const finalHeight =
        Math.min(
            window.innerHeight * 0.82,
            800
        );


    const finalLeft =
        (window.innerWidth - finalWidth) / 2;


    const finalTop =
        (window.innerHeight - finalHeight) / 2;


    /*
        TRANSFORMA CARD → MODAL
    */

    const animation =
        modalCard.animate(

            [{

                    left: `${rect.left}px`,

                    top: `${rect.top}px`,

                    width: `${rect.width}px`,

                    height: `${rect.height}px`,

                    borderRadius: getComputedStyle(card)
                        .borderRadius

                },

                {

                    left: `${finalLeft}px`,

                    top: `${finalTop}px`,

                    width: `${finalWidth}px`,

                    height: `${finalHeight}px`,

                    borderRadius: "18px"

                }
            ],

            {

                duration: 700,

                easing: "cubic-bezier(0.16, 1, 0.3, 1)",

                fill: "forwards"

            }
        );


    animation.finished.then(() => {

        modalCard.style.left =
            `${finalLeft}px`;

        modalCard.style.top =
            `${finalTop}px`;

        modalCard.style.width =
            `${finalWidth}px`;

        modalCard.style.height =
            `${finalHeight}px`;

        modalCard.style.borderRadius =
            "18px";


        isAnimating = false;

    });

}


/* =========================================
   TROCAR IMAGEM
========================================= */

function mudarImagem(direction) {

    if (isAnimating) return;


    let novoIndex =
        currentIndex + direction;


    /*
        LOOP
    */

    if (novoIndex < 0) {

        novoIndex =
            cards.length - 1;

    }


    if (novoIndex >= cards.length) {

        novoIndex = 0;

    }


    currentIndex =
        novoIndex;


    /*
        Anima saída
    */

    modalImage.style.transition =
        "opacity 0.22s ease, transform 0.22s ease";

    modalImage.style.opacity = "0";

    modalImage.style.transform =
        direction > 0 ?
        "translateX(-25px)" :
        "translateX(25px)";


    modalContentAnimationOut();


    setTimeout(() => {

        carregarCard(currentIndex);


        modalImage.style.opacity = "1";

        modalImage.style.transform =
            "translateX(0)";


        modalContentAnimationIn();

    }, 220);

}


/* =========================================
   ANIMAÇÃO DO TEXTO
========================================= */

function modalContentAnimationOut() {

    modalDate.style.opacity = "0";

    modalTitle.style.opacity = "0";

    modalText.style.opacity = "0";


    modalDate.style.transform =
        "translateX(20px)";

    modalTitle.style.transform =
        "translateX(20px)";

    modalText.style.transform =
        "translateX(20px)";
}


function modalContentAnimationIn() {

    modalDate.style.transition =
        "all 0.45s cubic-bezier(0.22,1,0.36,1)";

    modalTitle.style.transition =
        "all 0.5s cubic-bezier(0.22,1,0.36,1)";

    modalText.style.transition =
        "all 0.55s cubic-bezier(0.22,1,0.36,1)";


    requestAnimationFrame(() => {

        modalDate.style.opacity = "1";

        modalTitle.style.opacity = "1";

        modalText.style.opacity = "1";


        modalDate.style.transform =
            "translateX(0)";

        modalTitle.style.transform =
            "translateX(0)";

        modalText.style.transform =
            "translateX(0)";

    });

}


/* =========================================
   BOTÕES
========================================= */

modalNext.addEventListener(
    "click",
    () => mudarImagem(1)
);


modalPrev.addEventListener(
    "click",
    () => mudarImagem(-1)
);


/* =========================================
   FECHAR
========================================= */

function fecharModal() {

    if (!currentCard || isAnimating)
        return;


    isAnimating = true;


    const rect =
        currentCard.getBoundingClientRect();


    const modalRect =
        modalCard.getBoundingClientRect();


    const animation =
        modalCard.animate(

            [

                {

                    left: `${modalRect.left}px`,

                    top: `${modalRect.top}px`,

                    width: `${modalRect.width}px`,

                    height: `${modalRect.height}px`

                },

                {

                    left: `${rect.left}px`,

                    top: `${rect.top}px`,

                    width: `${rect.width}px`,

                    height: `${rect.height}px`

                }

            ],

            {

                duration: 600,

                easing: "cubic-bezier(0.22, 1, 0.36, 1)",

                fill: "forwards"

            }

        );


    animation.finished.then(() => {

        imageModal.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "modal-open"
        );


        modalImage.src = "";

        currentCard = null;

        isAnimating = false;

    });

}


modalClose.addEventListener(
    "click",
    fecharModal
);


/* =========================================
   CLICAR NO FUNDO
========================================= */

imageModal.addEventListener(
    "click",
    event => {

        if (
            event.target === imageModal
        ) {

            fecharModal();

        }

    }
);


/* =========================================
   TECLADO
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !imageModal.classList.contains(
                "active"
            )
        ) return;


        if (event.key === "Escape") {

            fecharModal();

        }


        if (event.key === "ArrowRight") {

            mudarImagem(1);

        }


        if (event.key === "ArrowLeft") {

            mudarImagem(-1);

        }

    }
);