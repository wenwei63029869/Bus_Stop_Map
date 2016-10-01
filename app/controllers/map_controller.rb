class MapController < ApplicationController
  include MapHelper
  def index
  end

  def get_stops
    @stops = Stop.all
    if @stops
      render json: @stops
    else
      render :json => { :errors => "Can't load get_stopss data." }, :status => 404
    end
  end
end
