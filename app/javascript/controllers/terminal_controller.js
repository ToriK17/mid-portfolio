import { Controller } from "@hotwired/stimulus"

// Easter egg terminal — activated by pressing ` or ~ anywhere on the page,
// or by clicking the >_ button in the nav. Full xterm.js shell migrated from
// the original portfolio.html (portfolio/cli-portfolio).
export default class extends Controller {
  static targets = ["overlay", "container"]
  static values  = { active: Boolean }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  connect() {
    this.keyHandler = this.onKeydown.bind(this)
    document.addEventListener("keydown", this.keyHandler)
    this.terminalInitialized = false
  }

  disconnect() {
    document.removeEventListener("keydown", this.keyHandler)
    if (this.term) this.term.dispose()
    if (this.resizeObserver) this.resizeObserver.disconnect()
  }

  // ─── Open / Close ──────────────────────────────────────────────────────────

  toggle() {
    this.activeValue ? this.close() : this.open()
  }

  open() {
    this.activeValue = true
    this.overlayTarget.classList.remove("hidden")
    this.overlayTarget.setAttribute("aria-hidden", "false")
    document.body.classList.add("overflow-hidden")

    if (!this.terminalInitialized) {
      requestAnimationFrame(() => this.initTerminal())
    } else {
      requestAnimationFrame(() => {
        if (this.fitAddon) this.fitAddon.fit()
        if (this.term) this.term.focus()
      })
    }
  }

  close() {
    this.activeValue = false
    this.overlayTarget.classList.add("hidden")
    this.overlayTarget.setAttribute("aria-hidden", "true")
    document.body.classList.remove("overflow-hidden")
  }

  // ─── Keyboard shortcut ─────────────────────────────────────────────────────

  onKeydown(event) {
    if ((event.key === "`" || event.key === "~") && !this.isInputFocused()) {
      event.preventDefault()
      this.toggle()
      return
    }
    if (event.key === "Escape" && this.activeValue) {
      this.close()
    }
  }

  isInputFocused() {
    const tag = document.activeElement?.tagName
    return ["INPUT", "TEXTAREA", "SELECT"].includes(tag) ||
           document.activeElement?.isContentEditable
  }

  // ─── xterm.js Initialization ───────────────────────────────────────────────

  async initTerminal() {
    const { Terminal }  = await import("xterm")
    const { FitAddon }  = await import("xterm-addon-fit")

    this.term = new Terminal({
      cursorBlink:  true,
      fontSize:     14,
      fontFamily:   "'Courier New', monospace",
      theme: {
        background:  "#000000",
        foreground:  "#00ff00",
        cursor:      "#00ff00",
        selection:   "#00ff0040"
      },
      convertEol: true,
    })

    this.fitAddon = new FitAddon()
    this.term.loadAddon(this.fitAddon)
    this.term.open(this.containerTarget)
    this.fitAddon.fit()

    this.resizeObserver = new ResizeObserver(() => {
      if (this.fitAddon) this.fitAddon.fit()
    })
    this.resizeObserver.observe(this.containerTarget)

    this.terminalInitialized = true
    this.setupShell()
    this.term.focus()
  }

  // ─── Shell setup ───────────────────────────────────────────────────────────

  setupShell() {
    this.currentPath = "/"
    this.commandHistory = JSON.parse(localStorage.getItem("terminalHistory") || "[]")
    this.historyIndex = this.commandHistory.length
    this.currentLine = ""
    this.isTyping = false
    this.invalidCommandCount = 0

    this.typeText(this.banner(), () => this.showPrompt())
    this.term.onData(data => this.handleInput(data))
  }

  banner() {
    return `
╔════════════════════════════════════════════════╗
║     Tori Kafati's Terminal Portfolio           ║
║     Backend Engineer (Ruby on Rails)           ║
║     Built with ☕ and Determination            ║
╚════════════════════════════════════════════════╝

[SYSTEM] Security monitoring active
[SYSTEM] Input sanitization enabled
[SYSTEM] Type /help for commands or try 'ls'
`
  }

