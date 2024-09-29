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
    it "returns a successful response" do
      get events_path, headers: auth_headers
      expect(response).to have_http_status(:success)
    end

    it "returns all events for the current user" do
      get events_path, headers: auth_headers
      json_response = JSON.parse(response.body)
      expect(json_response.length).to eq(1)
      expect(json_response.first["id"]).to eq(event.id)
    end
  end

  describe "POST #create" do
    let(:valid_attributes) do
      {
        title: "New Event",
        description: "Event Description",
        start_date: Time.zone.now,
        end_date: Time.zone.now + 1.hour,
      }
    end

    context "with valid parameters" do
      it "creates a new event" do
        expect {
          post events_path, params: { event: valid_attributes }, headers: auth_headers
        }.to change { Event.count }.by(1)
      end

      it "returns a created status" do
        post events_path, params: { event: valid_attributes }, headers: auth_headers
        expect(response).to have_http_status(:created)
      end
    end

    context "with invalid parameters" do
      it "does not create a new event" do
        expect {
          post events_path, params: { event: { title: "" } }, headers: auth_headers
        }.not_to change { Event.count }
      end

      it "returns an error status" do
        post events_path, params: { event: { title: "" } }, headers: auth_headers
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PUT #update" do
    context "with valid parameters" do
      let(:new_title) { "Updated Event Title" }
      let(:valid_params) do
        {
          event: { title: new_title },
        }
      end

      it "updates the event" do
        put event_path(event), params: valid_params, headers: auth_headers
        event.reload
        expect(event.title).to eq(new_title)
      end

      it "returns a successful response" do
        put event_path(event), params: valid_params, headers: auth_headers
        expect(response).to have_http_status(:success)
      end
    end

    context "with invalid parameters" do
      let(:invalid_params) do
        {
          event: { title: "" },
        }
      end

      it "does not update the event" do
        put event_path(event), params: invalid_params, headers: auth_headers
        event.reload
        expect(event.title).not_to eq("")
      end

      it "returns an error response" do
        put event_path(event), params: invalid_params, headers: auth_headers
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE #destroy" do
    it "deletes the event" do
      expect {
        delete event_path(event), headers: auth_headers
      }.to change { Event.count }.by(-1)
    end

    it "returns a no content response" do
      delete event_path(event), headers: auth_headers
      expect(response).to have_http_status(:no_content)
    end
  end
end
