require "rails_helper"

RSpec.describe "Auth::Registrations", type: :request do
  describe "POST /auth" do
    let(:valid_params) do
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        password_confirmation: "password123",
      }
    end

    context "パラメータが有効な場合" do
      it "新しいユーザーを作成する" do
        expect {
          post "/auth", params: { registration: valid_params }
        }.to change { User.count }.by(1)
      end

      it "レスポンスが成功を返す" do
        post "/auth", params: { registration: valid_params }
        expect(response).to have_http_status(:success)
      end

      it "ユーザーのイベントカレンダーを作成する" do
        post "/auth", params: { registration: valid_params }
        expect(User.last.event_calendar).to be_present
      end
    end

    context "パラメータが無効な場合" do
      let(:invalid_params) do
        {
          name: "",
          email: "invalid_email",
          password: "pass",
          password_confirmation: "pas",
        }
      end

      it "新しいユーザーを作成しない" do
        expect {
          post "/auth", params: { registration: invalid_params }
        }.not_to change { User.count }
      end

      it "エラーレスポンスを返す" do
        post "/auth", params: { registration: invalid_params }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
