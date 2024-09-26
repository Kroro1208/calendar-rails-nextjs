class AddForeignKeyConstraints < ActiveRecord::Migration[7.2]
  def change
    # 既存の外部キー制約を削除
    remove_foreign_key :event_calendars, :users

    # 新しい外部キー制約を追加
    add_foreign_key :event_calendars, :users, on_delete: :cascade

    # events テーブルの制約も同様に処理
    remove_foreign_key :events, :event_calendars
    add_foreign_key :events, :event_calendars, on_delete: :cascade
  end
end
