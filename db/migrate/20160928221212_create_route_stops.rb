class CreateRouteStops < ActiveRecord::Migration
  def change
    create_table :route_stops do |t|
      t.string :boardings
      t.string :alightings
      t.integer :stop_id
      t.integer :route_id
    end
  end
end