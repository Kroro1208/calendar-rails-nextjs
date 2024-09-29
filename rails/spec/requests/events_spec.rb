require "rails_helper"

RSpec.describe "Events", type: :request do
  let(:user) { create(:user) }
  let(:event_calendar) { user.event_calendar }
  let!(:event) { create(:event, event_calendar:) }
  let(:auth_headers) { user.create_new_auth_token }

  before do
    sign_in user
  end

  describe "GET #index" do
    it "レスポンスが成功を返す" do
      get events_path, headers: auth_headers
      expect(response).to have_http_status(:success) # これにより認証済みユーザーとしてリクエストを送信
    end

    it "現在のユーザーのすべてのイベントを返す" do
      get events_path, headers: auth_headers
      json_response = JSON.parse(response.body)
      expect(json_response.length).to eq(1)
      expect(json_response.first["id"]).to eq(event.id)
    end
  end

  describe "POST #create" do
    let(:valid_attributes) do
      {
        title: "新しいイベント",
        description: "イベントの説明",
        start_date: Time.zone.now,
        end_date: Time.zone.now + 1.hour,
      }
    end

    context "パラメータが有効の場合" do
      it "新しいイベントを作成する" do
        expect {
          post events_path, params: { event: valid_attributes }, headers: auth_headers
        }.to change { Event.count }.by(1)
      end

      it "作成成功ステータスを返す" do
        post events_path, params: { event: valid_attributes }, headers: auth_headers
        expect(response).to have_http_status(:created)
      end
    end

    context "パラメータが無効の場合" do
      it "新しいイベントを作成しない" do
        expect {
          post events_path, params: { event: { title: "" } }, headers: auth_headers
        }.not_to change { Event.count }
      end

      it "エラーステータスを返す" do
        post events_path, params: { event: { title: "" } }, headers: auth_headers
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PUT #update" do
    context "パラメータが有効の場合" do
      let(:new_title) { "更新されたイベントタイトル" }
      let(:valid_params) do
        {
          event: { title: new_title },
        }
      end

      it "イベントを更新する" do
        put event_path(event), params: valid_params, headers: auth_headers
        event.reload
        expect(event.title).to eq(new_title)
      end

      it "成功レスポンスを返す" do
        put event_path(event), params: valid_params, headers: auth_headers
        expect(response).to have_http_status(:success)
      end
    end

    context "パラメータが無効の場合" do
      let(:invalid_params) do
        {
          event: { title: "" },
        }
      end

      it "イベントを更新しない" do
        put event_path(event), params: invalid_params, headers: auth_headers
        event.reload
        expect(event.title).not_to eq("")
      end

      it "エラーレスポンスを返す" do
        put event_path(event), params: invalid_params, headers: auth_headers
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE #destroy" do
    it "イベントを削除する" do
      expect {
        delete event_path(event), headers: auth_headers
      }.to change { Event.count }.by(-1)
    end

    it "no contentレスポンスを返す" do
      delete event_path(event), headers: auth_headers
      expect(response).to have_http_status(:no_content)
    end
  end
end
