module AuthHelpers
  def auth_headers(user)
    user.create_new_auth_token
  end
end

RSpec.configure do |config|
  config.include AuthHelpers, type: :request
end
