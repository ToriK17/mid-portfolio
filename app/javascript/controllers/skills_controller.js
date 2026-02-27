import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["badge"]

  connect() {
    this.observer = new IntersectionObserver(this.onIntersect.bind(this), {
      threshold: 0.1
    })
    this.observer.observe(this.element)
  }

  disconnect() {
    this.observer.disconnect()
  }

  onIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.badgeTargets.forEach((badge, index) => {
          setTimeout(() => {
            badge.classList.remove("opacity-0", "translate-y-2")
            badge.classList.add("opacity-100", "translate-y-0")
          }, index * 40)
        })
        this.observer.disconnect()
      }
    })
  }
}
