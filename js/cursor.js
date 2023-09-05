document.addEventListener("DOMContentLoaded", function () {
    var fill = "#FE019A";
    var stroke = "black";
    var radius = 5;
  
    document.body.addEventListener("mousemove", function (e) {
      var mouseX = e.pageX;
      var mouseY = e.pageY;
      render(mouseX, mouseY);
    });
  
    document.body.addEventListener("mousedown", function (e) {
      radius = 7;
      fill = "black";
      stroke = "#FE019A";
      render(mouseX, mouseY);
    });
  
    document.body.addEventListener("mouseup", function (e) {
      fill = "#FE019A";
      stroke = "black";
      radius = 5;
      render(mouseX, mouseY);
    });
  
    var mouseX = 0;
    var mouseY = 0;
  
    function render(mouseX, mouseY) {
      var svgElement = document.getElementById("SVG");
      svgElement.innerHTML =
        '<line x1="0" y1="0" x2="' +
        mouseX +
        '" y2="' +
        mouseY +
        '" stroke="#D1768F" stroke-width="0.8"></line>' +
        '<line x1="0" y1="100%" x2="' +
        mouseX +
        '" y2="' +
        mouseY +
        '" stroke="#D1768F" stroke-width="0.8"></line>' +
        '<line x1="100%" y1="100%" x2="' +
        mouseX +
        '" y2="' +
        mouseY +
        '" stroke="#D1768F" stroke-width="0.8"></line>' +
        '<line x1="100%" y1="0" x2="' +
        mouseX +
        '" y2="' +
        mouseY +
        '" stroke="#D1768F" stroke-width="0.8"></line>' +
        '<circle cx="' +
        mouseX +
        '" cy="' +
        mouseY +
        '" r="' +
        radius +
        '" stroke="' +
        stroke +
        '" stroke-width="2" fill="' +
        fill +
        '" id="mouse"/>';
    }
  });
  