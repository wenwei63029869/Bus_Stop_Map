class Stop < ActiveRecord::Base
  validates :on_street, :cross_street, :latitude, :longitude,  presence: true
  has_many :route_stops
  has_many :routes, through: :route_stops
end