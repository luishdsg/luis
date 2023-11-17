(function () {
    const xp = document.querySelector('.xp-name');

    xp.addEventListener('mouseover', () => {
        document.body.classList.add('mscursor-nocursor');
    });

    xp.addEventListener('mouseout', () => {
        document.body.classList.remove('mscursor-nocursor');
    });

    /*--------------------
Vars
--------------------*/
    let progress = 50;
    let active = 0;

    const speedWheel = 0.02;
    const speedDrag = -0.1;

    const getZindex = (array, index) =>
        array.map((_, i) =>
            index === i ? array.length : array.length - Math.abs(index - i)
        );

    const $items = document.querySelectorAll(".xPcarousel-item");


    const displayItems = (item, index, active) => {
        const zIndex = getZindex([...$items], active)[index];
        item.style.setProperty("--zIndex", zIndex);
        item.style.setProperty("--active", (index - active) / $items.length);
    };

    const animate = () => {
        progress = Math.max(0, Math.min(progress, 80));
        active = Math.floor((progress / 80) * ($items.length - 1));

        $items.forEach((item, index) => displayItems(item, index, active));
    };
    animate();

    $items.forEach((item, i) => {
        item.addEventListener("click", () => {
            progress = (i / $items.length) * 100 + 10;
            animate();
        });
    });

    const handleWheel = (e) => {
        const wheelProgress = e.deltaY * speedWheel;
        progress = progress + wheelProgress;
        animate();
    };

    document.addEventListener("mousewheel", handleWheel);

})();
function infoXp(event) {
    console.log('nfj');
    event = event || window.event;
    var element = event.target || event.srcElement;
    var toolsXP = element.closest('.xPcarousel-item').querySelector('.tools-xp');
    if (toolsXP.classList.contains('hide-tools-xp')) {
          toolsXP.classList.remove('hide-tools-xp');
    } else {
          toolsXP.classList.add('hide-tools-xp');
    }
    document.addEventListener('click', function (e) {
          e = e || window.event;
          if (!e.target.closest('.hide-tools-xp')) {
                toolsXP.classList.remove('hide-tools-xp');
          }
    });
}