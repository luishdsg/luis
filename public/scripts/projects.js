// cards-project-animation-modal
(() => {

const cards = document.querySelectorAll(".card");
const imageModal = document.getElementById("imageModal");
const modalCard = document.getElementById("modalCard");
const modalImageContainer = document.getElementById("modalImageContainer");
const modalContent = document.getElementById("modalContent");
const linkProjects = document.getElementById("linkProjects");
const modalDate = document.getElementById("modalDate");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalClose = document.getElementById("modalClose");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");
const modalCounter = document.getElementById("modalCounter");


let currentIndex = 0;

let currentCard = null;

let isAnimating = false;


cards.forEach((card, index) => {
    card.addEventListener("click", () => {
        if (isAnimating) return;
        currentIndex = index;
        currentCard = cards[currentIndex];
        abrirModal();
    });
});

function carregarCard(index) {
    const card = cards[index];
    const image = card.querySelector("img");
    const info = card.querySelector(".card-info");

    const date = info.querySelector(".info-date");
    const title = info.querySelector(".info-title");
    const text = info.querySelector(".info-text");

    modalContent.style.backgroundImage = `url(${image.src})`;
    modalImageContainer.style.backgroundImage = `url(${image.src})`;
    linkProjects.setAttribute("href", image.dataset.link);

    modalDate.textContent = date.textContent;
    modalTitle.textContent = title.textContent;
    modalText.textContent = text.textContent;

    modalCounter.textContent = `${index + 1} / ${cards.length}`;
}

function abrirModal() {
    const card = cards[currentIndex];
    const image = card.querySelector("img");
    const rect = card.getBoundingClientRect();

    carregarCard(currentIndex);

    isAnimating = true;

    imageModal.classList.add("active");
    document.body.classList.add("modal-open");

    modalCard.style.left = `${rect.left}px`;
    modalCard.style.top = `${rect.top}px`;
    modalCard.style.width = `${rect.width}px`;
    modalCard.style.height = `${rect.height}px`;

    modalCard.style.borderRadius = getComputedStyle(card).borderRadius;

    modalCard.getBoundingClientRect();

    const finalWidth = Math.min(window.innerWidth * 0.80, 1200);
    const finalHeight = Math.min(window.innerHeight * 0.82, 800);

    const finalLeft = (window.innerWidth - finalWidth) / 2;
    const finalTop = (window.innerHeight - finalHeight) / 2;

    const animation = modalCard.animate(
        [
            {
                left: `${rect.left}px`,
                top: `${rect.top}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                borderRadius: getComputedStyle(card).borderRadius
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
        modalCard.style.left = `${finalLeft}px`;
        modalCard.style.top = `${finalTop}px`;
        modalCard.style.width = `${finalWidth}px`;
        modalCard.style.height = `${finalHeight}px`;
        modalCard.style.borderRadius = "18px";

        isAnimating = false;
    });
}

function mudarImagem(direction) {
    if (isAnimating) return;

    let novoIndex = currentIndex + direction;

    if (novoIndex < 0) {
        novoIndex = cards.length - 1;
    }

    if (novoIndex >= cards.length) {
        novoIndex = 0;
    }

    currentIndex = novoIndex;

    modalImageContainer.style.transition =
        "opacity 0.22s ease, transform 0.22s ease";

    modalImageContainer.style.opacity = "0";

    modalImageContainer.style.transform =
        direction > 0
            ? "translateX(-25px)"
            : "translateX(25px)";

    modalContentAnimationOut();

    setTimeout(() => {
        carregarCard(currentIndex);

        modalImageContainer.style.opacity = "1";
        modalImageContainer.style.transform = "translateX(0)";

        modalContentAnimationIn();
    }, 220);
}

function modalContentAnimationOut() {
    modalDate.style.opacity = "0";
    modalTitle.style.opacity = "0";
    modalText.style.opacity = "0";

    modalDate.style.transform = "translateX(20px)";
    modalTitle.style.transform = "translateX(20px)";
    modalText.style.transform = "translateX(20px)";
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

        modalDate.style.transform = "translateX(0)";
        modalTitle.style.transform = "translateX(0)";
        modalText.style.transform = "translateX(0)";
    });
}

modalNext.addEventListener("click", () => mudarImagem(1));

modalPrev.addEventListener("click", () => mudarImagem(-1));

function fecharModal() {
    if (!currentCard || isAnimating) return;

    isAnimating = true;

    const rect = currentCard.getBoundingClientRect();
    const modalRect = modalCard.getBoundingClientRect();

    const animation = modalCard.animate(
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
        imageModal.classList.remove("active");
        document.body.classList.remove("modal-open");

        currentCard = null;
        isAnimating = false;
    });
}

modalClose.addEventListener("click", fecharModal);

imageModal.addEventListener("click", event => {
    if (event.target === imageModal) {
        fecharModal();
    }
});

document.addEventListener("keydown", event => {
    if (!imageModal.classList.contains("active")) return;

    if (event.key === "Escape") {
        fecharModal();
    }

    if (event.key === "ArrowRight") {
        mudarImagem(1);
    }

    if (event.key === "ArrowLeft") {
        mudarImagem(-1);
    }
});

const generateGlowButtons = () => {
    document.querySelectorAll(".modal-close").forEach((button) => {
        let gradientElem = button.querySelector('.gradient');

        if (!gradientElem) {
            gradientElem = document.createElement("div");
            gradientElem.classList.add("gradient");

            button.appendChild(gradientElem);
        }

        button.addEventListener("pointermove", (e) => {
            const rect = button.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            gsap.to(button, {
                "--pointer-x": `${x}px`,
                "--pointer-y": `${y}px`,
                duration: 0.6,
            });

            gsap.to(button, {
                "--button-glow": chroma
                    .mix(
                        getComputedStyle(button)
                        .getPropertyValue("--button-glow-start")
                        .trim(),
                        getComputedStyle(button).getPropertyValue("--button-glow-end").trim(),
                        x / rect.width
                    )
                    .hex(),
                duration: 0.2,
            });
        });
    });
}
document.addEventListener('DOMContentLoaded', generateGlowButtons);
window.addEventListener('resize', generateGlowButtons);

})();
