class PagesController < ApplicationController
  def home
    all_featured = all_projects.select(&:featured?)
    @featured_case_studies = all_featured.select(&:case_study?)
    @featured_projects = all_featured.reject(&:case_study?).first(3)
  end

  def about
  end

  def contact
  end
end
