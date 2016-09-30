# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160928221212) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "route_stops", force: :cascade do |t|
    t.string  "boardings"
    t.string  "alightings"
    t.integer "stop_id"
    t.integer "route_id"
  end

  create_table "routes", force: :cascade do |t|
    t.string "route_number"
  end

  create_table "stops", force: :cascade do |t|
    t.string "on_street"
    t.string "cross_street"
    t.string "latitude"
    t.string "longitude"
    t.string "route_numbers"
    t.float  "boarding_sum"
  end

end
