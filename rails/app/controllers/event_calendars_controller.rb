class EventCalendarsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_event_calendar, only: [:update]

  def index
    event_calendars = current_user.event_calendars
    render json: event_calendars
  end

  def create
    event_calendar = current_user.event_calendars.new(event_calendar_params)
    if event_calendar.save
      render json: event_calendar, status: :created
    else
      render json: { errors: event_calendar.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @event_calendar.update(event_calendar_params)
      render json: event_calendar
    else
      render json: { errors: @event_calendar.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

    def set_event_calendar
      @event_calendar = current_user.event_calendars.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "イベントが見つかりません" }, status: :not_found
    end

    def event_calendar_params
      params.require(:event_calendar).permit(:title, :description, :start_date, :end_date)
    end
end
