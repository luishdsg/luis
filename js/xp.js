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

    /*--------------------
    Contants
    --------------------*/
    const speedWheel = 0.02;
    const speedDrag = -0.1;

    /*--------------------
    Get Z
    --------------------*/
    const getZindex = (array, index) =>
        array.map((_, i) =>
            index === i ? array.length : array.length - Math.abs(index - i)
        );

    /*--------------------
    Items
    --------------------*/
    const $items = document.querySelectorAll(".xPcarousel-item");


    const displayItems = (item, index, active) => {
        const zIndex = getZindex([...$items], active)[index];
        item.style.setProperty("--zIndex", zIndex);
        item.style.setProperty("--active", (index - active) / $items.length);
    };

    /*--------------------
    Animate
    --------------------*/
    const animate = () => {
        progress = Math.max(0, Math.min(progress, 100));
        active = Math.floor((progress / 100) * ($items.length - 1));

        $items.forEach((item, index) => displayItems(item, index, active));
    };
    animate();

    /*--------------------
    Click on Items
    --------------------*/
    $items.forEach((item, i) => {
        item.addEventListener("click", () => {
            progress = (i / $items.length) * 100 + 10;
            animate();
        });
    });

    /*--------------------
    Handlers
    --------------------*/
    const handleWheel = (e) => {
        const wheelProgress = e.deltaY * speedWheel;
        progress = progress + wheelProgress;
        animate();
    };





    /*--------------------
    Listeners
    --------------------*/
    document.addEventListener("mousewheel", handleWheel);

})();