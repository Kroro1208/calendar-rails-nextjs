require "rails_helper"

RSpec.describe "Auth::Registrations", type: :request do
  before do
    @request.env["devise.mapping"] = Devise.mappings[:user]
  end

  describe "POST #create" do
    context "with valid parameters" do
      let(:valid_params) do
        {
          registration: {
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            password_confirmation: "password123",
          },
        }
      end

      it "creates a new user" do
        expect {
          post :create, params: valid_params
        }.to change(User, count).by(1)
      end

      it "returns a successful response" do
        post :create, params: valid_params
        expect(response).to have_http_status(:success)
      end

      it "creates an event calendar for the user" do
        post :create, params: valid_params
        expect(User.last.event_calendar).to be_present
      end
    end

    context "with invalid parameters" do
      let(:invalid_params) do
        {
          registration: {
            name: "",
            email: "invalid_email",
            password: "pass",
            password_confirmation: "pas",
          },
        }
      end

      it "does not create a new user" do
        expect {
          post :create, params: invalid_params
        }.not_to change { User.count }
      end

      it "returns an error response" do
        post :create, params: invalid_params
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
