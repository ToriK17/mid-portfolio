class ProjectsController < ApplicationController
  def index
    @projects = all_projects
  end

  def show
    @project = all_projects.find { |p| p.slug == params[:id] }
    raise ActionController::RoutingError, "Not Found" unless @project
  end
end
