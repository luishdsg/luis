
const items = document.querySelectorAll(".xp-un");
const URLs = ["../assets/xp1.png", "../assets/xp2.png", "../assets/xp3.png", "../assets/xp4.png", "../assets/xp5.png"];
var widthScreen = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

const expand = (item, i) => {
  items.forEach((it, ind) => {
    if (i === ind) return;
    it.clicked = false;
    gsap.to(it.querySelector(".back"), {
      backgroundColor: "initial",
      duration: 0.5,
    });
    gsap.to(it, {
      width: item.clicked ? "15vw" : "8vw",
      duration: 2,
      ease: "elastic(1, .6)",
    });
  });

  item.clicked = !item.clicked;
  gsap.to(item, {
    width: item.clicked ? "42vw" : "15vw",
    duration: 2.5,
    ease: "elastic(1, .3)",
  });


  const backDiv = item.querySelector(".back");
  console.log(URLs[i])
  gsap.to(backDiv, {
    backgroundImage: item.clicked ? `url('${URLs[i]}')` : "none",
    duration: 0.5,
  });
};

items.forEach((item, i) => {
  item.clicked = false;
  item.addEventListener("click", () => expand(item, i));
});

// SKILLS
function activate(e) {
  const sKslider = document.querySelector(".sKslider");
  const sKitem = document.querySelectorAll(".sKitem");
  e.target.matches(".next") && sKslider.append(sKitem[0]);
  e.target.matches(".prev") && sKslider.prepend(sKitem[sKitem.length - 1]);
}

document.addEventListener("click", activate, false);