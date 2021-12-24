function Close() {
    var close = document.getElementById('contact')
    var blur = document.getElementById('blur')
    close.style.display = 'none';
    blur.style.display = 'none';

}

function Open() {
    var close = document.getElementById('contact')
    var blur = document.getElementById('blur')
    close.style.display = 'block';
    blur.style.display = 'block';
}

function typeWrite(elemento) {
    const textoArray = elemento.innerHTML.split('');
    elemento.innerHTML = ' ';
    textoArray.forEach(function(letra, i) {

        setTimeout(function() {
            elemento.innerHTML += letra;
        }, 55 * i)

    });
}
const titulo = document.querySelector('.titulo-principal');
typeWrite(titulo);


const y = new Date();
document.getElementById("year").innerHTML = y.getFullYear();

$(document).ready(function() {
    $('#Carousel').carousel({
        interval: 5000
    })
});