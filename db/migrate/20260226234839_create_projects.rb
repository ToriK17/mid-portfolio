class CreateProjects < ActiveRecord::Migration[8.1]
  def change
    create_table :projects do |t|
      t.string  :title,            null: false
      t.string  :slug,             null: false
      t.text    :description,      null: false
      t.text    :long_description
      t.string  :tech_stack,       array: true, default: []
      t.string  :tags,             array: true, default: []
      t.string  :github_url
      t.string  :live_url
      t.string  :status
      t.integer :position,         null: false, default: 0
      t.boolean :featured,         null: false, default: false
      t.timestamps
    end

    add_index :projects, :slug, unique: true
    add_index :projects, :position
  end
end
