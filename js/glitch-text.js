
const title = document.querySelector("h1");
if (title) {
      title.addEventListener("mouseenter", () => {
            gsap.to(".distort feDisplacementMap", 1, {
                  attr: {
                        scale: 100
                  },
                  ease: "circ.out"
            });
            gsap.to(".distort feTurbulence", 1, {
                  attr: {
                        baseFrequency: '2.08 .08'
                  },
                  ease: "circ.out"
            }, 1);
            gsap.to(title, 1, {
                  fontVariationSettings: "'wght' 650",
                  ease: "back.out"
            });
      });
      title.addEventListener("mouseleave", () => {
            gsap.to(".distort feDisplacementMap", 1, {
                  attr: {
                        scale: 0
                  },
                  ease: "circ.out"
            }, 1);
            gsap.to(".distort feTurbulence", 1, {
                  attr: {
                        baseFrequency: '2.01 .01'
                  },
                  ease: "circ.out"
            }, 1);
            gsap.to(title, 1, {
                  fontVariationSettings: "'wght' 700",
                  ease: "back.out"
            }, 1);
      });
}


$("h2").each(function (index, element) {
      var animation = TweenMax.to(this, 0.2, {
            className: "+= superShadow",
            marginTop: "-10px",
            marginBottom: "10px",
            ease: Power1.easeIn,
            paused: true
      });
      element.animation = animation;
});

$("h2").hover(
      function () {
            this.animation.play();
      },
      function () {
            this.animation.reverse();
      }
);
