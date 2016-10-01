class CreateRouteStops < ActiveRecord::Migration
  def change
    create_table :route_stops do |t|
      t.float :boardings
      t.float :alightings
      t.integer :stop_id
      t.integer :route_id
    end
  end
end