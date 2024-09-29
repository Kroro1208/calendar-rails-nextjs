FactoryBot.define do
  factory :event_calendar do
    title { "#{Faker::Name.name}のカレンダー" }
    description { "イベント作成用のカレンダー" }
    user # 関連付け
  end
end
