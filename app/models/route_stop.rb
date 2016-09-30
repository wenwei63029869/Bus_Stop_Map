class RouteStop < ActiveRecord::Base
  validates :boardings, :alightings, :stop_id, :route_id, presence: true
  belongs_to :stop
  belongs_to :route
end
