class CreateStops < ActiveRecord::Migration
  def change
    create_table :stops do |t|
      t.string :on_street
      t.string :cross_street
      t.float :latitude
      t.float :longitude
      t.string :route_numbers
      t.float :boarding_sum
    end
  end
end
