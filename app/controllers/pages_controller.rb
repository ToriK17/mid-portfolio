class PagesController < ApplicationController
  def home
    @featured_projects = Project.featured.ordered.limit(3)
  end

  def about
  end

  def contact
  end
end
