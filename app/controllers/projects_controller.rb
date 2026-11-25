class ProjectsController < ApplicationController
  def index
    all = all_projects
    @case_studies = all.select(&:case_study?)
    @projects = all.reject(&:case_study?)
  end

  def show
    @project = all_projects.find { |p| p.slug == params[:id] }
    raise ActionController::RoutingError, "Not Found" unless @project
  end
end
