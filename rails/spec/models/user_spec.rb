require "rails_helper"

RSpec.describe User, type: :model do
  describe "validations" do
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive.scoped_to(:provider) }
    it { should validate_presence_of(:password) }
  end

  describe "assosiations" do
    it { should have_one(:event_calendar).dependent(:destroy) }
    it { should have_many(:events).through(:event_calendar).dependent(:destroy) }
  end

  describe "callbacks" do
    it "creates an event calendar after user creation" do
      user = create(:user)
      expect(user.event_calendar).to be_present
    end

    it "sets default calendar title if name is not present" do
      user = create(:user, name: nil)
      expect(user.event_calendar.title).to eq("デフォルトのカレンダー")
    end

    it "sets personalized calendat title if name is present" do
      user = create(:user, name: "John Doe")
      expect(user.event_calendar.title).to eq("John Doeのカレンダー")
    end
  end
end
