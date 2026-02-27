import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["copyBtn"]
  static values  = { email: String }

  copy() {
    navigator.clipboard.writeText(this.emailValue).then(() => {
      const btn = this.copyBtnTarget
      const original = btn.textContent
      btn.textContent = "Copied!"
      btn.classList.add("text-green-300")
      btn.classList.remove("text-green-400")
      setTimeout(() => {
        btn.textContent = original
        btn.classList.remove("text-green-300")
        btn.classList.add("text-green-400")
      }, 2000)
    })
  }
}
