class EventsController < ApplicationController
  before_action :authenicate_user!
  before_action :set_event_calendar
  before_action :set_event, only: %i[update destroy]

  def index
    events = @event_calendar.events
    render json: events
  end

  def create
    event = @event_calendar.event.new(event_params)
    if event.save
      render json: event, status: :created
    else
      render json: { error: event.errors.full_messages }, status: :upprocessable_entity
    end
  end

  def update
    if @event.update(event_params)
      render json: @event
    else
      render json: { error: @event.errors.full_messages }, status: :upprocessable_entity
    end
  end

  def destroy
    @event.destroy!
    head :no_content
  end

  private

    def set_event_calendar
      @event_calender = event_calender.current_user.event_calender
    end

    def set_event
      @event = @event_calender.events.find(params[:id])
    end

    def event_params
      params.require(:event).permit(:title, :description, :start_date, :end_date)
    end
end
