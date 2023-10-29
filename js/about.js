// Adiciona um ouvinte de evento de rolagem ao documento
function _scrollAbout() {
    const about = document.querySelector('.about');
    if (window.scrollY > 50) {
        about.classList.remove('top-100');
        about.classList.add('show-page');
        about.classList.add('z-1000');
    } else {
        about.classList.add('top-100');
        about.classList.remove('z-1000');
        about.classList.remove('show-page');
    }
    console.log(window.scrollY)
}

function _animationAboutInfo() {



    $(document).ready(function () {
        $(".about-info-title").lettering();
        $(".about-info-button").lettering();
    });
    $(document).ready(function () {
        animation();
    }, 10);

    $('.about-info-button').click(function () {
        animation();
    });
    function animation() {
        var title1 = new TimelineMax();
        title1.to(".about-info-button", 0, { visibility: 'hidden', opacity: 0 })
        title1.staggerFromTo(".about-info-title span", 0.5,
            { ease: Back.easeOut.config(1.7), opacity: 0, bottom: -30 },
            { ease: Back.easeOut.config(1.7), opacity: 1, bottom: 0 }, 0.05);
        title1.to(".about-info-button", 0.2, { visibility: 'visible', opacity: 1 })
    }
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