  // ─── File system ───────────────────────────────────────────────────────────

  get fileSystem() {
    return {
      "about.txt": `Backend engineer with 6+ years of experience building scalable Ruby on Rails applications.\nExperienced in API design, data modeling, performance optimization, and security-focused systems.\nCurrently building high-volume ingestion and automation workflows in a production security environment.`,
      "skills.txt": `Core: Ruby, Rails, REST, Background jobs (Sidekiq), data modeling\nFrontend: Stimulus, Turbo, JavaScript,React\nDatabases: PostgreSQL, JSONB, Redis, performance optimization\nDevOps: Docker, GitHub Actions, CI/CD, AWS, Heroku\nTesting: RSpec, Minitest, Capybara\nSecurity: Authentication systems, input validation, secure data handling (OWASP principles)`,
      "contact.txt": `Email: victoriakafati.dev@gmail.com\nGitHub: github.com/ToriK17\nLinkedIn: linkedin.com/in/devtorik17\nLocation: Remote (US)`,
      "resume.pdf": "[BINARY FILE - Use /resume to open]",
      ".env": `# Nice try! These are totally real secrets\nDB_PASSWORD="hunter2"\nAPI_KEY="definitely_not_fake_123"\nAWS_SECRET="you_wish"\nADMIN_PASSWORD="password123"\nBITCOIN_WALLET="3FakeWalletAddressNiceT4y"`,
      ".git": "[DIRECTORY]",
      "projects/": {
        "README.md": `# My Projects Portfolio\n\nA collection of production applications I've built over 6 years.\nEach project demonstrates different aspects of my Rails expertise.`,
        "ecommerce.md": `# E-Commerce Platform\nBuilt with Rails 7 + React\n- 50K+ daily active users\n- Stripe integration\n- Real-time inventory management\n- 99.9% uptime`,
        "scheduler.md": `# Real-Time Scheduler\nActionCable + PostgreSQL\n- WebSocket connections for live updates\n- Complex recurring event logic\n- Calendar sync with Google/Outlook`,
        "healthcare.md": `# HIPAA-Compliant Portal\nRails 7 + Devise + Sidekiq\n- End-to-end encryption\n- Audit logging\n- Background job processing\n- Multi-factor authentication`,
        "automation.rb": `# Workflow Automation Tool\nclass WorkflowEngine\n  def initialize\n    @jobs = []\n  end\n  \n  def execute\n    # Processes 10K+ jobs daily\n  end\nend`,
      },
      "secrets/": {
        ".hidden": "You found the hidden file! 🎉",
        "easter_egg.txt": `Congratulations on exploring!\nHere's a dad joke for your trouble:\nWhy do programmers prefer dark mode?\nBecause light attracts bugs! 🐛`,
        "note_to_recruiters.txt": `If you're reading this, you're thorough.\nI appreciate attention to detail in my colleagues too.\nLet's chat! Mention "found your secret" in your message.`,
      }
    }
  }

  // ─── Filesystem helpers ────────────────────────────────────────────────────

  getFileSystemItem(path) {
    if (path === "/") return this.fileSystem

    const parts = path.split("/").filter(p => p)
    let current = this.fileSystem

    for (const part of parts) {
      if (current[part] !== undefined) {
        current = current[part]
      } else if (current[part + "/"] !== undefined) {
        current = current[part + "/"]
      } else {
        return null
      }
    }

    return current
  }

  navigateTo(path) {
    if (path === "..") {
      if (this.currentPath !== "/") {
        const parts = this.currentPath.split("/").filter(p => p)
        parts.pop()
        this.currentPath = parts.length ? "/" + parts.join("/") : "/"
      }
      return true
    }

    const fullPath = path.startsWith("/") ? path :
                     (this.currentPath === "/" ? "/" + path : this.currentPath + "/" + path)

    const item = this.getFileSystemItem(fullPath)
    if (item && typeof item === "object") {
      this.currentPath = fullPath
      return true
    }
    return false
  }

