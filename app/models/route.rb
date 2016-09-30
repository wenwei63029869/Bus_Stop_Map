class Route < ActiveRecord::Base
  validates :route_number,  presence: true
  has_many :route_stops
  has_many :stops, through: :route_stops

  def self.longest_route
    id = RouteStop.group('route_id').order('count(*) DESC').limit(1).pluck(:route_id).first
    Route.find(id)
  end
end