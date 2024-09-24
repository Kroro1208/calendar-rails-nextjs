class Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  def create
    super do |resource|
      if resource.errors.any?
        Rails.logger.error "User creation failed: #{resource.errors.full_messages}"
        return render_create_error(resource.errors.full_messages)
      end
    end
  end

  private

    def sign_up_params
      params.require(:registration).permit(:name, :email, :password, :password_confirmation)
    end
end
