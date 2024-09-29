require "rails_helper"

RSpec.describe Event, type: :model do
  describe "assosiations" do
    it { should belong_to(:event_calendar) }
  end

  describe "validations" do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:description) }
    it { should validate_presence_of(:start_date) }
    it { should validate_presence_of(:end_date) }
  end
end
