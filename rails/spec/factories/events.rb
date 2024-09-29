FactoryBot.define do
  factory :event do
    title { Faker::Lorem.sentence }
    description { Faker::Lorem.paragraph }
    start_date { Faker::Time.forward(days: 23, period: :morinig) }
    end_date { Faker::Time.forward(days: 23, period: :evening) }
    event_calendar # 関連付け
  end
end
