require "rails_helper"

RSpec.describe "Auth::Sessions", type: :request do
  describe "GET /auth/sessions" do
    context "when user is logged in" do
      let(:user) { create(:user) }

      before do
        sign_in user
        # Devise Token Auth のヘッダーを設定
        @auth_headers = user.create_new_auth_token
      end

      it "returns a successful response with user data" do
        get "/auth/sessions", headers: @auth_headers
        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response["is_login"]).to be true
        expect(json_response["data"]["id"]).to eq(user.id)
      end
    end

    context "when user is not logged in" do
      it "returns a response indicating user is not logged in" do
        get "/auth/sessions"
        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response["is_login"]).to be false
        expect(json_response["message"]).to eq("ユーザーが存在しません")
      end
    end
  end
end
