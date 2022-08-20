function Close() {
    var close = document.getElementById('contact')
    var painel = document.getElementById('painel')
    var blur = document.getElementById('blur')
    close.style.display = 'none';
    blur.style.display = 'none';
    painel.style.display = 'none';
}

function dropcoockie() {
    document.getElementById("article-coockie").classList.remove("d-block");
}

function start() {
   document.getElementById("article-coockie").classList.add("d-block");

const y = new Date();
document.getElementById("year").innerHTML = y.getFullYear();


    var txt = window.document.getElementById('info')
    var data = new Date()
    var hora = data.getHours()
    if (hora >= 0 && hora <= 6) {
        txt.innerHTML = ` Boa madrugada 🌙 `
    }
    else if (hora >= 6 && hora <= 12) {
        txt.innerHTML = ` Bom dia ⛅ `
    }
    else if (hora >= 12 && hora <= 18) {
        txt.innerHTML = ` Boa Tarde 🌤️ `
    }
    else {
        txt.innerHTML = ` Boa Noite 🌃 `
    }
}

function Open() {
    var close = document.getElementById('contact')
    var blur = document.getElementById('blur')
    close.style.display = 'block';
    blur.style.display = 'block';
}

function OpenFeed() {
    var painel = document.getElementById('painel')
    var blur = document.getElementById('blur')
    blur.style.display = 'block';
    painel.style.display = 'block';
}

function circleOk() {
    const circleok = document.getElementsByClassName('circle-ok')
    var sendfeed = document.getElementById('send-feed')
    circleok[0].style.display = 'block';
    sendfeed.style.display = 'none';

}

function typeWrite(elemento) {
    const textoArray = elemento.innerHTML.split('');
    elemento.innerHTML = ' ';
    textoArray.forEach(function (letra, i) {

        setTimeout(function () {
            elemento.innerHTML += letra;
        }, 55 * i)

    });
}
const titulo = document.querySelector('.titulo-principal');
typeWrite(titulo);



$(document).ready(function () {
    $('#Carousel').carousel({
        interval: 5000
    })
});

//