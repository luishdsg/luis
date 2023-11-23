var all_item_containers = $(".item_container");
var hasClicked = false;

$(document).on("click", ".item_container", function () {
      $(".item_container").removeClass("expanded");
      $(this).addClass("expanded");
      clearInterval(activeInterval);
});

$(".ul_container").hover(function () {
      clearInterval(activeInterval);
      console.log(activeInterval);
});

var active_container = 1;

var activeInterval;

function intervalStart() {
      activeInterval = setInterval(function () {
            $(".item_container").removeClass("expanded");

            $(all_item_containers[active_container]).addClass("expanded");

            active_container += 1;

            if (active_container == 7) {
                  active_container = 0;
            }
      }, 10000);
}

intervalStart();




// ESTER-EGG

