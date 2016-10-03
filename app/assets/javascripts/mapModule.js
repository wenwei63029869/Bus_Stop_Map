var mapModule = (function() {
  var map,
      overlays,
      // layers is used to store the initial layers which includes all the markers.
      layers,
      // contains the most recent displayed markers. All the eventlisteners will be added to this layers container
      clusterGroup,
      StreetFilterApplied = false,
      accessToken = 'pk.eyJ1Ijoid2Vud2VpNjMwMjk4NjkiLCJhIjoiY2l0bmc5MmFvMDA1MTNvbDRmZ3A4d3B1aiJ9.lJjkZn-QWyhTixwvwdBnaA',
      customMarker = L.Marker.extend({
         options: {
            boardingSum: 'Custom data!',
            onStreet: 'Custom',
            crossStreet: 'Custom'
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
              onStreet: stop.on_street,
              crossStreet: stop.cross_street,
              title: title
          })
      marker.bindPopup(popupContent, {closeButton: false, minWidth: 300});
      return marker;
    },

    // Add center eventlistener to clusterGroup
    addCenterEventToLayers: function () {
      // Need to remove the listener first; otherwise center won't work.
      clusterGroup.off('click');
      clusterGroup.on('click', function(e) {
        console.log("run");
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
          that.createMarkers(layers, stops);
        },
        error:function(error) {
          var errors = $.parseJSON(error.responseText).errors
          alert(errors);
        }
      })
    },

    createMarkers: function(currentLayers, stops) {
      var that = this;
      // Create marker for each stop
      for (var i = 0; i < stops.length; ++i) {
          var marker = that.createNewMarker(stops[i]);
          currentLayers.addLayer(marker);
      }
      overlays.addLayer(currentLayers);
      clusterGroup = currentLayers;
      // Add list populate eventlistener to new clusterGroup
      that.onMove();
      that.addCenterEventToLayers();
    },

    // Only show stops with had smaller or the same boardingSum than the selected filter
    applyBoardingFilter: function (value) {
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

    getStreets: function(onStreet, crossStreet) {
      // Erase previously displayed markers(layers)
      overlays.clearLayers();
      // create an empty clusterGroup and add it to overlays
      clusterGroup = new L.MarkerClusterGroup().addTo(overlays);
      // show all the markers if the field become empty
      if (onStreet === '' && crossStreet === '') {
        clusterGroup = layers;
        overlays.addLayer(clusterGroup);
      } else if (onStreet !== '' && crossStreet !== '') {
        layers.eachLayer(function(layer) {
          if (layer.options.onStreet.startsWith(onStreet) && layer.options.crossStreet.startsWith(crossStreet)) {
            clusterGroup.addLayer(layer);
          }
        })
      } else {
        if (onStreet !== '') {
          layers.eachLayer(function(layer) {
            if (layer.options.onStreet.startsWith(onStreet)) {
              clusterGroup.addLayer(layer);
            }
          })
        } else if (crossStreet !== '') {
          layers.eachLayer(function(layer) {
            if (layer.options.crossStreet.startsWith(crossStreet)) {
              clusterGroup.addLayer(layer);
            }
          })
        }
      }
      // Add center eventlistener to the new clusterGroup
      this.addCenterEventToLayers();
      // Refresh the Stops panel
      this.onMove();
    },

    applyStreetsFilter: function (e) {
      var streetsForm = $(e.target).parent(),
          onStreet = streetsForm.find('input[name=on-street]').val().toUpperCase(),
          crossStreet = streetsForm.find('input[name=cross-street]').val().toUpperCase()
      this.getStreets(onStreet, crossStreet);
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