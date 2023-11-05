(function () {
    const xp = document.querySelector('.xp');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let lastScrollTop = 0;
               
                window.addEventListener('scroll', () => {
                    const xpInfo = document.querySelector('.div-a-aumentar');
                    const content = document.getElementById('content');
                    const style = window.getComputedStyle(content);
              
                      const transformValues = style.transform.match(/-?\d+\.?\d*/g);
                        console.log('Terceira posição do translate3d:', transformValues[5]);

                    const currentScroll = window.scrollY || document.documentElement.scrollTop;
                    const somaScroll = (currentScroll) - (currentScroll - currentScroll / 2) - (currentScroll / 3) - (currentScroll / 8);
                    const scrollingDown = currentScroll > lastScrollTop;
                    console.log(somaScroll, currentScroll, scrollingDown, xpInfo.clientWidth)

                    if (scrollingDown) {

                        xpInfo.style.width = `${Math.min(100, somaScroll)}%`;
                        xpInfo.style.height = `${Math.min(100, somaScroll)}%`;
                        xpInfo.classList.add('visible');
                    } else {
                        xpInfo.style.width = `${Math.max(0, somaScroll)}%`;
                        xpInfo.style.height = `${Math.max(0, somaScroll)}%`;

                        if (xpInfo.clientWidth === 0) {
                            xpInfo.classList.remove('visible');
                        }
                    }

                    lastScrollTop = currentScroll;
                });
                observer.disconnect();
            }
        });

    });
    observer.observe(xp);
})();