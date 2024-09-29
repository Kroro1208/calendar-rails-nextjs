require "rails_helper"

RSpec.describe EventCalendar, type: :model do
  describe "assosiations" do
    it { should belong_to(:user) }
    it { should have_many(:events).dependent(:destroy) }
  end

  describe "validations" do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:description) }
  end
end
