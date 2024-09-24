class EventCalendarController < ApplicationController
  before_action :authenticate_user!

  def index
    user_id = current_user.id
    event_calendar = EventCalendar.where(user_id:)
    render json: event_calendar
  end

  def create
    event_calendar = EventCalendar.new(event_calendar_params)
    event_calendar.user_id = current_user.id
    render json: event_calendar
  end

  def update
    event_calendar = EventCalendar.find(params[:id])
    event_calendar = event_calendar.update!(event_calendar_params)
    render json: event_calendar
  end

  private

    def event_calendar_params
      params.require.permit(:title, :description, :start_date, :end_date)
    end
end
