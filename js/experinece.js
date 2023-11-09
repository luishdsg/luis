(function () {
    const xp = document.querySelector('.bg-info');
    
    xp.addEventListener('mouseover', () => {
        document.body.classList.add('mscursor-nocursor');
    });

    xp.addEventListener('mouseout', () => {
        document.body.classList.remove('mscursor-nocursor');
    });
})();