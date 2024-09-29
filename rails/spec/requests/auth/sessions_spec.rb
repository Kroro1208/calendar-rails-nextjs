require "rails_helper"

RSpec.describe "Auth::Sessions", type: :request do
  describe "GET /auth/sessions" do
    context "ユーザーがログインしている場合" do
      let(:user) { create(:user) }

      before do
        sign_in user
        # Devise Token Auth のヘッダーを設定
        @auth_headers = user.create_new_auth_token
      end

      it "ユーザーデータを含むレスポンスが成功を返す" do
        get "/auth/sessions", headers: @auth_headers
        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response["is_login"]).to be true
        expect(json_response["data"]["id"]).to eq(user.id)
      end
    end

    context "ユーザーがログインしていない場合" do
      it "ユーザーがログインしていないことを示すレスポンスを返す" do
        get "/auth/sessions"
        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response["is_login"]).to be false
        expect(json_response["message"]).to eq("ユーザーが存在しません")
      end
    end
  end
end
