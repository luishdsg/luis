

// SLIDE-CERTIFICATE

const images = [
  "./assets/univercity.jpg",
  "./assets/coffe.jpg",
  "./assets/dio.jpg",
];

const imageElements = images.map((imageUrl, index) => {
  const img = new Image();
  img.src = imageUrl;
  img.onload = () => console.log(`Image ${index + 1} loaded successfully`);
  img.onerror = (error) => console.error(`Error loading image ${index + 1}:`, error);
  return img;
});

// content setup
const texts = [
  ["UNIEURO", "Engenharia de Software | 2020-2024"],
  ["UDEMY \n", "C# .NET full-stack | atual \nAngular full-stack project | Nov - 2019 \nHtml5, Css3, Js, API, NodeJs & React | Abril - 2020"],
  ["D.I.O", "Git & Git-Hub | Jul - 2020"]
];

rgbKineticSlider = new rgbKineticSlider({
  slideImages: images, // array of images > must be 1920 x 1080
  itemsTitles: texts, // array of titles / subtitles

  backgroundDisplacementSprite:
    "https://images.unsplash.com/photo-1558865869-c93f6f8482af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2081&q=80", // slide displacement image
  cursorDisplacementSprite:
    "https://images.unsplash.com/photo-1558865869-c93f6f8482af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2081&q=80", // cursor displacement image

  cursorImgEffect: true,
  cursorTextEffect: false,
  cursorScaleIntensity: 0.65,
  cursorMomentum: 0.14,

  swipe: true,
  swipeDistance: window.innerWidth * 0.,
  swipeScaleIntensity: 2,
  style: {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
  },
  slideTransitionDuration: 1,
  transitionScaleIntensity: 30,
  transitionScaleAmplitude: 160,

  nav: true,
  navElement: ".main-nav",

  imagesRgbEffect: false,
  imagesRgbIntensity: 0.9,
  navImagesRgbIntensity: 80,

  textsDisplay: true,
  textsSubTitleDisplay: true,
  textsTiltEffect: true,
  googleFonts: ["Dm sans Display:700", "Dm sans:800"],
  buttonMode: false,
  textsRgbEffect: true,
  textsRgbIntensity: 0.03,
  navTextsRgbIntensity: 15,

  textTitleColor: "white",
  textTitleSize: 125,
  mobileTextTitleSize: 125,
  textTitleLetterspacing: 4,

  textSubTitleColor: "white",
  textSubTitleSize: 31,
  mobileTextSubTitleSize: 21,
  textSubTitleLetterspacing: 2,
  textSubTitleOffsetTop: 90,
  mobileTextSubTitleOffsetTop: 90
});
images.push(  "./assets/montain.jpg",);
texts.push(["Prepara Cursos\n", "Montagem manutenção \n e configuração de computadores | Jul - 2016"]);

function Marquee(selector, speed) {
  const parentSelector = document.querySelector(selector);
  const clone = parentSelector.innerHTML;
  const firstElement = parentSelector.children[0];
  let i = 0;
  console.log(firstElement);
  parentSelector.insertAdjacentHTML('beforeend', clone);
  parentSelector.insertAdjacentHTML('beforeend', clone);

  setInterval(function () {
    firstElement.style.marginLeft = `-${i}px`;
    if (i > firstElement.clientWidth) {
      i = 0;
    }
    i = i + speed;
  }, 0);
}
window.addEventListener('load', Marquee('.marquee', 1))