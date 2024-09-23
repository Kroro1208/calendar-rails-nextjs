class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  include DeviseHackFakeSession
  before_action :verify_authenticity_token
end
