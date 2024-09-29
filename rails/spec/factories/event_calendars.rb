FactoryBot.define do
  factory :event_calendar do
    title { "#{Faker::Name.name}のカレンダー" }
    description { "#{Faker::Lorem.sentence}のカレンダー" }
    user # 関連付け
  end
end
