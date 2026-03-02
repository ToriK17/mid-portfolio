class PagesController < ApplicationController
  def home
    @featured_projects = all_projects.select(&:featured?).first(3)
  end

  def about
  end

  def contact
  end
end
