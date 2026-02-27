class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  before_action :set_skills

  helper_method :skills

  private

  def set_skills
    @skills ||= YAML.safe_load_file(Rails.root.join("lib/data/skills.yml"), symbolize_names: true)
  end

  def skills
    @skills
  end
end
