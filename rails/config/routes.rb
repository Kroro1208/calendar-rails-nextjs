Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?

  # 認証に必要なルーティングをマウント
  mount_devise_token_auth_for "User", at: "auth", controllers: {
    registrations: "auth/registrations",
  }

  namespace :auth do
    resources :session, only: %i[index]
  end

  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
      mount_devise_token_auth_for "User", at: "auth"
    end
  end
end
