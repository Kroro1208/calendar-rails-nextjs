class Auth::RegistrationsController < ApplicationController
  private

    def sign_up_params
      params.permit(:name, :email, :password, :password_confirmaition)
    end
end
