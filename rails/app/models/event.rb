class Event < ApplicationRecord
  validates :title, presence: true
  validates :description, presence: true
  validates :start_date, presence: true
  validates :end_date, presence: true
  belongs_to :event_calendar
end
