class Project
  attr_reader :title, :slug, :description, :long_description,
              :tech_stack, :tags, :status, :position, :featured,
              :github_url, :live_url

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
  end

  def featured?
    @featured
  end

  def to_param
    slug
  end

  def to_partial_path
    "projects/project"
  end
end
