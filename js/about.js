// Adiciona um ouvinte de evento de rolagem ao documento
function scrollAbout(){
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
document.addEventListener("scroll", function() {
    scrollAbout();

});

