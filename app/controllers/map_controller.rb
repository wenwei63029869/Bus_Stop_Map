class MapController < ApplicationController
  include MapHelper
  def index
  end

  def get_stops
    @stops = Stop.all
    render json: @stops
  end
end
