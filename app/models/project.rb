class Project
  attr_reader :title, :slug, :description, :long_description,
              :tech_stack, :tags, :status, :position, :featured,
              :github_url, :live_url, :sections, :case_study

  def initialize(attrs)
    @title            = attrs[:title]
    @slug             = attrs[:slug]
    @description      = attrs[:description]
    @long_description = attrs[:long_description]
    @tech_stack       = Array(attrs[:tech_stack])
    @tags             = Array(attrs[:tags])
    @status           = attrs[:status]
    @position         = attrs[:position].to_i
    @featured         = attrs[:featured] == true
    @github_url       = attrs[:github_url]
    @live_url         = attrs[:live_url]
    @sections         = Array(attrs[:sections])
    @case_study       = attrs[:case_study] == true
  end

  def featured?
    @featured
  end

  def case_study?
    @case_study
  end

  def to_param
    slug
  end

  def to_partial_path
    case_study? ? "projects/case_study" : "projects/project"
  end
end