  listDirectory() {
    const dir = this.getFileSystemItem(this.currentPath)
    if (!dir || typeof dir !== "object") return ""

    let output = "\ntotal " + Object.keys(dir).length + "\n"
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" })

    for (const [name, content] of Object.entries(dir)) {
      const isDir = name.endsWith("/") || typeof content === "object"
      const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--"
      const size = typeof content === "string" ? content.length : 4096
      output += `${perms}  1 tori  staff  ${String(size).padStart(6)} ${dateStr} ${name}\n`
    }

    return output
  }

  buildTree(obj, prefix = "") {
    let output = ""
    const entries = Object.entries(obj)

    entries.forEach(([name, content], index) => {
      const last = index === entries.length - 1
      output += prefix + (last ? "└── " : "├── ") + name + "\n"
      if (typeof content === "object") {
        output += this.buildTree(content, prefix + (last ? "    " : "│   "))
      }
    })

    return output
  }

  // ─── Security ──────────────────────────────────────────────────────────────

  get forbiddenPatterns() {
    return [
      { pattern: /[;&|`]/, message: "Shell injection attempt detected. You good?" },
      { pattern: /\brm\s+-rf/, message: "🚨 Destructive command blocked. This incident will be reported." },
      { pattern: /:(){ :|:& };:/, message: "Fork bomb? Really? This is a portfolio, not a CTF." },
      { pattern: /\b(wget|curl)\s+http/, message: "🚨 This is a professional portfolio, not a honeypot." },
      { pattern: /\beval\(/, message: "Nice try, but we don't do eval here. It's called boundaries." },
      { pattern: /\bsudo\b/, message: "You're not in the sudoers file. This incident will be reported." },
      { pattern: /\.sh\b/, message: "We don't run shell scripts here. Try LinkedIn." },
      { pattern: /\bexec\b/, message: "exec() blocked. This isn't a playground." },
      { pattern: /\|\|/, message: "Command chaining blocked. One thing at a time, please." },
      { pattern: />|</, message: "No redirects allowed. Keep it simple." },
      { pattern: /\$\(/, message: "Command substitution blocked. Nice try though!" },
      { pattern: /0x[0-9a-fA-F]{8,}/, message: "HEX? I barely know her." },
    ]
  }

  isMalicious(input) {
    return this.forbiddenPatterns.find(p => p.pattern.test(input))
  }

  // ─── Input handler ─────────────────────────────────────────────────────────

  handleInput(data) {
    if (this.isTyping) return

    if (data === "\r") {                  // Enter
      if (this.currentLine.trim()) {
        this.term.write("\r\n")
        this.processCommand(this.currentLine.trim())

        const cmd = this.currentLine.trim()
        if (cmd && cmd !== this.commandHistory[this.commandHistory.length - 1]) {
          this.commandHistory.push(cmd)
          if (this.commandHistory.length > 100) this.commandHistory.shift()
          localStorage.setItem("terminalHistory", JSON.stringify(this.commandHistory))
        }
        this.historyIndex = this.commandHistory.length
      } else {
        this.showPrompt()
      }
      this.currentLine = ""

    } else if (data === "\u007F") {       // Backspace
      if (this.currentLine.length > 0) {
        this.currentLine = this.currentLine.slice(0, -1)
        this.term.write("\b \b")
      }

    } else if (data === "\u0003") {       // Ctrl+C
      this.currentLine = ""
      this.term.write("^C")
      this.showPrompt()

    } else if (data === "\u001b[A") {     // Up arrow
      if (this.historyIndex > 0) {
        this.historyIndex--
        this.currentLine = this.commandHistory[this.historyIndex]
        this.term.write(`\r\x1b[K\x1b[32m${this.currentPath} $ \x1b[0m${this.currentLine}`)
      }

    } else if (data === "\u001b[B") {     // Down arrow
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++
        this.currentLine = this.commandHistory[this.historyIndex]
        this.term.write(`\r\x1b[K\x1b[32m${this.currentPath} $ \x1b[0m${this.currentLine}`)
      } else {
        this.historyIndex = this.commandHistory.length
        this.currentLine = ""
        this.term.write(`\r\x1b[K\x1b[32m${this.currentPath} $ \x1b[0m`)
      }

    } else if (data.charCodeAt(0) >= 32) { // Printable
      this.currentLine += data
      this.term.write(data)
    }
  }

  // ─── Command processor ─────────────────────────────────────────────────────

  processCommand(input) {
    const malicious = this.isMalicious(input)
    if (malicious) {
      this.invalidCommandCount++
      this.typeText(`\n🚫 ${malicious.message}`, () => this.showPrompt())
      return
    }

    const parts = input.split(" ")
    const cmd   = parts[0].toLowerCase()

    // Built-in slash commands
    const slashResult = this.runSlashCommand(cmd, parts)
    if (slashResult !== undefined) return

    // cd
    if (cmd === "cd") {
      const path = parts[1] || "/"
      if (this.navigateTo(path)) {
        this.showPrompt()
      } else {
        this.typeText(`\ncd: ${path}: No such directory`, () => this.showPrompt())
      }
      return
    }

    // cat
    if (cmd === "cat") {
      if (!parts[1]) {
        this.typeText("\ncat: missing file operand", () => this.showPrompt())
        return
      }
      const fileName = parts.slice(1).join(" ")
      const filePath = this.currentPath === "/" ? fileName : this.currentPath + "/" + fileName
      const dirItem  = this.getFileSystemItem(this.currentPath)
      const content  = this.getFileSystemItem(filePath) || (dirItem && dirItem[fileName])

      if (content && typeof content === "string") {
        this.typeText("\n" + content, () => this.showPrompt())
      } else if (content && typeof content === "object") {
        this.typeText(`\ncat: ${fileName}: Is a directory`, () => this.showPrompt())
      } else {
        this.typeText(`\ncat: ${fileName}: No such file`, () => this.showPrompt())
      }
      return
    }

    // Easter egg sudo
    if (cmd === "sudo" && parts[1] === "rm" && parts[2] === "-rf") {
      this.invalidCommandCount++
      this.typeText("\n💀 System destroyed. Just kidding! This portfolio is indestructible.", () => this.showPrompt())
      return
    }

    this.typeText(`\nCommand not found: ${cmd}\nType /help for available commands`, () => this.showPrompt())
  }

  runSlashCommand(cmd, parts) {
    const handlers = {
      "/help": () => `
╔═══════════════════════════════════════════════╗
║             AVAILABLE COMMANDS                ║
╠═══════════════════════════════════════════════╣
║ Portfolio Commands:                           ║
║   /about     - About me                      ║
║   /projects  - View projects                 ║
║   /skills    - Technical skills              ║
║   /resume    - Open resume                   ║
║   /contact   - Contact information           ║
║   /linkedin  - Open LinkedIn                 ║
║   /github    - Open GitHub                   ║
║                                               ║
║ System Commands:                              ║
║   ls         - List directory contents       ║
║   cd <dir>   - Change directory              ║
║   cat <file> - Display file contents         ║
║   pwd        - Print working directory       ║
║   tree       - Show directory tree           ║
║   clear      - Clear terminal                ║
║   history    - Show command history          ║
║   neofetch   - System information            ║
║   whoami     - Current user info             ║
║                                               ║
║ Tips:                                         ║
║   - Use ↑/↓ arrows for command history       ║
║   - Try exploring with 'cd projects/'        ║
║   - Hidden files start with '.'              ║
║   - Check out 'cd secrets/' 😉               ║
╚═══════════════════════════════════════════════╝`,

      "/about": () => "\n" + this.fileSystem["about.txt"],

      "/skills": () => "\n" + this.fileSystem["skills.txt"],

      "/contact": () => "\n" + this.fileSystem["contact.txt"],

      "/resume": () => {
        window.open("/resume.pdf", "_blank")
        return "\n[SYSTEM] Opening resume.pdf in new tab..."
      },

      "/linkedin": () => {
        window.open("https://linkedin.com/in/devtorik17", "_blank")
        return "\n[SYSTEM] Opening LinkedIn profile..."
      },

      "/github": () => {
        window.open("https://github.com/ToriK17", "_blank")
        return "\n[SYSTEM] Opening GitHub profile..."
      },

      "/projects": () => {
        let out = "\n=== MY PROJECTS ===\n\n"
        const dir = this.fileSystem["projects/"]
        for (const [file, content] of Object.entries(dir)) {
          if (file.endsWith(".md")) {
            out += `📁 ${file}\n`
            out += content.split("\n").slice(0, 3).join("\n") + "\n\n"
          }
        }
        return out + "Use \"cd projects/\" and \"cat <file>\" to read more."
      },

      "ls": () => this.listDirectory(),

      "pwd": () => "\n" + this.currentPath,

      "clear": () => {
        this.term.clear()
        return null
      },

      "whoami": () => "\nvisitor@torikafati-portfolio",

      "neofetch": () => {
        const days = Math.floor((Date.now() - Date.parse("2019-01-01")) / (1000 * 60 * 60 * 24))
        return `
        .-.                     visitor@torikafati-portfolio
       (o o)                    ----------------------------
       | O |                    OS: PortfolioOS Rails 8 LTS
      |     |                   Host: tori-portfolio
     |       |                  Kernel: xterm.js 5.3.0
    |         |                 Uptime: ${days} days (since 2019)
   |           |                Shell: /bin/portfolio
  |             |               Resolution: Responsive
 |_______________|              Terminal: xterm.js + Stimulus
                                CPU: Your Browser @ 100%
                                Memory: 6 Years of Experience
   USER: Tori Kafati
   SHELL: xterm.js
   LANGUAGES: Ruby, JS, SQL, Bash (when panicked)
   FRAMEWORKS: Rails 8, React, Stimulus
   UPTIME: 6 years in production`
      },

      "history": () => {
        if (!this.commandHistory.length) return "\nNo command history"
        return "\n" + this.commandHistory.map((c, i) => `  ${i + 1}  ${c}`).join("\n")
      },

      "tree": () => "\n.\n" + this.buildTree(this.fileSystem),

      "coffee": () => `
    ( (
     ) )
  ........
  |      |]
  \\      /
   \`----'  ☕ Brewing... Coffee mode activated!`,

      "hack": () => {
        this.invalidCommandCount++
        return "\n[SECURITY] Hack attempt logged. IP traced. FBI notified. (Just kidding)"
      },

      "vim":   () => "\n[ERROR] vim: command not found\n[HINT] Thank goodness. Use a real editor. 😉",
      "emacs": () => "\n[ERROR] Not enough RAM to run emacs",
    }

    if (handlers[cmd] === undefined) return undefined

    const result = handlers[cmd]()
    if (result !== null) {
      this.typeText(result, () => this.showPrompt())
    } else {
      this.showPrompt()
    }
    return true
  }

  // ─── Terminal helpers ──────────────────────────────────────────────────────

  showPrompt() {
    this.term.write(`\r\n\x1b[32m${this.currentPath} $ \x1b[0m`)
  }

  typeText(text, callback, speed = 5) {
    this.isTyping = true
    const lines = text.split("\n")
    let i = 0

    const typeNextLine = () => {
      if (i >= lines.length) {
        this.isTyping = false
        if (callback) callback()
        return
      }

      const line = lines[i]
      let j = 0

      const typeChar = () => {
        if (j < line.length) {
          this.term.write(line[j])
          j++
          setTimeout(typeChar, speed)
        } else {
          this.term.write("\r\n")
          i++
          setTimeout(typeNextLine, speed)
        }
      }

      typeChar()
    }

    typeNextLine()
  }
}
