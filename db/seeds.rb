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
csv_text = File.read('./bus_stop.csv')
csv = CSV.parse(csv_text, :headers => true)

# iterate through rows and populate database
csv.each do |row|
  row = row.to_hash
  location = processLocation(row["location"])
  routes = processRoutes(row['routes'])
  # populate Stop
  stop = Stop.create(on_street: row["on_street"], cross_street: row["cross_street"], latitude: location[0].to_f, longitude: location[1].to_f, route_numbers: row['routes'])

  # populate Route
  routes.each do |route|
    route = Route.find_or_create_by(route_number: route)
    #populate RouteStops
    RouteStop.create(boardings: ('%.2f' % row["boardings"].to_f), alightings: ('%.2f' % row["alightings"].to_f), stop_id: stop.id, route_id: route.id)
  end
end

Stop.all.each do |stop|
  boarding_sum = RouteStop.where(stop_id: stop.id).sum(:boardings)
  stop.update(boarding_sum: ('%.2f' % boarding_sum))
end