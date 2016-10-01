class Route < ActiveRecord::Base
  validates :route_number,  presence: true
  has_many :route_stops
  has_many :stops, through: :route_stops
end