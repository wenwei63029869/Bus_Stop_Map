var mapModule = (function() {
  var map,
      overlays,
      // layers is used to store the initial layers which includes all the markers.
      layers,
      // contains the most recent displayed markers. All the eventlisteners will be added to this layers container
      clusterGroup,
      accessToken = 'pk.eyJ1Ijoid2Vud2VpNjMwMjk4NjkiLCJhIjoiY2l0bmc5MmFvMDA1MTNvbDRmZ3A4d3B1aiJ9.lJjkZn-QWyhTixwvwdBnaA',
      customMarker = L.Marker.extend({
         options: {
            boardingSum: 'Custom data!'
         }
      });

  return {
    createMap: function() {
      var that = this;
      L.mapbox.accessToken = accessToken;
      // Create the map with based layer - "mapbox.steerts"
      map = L.mapbox.map('map').setView([41.8781, -87.6298], 10).addLayer(L.mapbox.tileLayer('mapbox.streets'));
      // Add a second layer for removel previous displayed markers later
      overlays = L.layerGroup().addTo(map);
      // Call getStops to load markers on the map
      that.getStops();
      return map;
    },
    // This function will get the boundary fo the map and filter out all the markers with lan and long that are within the boundary and print their title to "coordinates" box.
    onMove: function () {
      console.log("called");
      var inBounds = [],
          bounds = map.getBounds();
          count = 0
      clusterGroup.eachLayer(function(layer) {
          // Check if the layer is within the bounder
          if (bounds.contains(layer.getLatLng())) {
              var options = layer.options,
                  boardingSum = options.boardingSum;
              inBounds.push(options.title);
              ++count;
              // Create dataset for chart
              chartModule.updateData(boardingSum);
          }
      });
      $('#coordinates').html('<p>Stops: ' + count + '</p>' + inBounds.join('\n'));
      // Create chart for new markers group
      chartModule.createBarChart();
    },

    // Create a marker with a stop object and append marker to layers
    createNewMarker: function (stop) {
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
    },

    // Add center eventlistener to clusterGroup
    addCenterEventToLayers: function () {
      clusterGroup.on('click', function(e) {
          map.panTo(e.layer.getLatLng());
      });
    },

    getStops: function () {
      var that = this;
      // Make ajax call to server to get all the stops
      $.ajax({
        dataType: 'text',
        url: '/get_stops.json',
        success:function(stops) {
          var stops = $.parseJSON(stops);
          layers = new L.MarkerClusterGroup();
          // Create marker for each stop
          for (var i = 0; i < stops.length; ++i) {
              that.createNewMarker(stops[i]);
          }
          overlays.addLayer(layers);
          clusterGroup = layers;
          // Add list populate eventlistener to new clusterGroup
          that.onMove();
          that.addCenterEventToLayers();
        },
        error:function(error) {
          var errors = $.parseJSON(error.responseText).errors
          alert(errors);
        }
      })
    },

    // Only show stops with had smaller or the same boardingSum than the selected filter
    applyFilter: function (value) {
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
      this.addCenterEventToLayers();
      // Refresh the Stops panel
      this.onMove();
    },

    resetFilter: function (e) {
      var that = this;
      if (e.target !== $("input")) {
        $("input:checked").removeAttr("checked");
        overlays.clearLayers();
        clusterGroup = layers;
        overlays.addLayer(clusterGroup);
        // Add center eventlistener to the new clusterGroup
        that.addCenterEventToLayers();
        // Refresh the Stops panel
        that.onMove();
      }
    }
  };
}());