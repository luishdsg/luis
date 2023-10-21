function showPreview() {
      const _transitionHome = document.getElementById('_start-transition-home');
      const load = document.getElementById('load');
      const body = document.getElementById('body');
      const mainHome = document.getElementById('main-home');
      const _startTransitionCol = document.getElementById('_start-transition-col');
      const _startTransitionCol1 = document.querySelector('._start-transition-col > .col:nth-child(1) > div');
      const _startTransitionCol2 = document.querySelector('._start-transition-col > .col:nth-child(2) > div');
      const _startTransitionCol3 = document.querySelector('._start-transition-col > .col:nth-child(3) > div');
      const _startTransitionCol4 = document.querySelector('._start-transition-col > .col:nth-child(4) > div');
      const _startTransitionCol5 = document.querySelector('._start-transition-col > .col:nth-child(5) > div');
      setTimeout(() => {
            load.classList.add('d-none');
            _transitionHome.classList.add('top-0');
            mainHome.classList.add('show-main-home');
      }, 40)
      setTimeout(() => {
            _transitionHome.classList.remove('_start-transition-home');
            _transitionHome.classList.remove('top-0');
            _transitionHome.classList.add('_end-transition-home');
      }, 49)
      setTimeout(() => {
            _startTransitionCol3.classList.remove('_start-transition-col-3');
            _startTransitionCol3.classList.add('h-600');
            _startTransitionCol3.classList.add('_start-zoom-col-3');
      }, 55)
      setTimeout(() => {
            _startTransitionCol.classList.add('d-none');
            mainHome.classList.add('d-block');
      }, 67)


      setTimeout(() => {
            _transitionHome.classList.add('d-none');
      }, 77)
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

window.addEventListener('load', function () {
      showPreview();
      goodDay();
});