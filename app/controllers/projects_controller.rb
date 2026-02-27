class ProjectsController < ApplicationController
  def index
    @projects = Project.ordered
  end

  def show
    @project = Project.find_by!(slug: params[:id])
  end
end
