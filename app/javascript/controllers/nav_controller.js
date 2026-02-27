import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.scrollHandler = this.onScroll.bind(this)
    window.addEventListener("scroll", this.scrollHandler, { passive: true })
    this.onScroll() // apply correct state on initial load
  }

  disconnect() {
    window.removeEventListener("scroll", this.scrollHandler)
  }

  onScroll() {
    if (window.scrollY > 20) {
      this.element.classList.add("bg-zinc-950/90", "backdrop-blur-sm", "border-b", "border-zinc-800/80")
    } else {
      this.element.classList.remove("bg-zinc-950/90", "backdrop-blur-sm", "border-b", "border-zinc-800/80")
    }
  }
}
