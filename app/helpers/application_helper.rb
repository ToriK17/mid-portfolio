module ApplicationHelper
  def nav_link_class(current_path, target_path)
    base = "transition-colors hover:text-green-400"
    current_path.start_with?(target_path) ? "#{base} text-green-400" : "#{base} text-zinc-400"
  end
end
