class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User

  has_one :event_calendar, dependent: :destroy
  has_many :events, through: :event_calendar

  # after_commitによりユーザー作成後にカレンダーを作成
  after_commit :create_event_calendar, on: :create

  private

    def create_event_calendar
      # nameが設定されていない場合にはデフォルト値を設定
      calendar_title = name.present? ? "#{name}のカレンダー" : "デフォルトのカレンダー"
      calendar_description = name.present? ? "#{name}のイベント作成用" : "イベント作成用のカレンダー"

      # イベントカレンダーを作成
      self.create_event_calendar!(
        title: calendar_title,
        description: calendar_description,
      )
    end
end
