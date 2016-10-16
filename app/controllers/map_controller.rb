class MapController < ApplicationController
  def index
  end

  def get_stops
    @stops = Stop.all
    if @stops != []
      render json: @stops
    else
      render :json => { :errors => "There is no stop data in database." }, :status => 404
    end
  end
end
