class RemoveStartDateAndEndDateFromEventCalendars < ActiveRecord::Migration[7.2]
  def change
    remove_column :event_calendars, :start_date, :datetime
    remove_column :event_calendars, :end_date, :datetime
  end
end
