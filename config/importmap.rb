# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"

# xterm.js — loaded lazily by terminal_controller.js (easter egg only)
pin "xterm", to: "https://cdn.jsdelivr.net/npm/xterm@5.3.0/lib/xterm.esm.js"
pin "xterm-addon-fit", to: "https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/lib/xterm-addon-fit.esm.js"
