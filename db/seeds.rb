require 'csv'

def processLocation(location_string)
  # getting rid of parentheses
  location_string.gsub!(/[() ]/, "")
  location_string.split(",")
end

def processRoutes(routes_string)
  # get all the routes that stop at a stop
  # some row contains empty column. In that case, I will just assume there is no more buses stop there
  if routes_string
    routes_string.gsub!(/[^\d,]/, "")
    return routes_string.split(",")
  else
    return []
  end
end

# Read csv file
csv_text = File.read('./CTA_-_Ridership_-_Avg._Weekday_Bus_Stop_Boardings_in_October_2012.csv')
csv = CSV.parse(csv_text, :headers => true)

# iterate through rows and populate database
csv.each do |row|
  row = row.to_hash
  location = processLocation(row["location"])
  routes = processRoutes(row['routes'])
  # populate Stop
  stop = Stop.create(on_street: row["on_street"], cross_street: row["cross_street"], latitude: location[0], longitude: location[1], route_numbers: row['routes'])

  # populate Route
  routes.each do |route|
    route = Route.find_or_create_by(route_number: route)
    #populate RouteStops
    RouteStop.create(boardings: row["boardings"], alightings: row["alightings"], stop_id: stop.id, route_id: route.id)
  end
end

Stop.all.each do |stop|
  boarding_sum = 0.00
  stop.route_stops.each do |route_stop|
    boarding_sum +=  (route_stop.boardings.to_f)
  end
  stop.update(boarding_sum: ('%.2f' % boarding_sum))
end