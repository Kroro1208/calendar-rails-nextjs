FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    email { Faker::Internet.email }
    password { "password123" }
    password_confirmation { "password123" }
    uid { email }
    provider { "email" }
    confirmed_at { Time.zone.now }
  end
end
