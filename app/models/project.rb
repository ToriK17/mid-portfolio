class Project < ApplicationRecord
  validates :title, :description, presence: true
  validates :slug, presence: true, uniqueness: true,
            format: { with: /\A[a-z0-9-]+\z/, message: "only lowercase letters, numbers, and hyphens" }

  scope :featured, -> { where(featured: true) }
  scope :ordered,  -> { order(:position) }

  def to_param
    slug
  end
end
