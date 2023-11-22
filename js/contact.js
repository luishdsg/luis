let toggled = false;

let barOne = document.getElementById("burger-bar-one");
let barTwo = document.getElementById("burger-bar-two");
let barThree = document.getElementById("burger-bar-three");

function onToggle() {
  if (!toggled) {
    toggled = !toggled;
    TweenLite.to(barOne, 0.5, { strokeDashoffset: -1076 });
    TweenLite.to(barTwo, 0.5, { strokeDashoffset: -1250 });
    TweenLite.to(barThree, 0.5, { opacity: 0, x: -1000 });
  } else {
    toggled = !toggled;
    TweenLite.to(barOne, 0.5, { strokeDashoffset: 0 });
    TweenLite.to(barTwo, 0.5, { strokeDashoffset: 0 });
    TweenLite.to(barThree, 0.5, { opacity: 1, x: 0 });
  }
}


