class EventCalendar < ApplicationRecord
  validates :title, presence: true
  validates :description, presence: true
  belongs_to :user
  has_many :events, dependent: :destroy
end
