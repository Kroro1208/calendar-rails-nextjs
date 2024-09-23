class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  include DeviseHackFakeSession
  before_action :verify_authenticity_token
end
