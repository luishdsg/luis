
function showPreview() {
      const _animationSplash = document.getElementById('_animation-splash');
      const _animationName = document.getElementById('_animation-name');
      const load = document.getElementById('load');
      const body = document.getElementById('body');
      const mainHome = document.getElementById('main-home');
      setTimeout(() => {
            _animationName.classList.add('_end-animation-name');
      }, 3200)
      setTimeout(() => {
            _animationName.classList.add('d-none');
            _animationSplash.classList.add('d-block');
            _animationSplash.classList.add('_animation-splash');
      }, 3400)
      setTimeout(() => {
            load.classList.add('d-none');
            mainHome.classList.add('d-block');
            mainHome.classList.add('show-main-home');
      }, 5400)
      body.style.cursor = 'none';


}
function goodDay() {
      var txt = window.document.getElementById('day')
      var data = new Date()
      var hora = data.getHours()
      var min = data.getMinutes()
      if (hora >= 0 && hora <= 6) {
            txt.innerHTML = `Boa madrugada`
      }
      else if (hora >= 6 && hora <= 12) {
            txt.innerHTML = `Bom dia`
      }
      else if (hora >= 12 && hora <= 18) {
            txt.innerHTML = `Boa Tarde`
      }
      else {
            txt.innerHTML = `Boa Noite`
      }

}
function disableScroll() {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
            document.body.style.overflow = 'auto';
            window.scrollTo(0, scrollY);
      }, 7000);
}
window.addEventListener('load', function () {
      disableScroll();
      showPreview();
      goodDay();

});