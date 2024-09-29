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

    context "with valid parameters" do
      it "creates a new user" do
        expect {
          post "/auth", params: { registration: valid_params }
        }.to change { User.count }.by(1)
      end

      it "returns a successful response" do
        post "/auth", params: { registration: valid_params }
        expect(response).to have_http_status(:success)
      end

      it "creates an event calendar for the user" do
        post "/auth", params: { registration: valid_params }
        expect(User.last.event_calendar).to be_present
      end
    end

    context "with invalid parameters" do
      let(:invalid_params) do
        {
          name: "",
          email: "invalid_email",
          password: "pass",
          password_confirmation: "pas",
        }
      end

      it "does not create a new user" do
        expect {
          post "/auth", params: { registration: invalid_params }
        }.not_to change { User.count }
      end

      it "returns an error response" do
        post "/auth", params: { registration: invalid_params }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
