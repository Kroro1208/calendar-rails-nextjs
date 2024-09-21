class Api::V1::HealthCheckController < ApplicationController
  def index
    render json: { message: "Success Health CHeck !!" }, status: :ok
  end
end
