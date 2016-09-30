module MapHelper
  def self.build_stop(stop, geojson)
    route_num_str = ""
    stop.routes.each {|route| route_num_str += route.route_number}
    geojson << {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [stop.longitude, stop.latitude] # this part is tricky
      },
      properties: {
        title: "#{stop.on_street} & #{stop.cross_street}",
        routes: route_num_str,
        :"marker-color" => "#FFFFFF",
        :"marker-symbol" => "circle",
        :"marker-size" => "medium",
      }
    }
  end
end
