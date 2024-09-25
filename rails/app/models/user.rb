# frozen_string_literal: true

class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User
  has_one :event_calendar, dependent: :destroy
  has_many :events, through: :event_calendar
  after_create :create_event_calendar

  private

  def create_event_calendar
    self.create_event_calendar!
  end
end
