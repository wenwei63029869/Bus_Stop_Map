$(document).on("ready", function(e) {
    var map = mapModule.createMap();

    // Add "click" eventlistener to filter form
    $('.boarding-sum').on("click", "input", function(e) {
      $("input:checked").removeAttr("checked");
      $(this).prop("checked", true)
      mapModule.applyBoardingFilter(this.value);
    });

    $('#streets').on('input', mapModule.applyStreetsFilter.bind(mapModule));

    // Add "click" eventlisterner to form area except input
    $('#reset-button').on("click", mapModule.resetFilter.bind(mapModule));

    // Add "move" eventlistener to the map
    map.on('move', mapModule.onMove);
});