(function() {
  var map;
  var overlays,
      // layers is used to store the initial layers which includes all the markers.
      layers,
      // contains the most recent displayed markers. All the eventlisteners will be added to this layers container
      clusterGroup,
      customMarker = L.Marker.extend({
         options: {
            boardingSum: 'Custom data!'
         }
      });

  $(document).on("ready", function(e) {
      L.mapbox.accessToken = 'pk.eyJ1Ijoid2Vud2VpNjMwMjk4NjkiLCJhIjoiY2l0bmc5MmFvMDA1MTNvbDRmZ3A4d3B1aiJ9.lJjkZn-QWyhTixwvwdBnaA';
      // Create the map with based layer - "mapbox.steerts"
      map = L.mapbox.map('map').setView([41.8781, -87.6298], 10).addLayer(L.mapbox.tileLayer('mapbox.streets'));
      // Add a second layer for removel previous displayed markers later
      overlays = L.layerGroup().addTo(map);
      // Call getStops to load markers on the map
      getStops(map);
      // Add "click" eventlistener to filter form
      $('.boarding-sum').on("click", "input", function(e) {
        $("input:checked").removeAttr("checked");
        $(this).prop("checked", true)
        showStops(this.value);
      });

      // Add "click" eventlisterner to form area except input
      $('#reset-button').on("click", resetFilter);

      // Add "move" eventlistener to the map
      map.on('move', onMove);
  });

  // This function will get the boundary fo the map and filter out all the markers with lan and long that are within the boundary and print their title to "coordinates" box.
  function onMove() {
      var inBounds = [],
          bounds = map.getBounds();
          count = 0,
          data = [0, 0, 0, 0, 0];
      clusterGroup.eachLayer(function(layer) {
          if (bounds.contains(layer.getLatLng())) {
              var options = layer.options,
                  boardingSum = options.boardingSum;
              inBounds.push(options.title);
              ++count;
              switch(true) {
                case (boardingSum > 0 && boardingSum <= 200) :
                  data[0] += 1;
                  break;
                case (boardingSum > 200 && boardingSum <= 400) :
                  data[1] += 1;
                  break;
                case (boardingSum > 400 && boardingSum <= 600) :
                  data[2] += 1;
                  break;
                case (boardingSum > 600 && boardingSum <= 800) :
                  data[3] += 1;
                  break;
                case (boardingSum > 800) :
                  data[4] += 1;
                  break;
              }
          }
      });
      document.getElementById('coordinates').innerHTML = '<p>Stops: ' + count + '</p>' + inBounds.join('\n');
      ChartModule.createBarChart(data)
  }

  function getStops(map) {
    // Make ajax call to server to get all the stops
    $.ajax({
      dataType: 'text',
      url: '/get_stops.json',
      success:function(stops) {
        var stops = $.parseJSON(stops);
        layers = new L.MarkerClusterGroup();
        // Create marker for each stop
        for (var i = 0; i < stops.length; i++) {
            createNewMarker(stops[i]);
        }
        overlays.addLayer(layers);
        clusterGroup = layers;
        // Add list populate eventlistener to new clusterGroup
        onMove();
        addCenterEventToLayers();
      },
      error:function() {
        alert("Could not load the stops");
      }
    })
  }

  // Create a marker with a stop object and append marker to layers
  function createNewMarker(stop) {
    var title = stop.on_street + ' & ' + stop.cross_street,
        boardingSum = stop.boarding_sum,
        routeNumbers = stop.route_numbers,
        popupContent = '<div class="marker-popup">' + '<h3>' + title + '</h3>' +'<h4>Routes: ' + routeNumbers + '</h4>' + '<h4>Total boardings: ' + boardingSum + '</h4>' + '</div>',
        marker = new customMarker(new L.LatLng(stop.latitude, stop.longitude), {
            icon: L.mapbox.marker.icon({'marker-symbol': 'bus', 'marker-color': '0044FF'}),
            boardingSum: boardingSum,
            title: title
        })
    marker.bindPopup(popupContent, {closeButton: false, minWidth: 300});
    layers.addLayer(marker);
  }

  // Add center eventlistener to clusterGroup
  function addCenterEventToLayers() {
    clusterGroup.on('click', function(e) {
        map.panTo(e.layer.getLatLng());
    });
  }

  // Only show stops with had smaller or the same boardingSum than the selected filter
  function showStops(value) {
    // Erase previously displayed markers(layers)
    overlays.clearLayers();
    // create an empty clusterGroup and add it to overlays
    clusterGroup = new L.MarkerClusterGroup().addTo(overlays);
    layers.eachLayer(function(layer) {
      value = parseInt(value);
      if (value > 0) {
        if (layer.options.boardingSum <= value) {
            clusterGroup.addLayer(layer);
        }
      } else {
        if (layer.options.boardingSum + value > 0) {
            clusterGroup.addLayer(layer);
        }
      }
    });
    // Add center eventlistener to the new clusterGroup
    addCenterEventToLayers();
    // Refresh the Stops panel
    onMove();
  }

  function resetFilter(e) {
    if (e.target !== $("input")) {
      $("input:checked").removeAttr("checked");
      overlays.clearLayers();
      clusterGroup = layers;
      overlays.addLayer(clusterGroup);
      // Add center eventlistener to the new clusterGroup
      addCenterEventToLayers();
      // Refresh the Stops panel
      onMove();
    }
  }
}());