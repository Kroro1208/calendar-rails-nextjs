class CreateEventCalendars < ActiveRecord::Migration[7.2]
  def change
    create_table :event_calendars do |t|
      t.string :title
      t.string :description
      t.string :start_date
      t.string :end_date
      t.references :user, foreign_key: true
      t.timestamps
    end
  end
end
