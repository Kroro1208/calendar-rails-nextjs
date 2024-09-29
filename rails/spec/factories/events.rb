FactoryBot.define do
  factory :event do
    title { Faker::Lorem.sentence }
    description { Faker::Lorem.paragraph }
    start_date { Faker::Time.forward(days: 23, period: :morning) }
    end_date { Faker::Time.forward(days: 23, period: :evening) }
    association :event_calendar
  end
end
