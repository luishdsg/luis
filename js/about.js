const text1 = "Sou um desenvolvedor front-end com mais de um ano de experiência. Minhas habilidades incluem ";
const text2 = "(HTML5, CSS3, jQuery, REST API, iONIC, Angular, Node.js TypeScript,JavaScript. . .etc)";
const text3 = "Tenho expertise em manutenção de sites e aplicações web, além de trabalhar com bibliotecas como React e Bootstrap 5";
const text4 = "Estou focado em entregar soluções de alta performance para atender às demandas do mercado.";

const lineElement = document.querySelector('.line');
const lineElement2 = document.querySelector('.line2');
const lineElement3 = document.querySelector('.line3');
const lineElement4 = document.querySelector('.line4');

function typeText(text, element, callback) {
    let i = 0;
    const interval = setInterval(function() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
            if (typeof callback === 'function') {
                callback();
            }
        }
    }, 100); 
}

window.addEventListener('load', function() {
    typeText(text1, lineElement, function() {
        typeText(text2, lineElement2, function() {
            typeText(text3, lineElement3, function() {
                typeText(text4, lineElement4);
            });
        });
    });
});
