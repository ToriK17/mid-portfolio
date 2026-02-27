Rails.application.routes.draw do
  root "pages#home"

  get "/about",   to: "pages#about",   as: :about
  get "/contact", to: "pages#contact", as: :contact

  resources :projects, only: [ :index, :show ]

  get "up" => "rails/health#show", as: :rails_health_check
end
