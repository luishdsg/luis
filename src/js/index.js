// FEEDBACK
let mode = "css"
const editor = CodeMirror.fromTextArea(code, {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    scrollbarStyle: "overlay",
    Tab: "indentMore",
    defaultTab: function(cm) {
        if (cm.somethingSelected()) cm.indentSelection("add");
        else cm.replaceSelection("  ", "end");
    },
    mode
})
editor.setOption("theme", "highcontrast-dark")
const x = document.querySelector(".code")
const ro = new ResizeObserver(entries => {
    editor.setSize(x.offsetWidth, x.offsetHeight)
})
ro.observe(document.querySelector(".code-container"))

const changeMode = () => {
    mode = mode === "css" ? "javascript" : "css"
    editor.setOption("mode", mode)
}

function Close() {
    var close = document.getElementById('contact')
    var painel = document.getElementById('painel')
    var blur = document.getElementById('blur')
    close.style.display = 'none';
    blur.style.display = 'none';
    painel.style.display = 'none';


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

//