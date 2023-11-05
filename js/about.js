// Adiciona um ouvinte de evento de rolagem ao documento
function _scrollAbout() {
    const about = document.querySelector('.about');
    const aboutCloseBtn = document.querySelector(".about-close-btn");
    const aboutSound = document.querySelector('.about-sound');
    if (window.scrollY > 50) {
        about.classList.remove('top-100');
        about.classList.add('show-page');
        about.classList.add('z-1000');
    } else {
        about.classList.add('top-100');
        about.classList.remove('z-1000');
        aboutSound.style.display = 'none';
        aboutCloseBtn.style.display = 'none';
    }
    // console.log(window.scrollY)
}

function _animationAboutInfo() {
    const aboutInfo = document.querySelector('.about-info');
    const aboutCloseBtn = document.querySelector(".about-close-btn");
    const aboutSound = document.querySelector('.about-sound');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(document).ready(function () {
                    animation();
                }, 10);
                $('.about-info-button').click(function () {
                    animation();
                });
                function animation() {
                    var title1 = new TimelineMax();
                    var audio = document.getElementById("about-learn");
                    audio.play();
                    aboutSound.style.display = 'block';
                    aboutCloseBtn.style.display = 'flex';
                    title1.to(".about-info-button", 0, { visibility: 'hidden', opacity: 0 })
                    title1.staggerFromTo(".about-info-title span", 0.5,
                        { ease: Back.easeOut.config(1.7), opacity: 0, bottom: -30 },
                        { ease: Back.easeOut.config(1.7), opacity: 1, bottom: 0 }, 0.05);
                    title1.to(".about-info-button", 0.2, { visibility: 'visible', opacity: 1 })
                }
                observer.disconnect();
            }else{
                console.log('sssd')
            }
        });
       
    });
    observer.observe(aboutInfo);
    $(document).ready(function () {
        $(".about-info-title").lettering();
        $(".about-info-button").lettering();
    });
}

function adjustViewBox() {
    const abouWord = document.getElementById("about-word");
  
    if (window.innerWidth <= 1300) {
        abouWord.setAttribute("viewBox", "0 0 245 80");
    } else {
        abouWord.setAttribute("viewBox", "0 0 280 80");
    }
  }
  
  // Verifica a largura da janela quando a página é carregada e redimensionada
  window.addEventListener('load', adjustViewBox);
  window.addEventListener('resize', adjustViewBox);
  

function _aboutSound() {
    const audio = document.getElementById("about-learn");
    const aboutCloseBtn = document.querySelector(".about-close-btn");
    const aboutSound = document.querySelector('.about-sound');
        audio.pause();
        aboutSound.style.display = 'none';
        aboutCloseBtn.style.display = 'none';
}

document.addEventListener("scroll", function () {
    _scrollAbout();
});
window.addEventListener('load', function () {
    _animationAboutInfo();

});

function won() {
    var audio = document.getElementById("won");
    audio.play();
}
function flat() {
    var audio = document.getElementById("flat");
    audio.play();
}
function clicked() {
    var audio = document.getElementById("clicked");
    audio.play();
}

