# Tori Kafati — Portfolio

A personal portfolio built with Ruby on Rails 8.

Also includes a hidden terminal easter egg.
Press `~` anywhere and pretend you’ve hacked the mainframe.

---

## Stack (aka: The Adult Choices)

- **Ruby 3.x / Rails 8.1**  because I like living in the present
- **PostgreSQL**  relational & stable
- **Tailwind CSS** (`tailwindcss-rails`)
- **Hotwire** (Turbo + Stimulus)
- **xterm.js** only for the fake hacker terminal in a browser
- **Propshaft** modern asset pipeline
- **Solid Queue / Solid Cache** DB-backed jobs and caching, no Redis required

Just Rails being Rails.

---

## Setup

If you insist on running it locally:

```bash
bundle install
rails db:create db:migrate db:seed
bin/dev
```

That’s it. No yak shaving ceremony required.

---

## Security

This is a read-only portfolio site.
There are no user accounts.
No stored form submissions.
No admin panel lurking in the shadows.

The realistic attack surface is basically decorative.

Still, security matters, even when the blast radius is tiny.

### What’s Actually in Place

#### Rails Built-Ins

Modern Rails already ships with:

- CSRF protection on all state-changing requests
- Automatic HTML escaping (XSS prevention)
- Content-Security-Policy headers
- Strong parameters in controllers
- Parameterized queries via ActiveRecord (SQL injection prevention)

In other words: Rails is not a toy framework which is why I love it.

#### The Terminal Easter Egg

Yes, there’s a fake terminal.

No, it does not execute anything.

It runs entirely in client-side JavaScript using xterm.js.
There is no shell. No subprocess. No database interaction. No server execution.

Before processing commands, the controller runs a blocklist check (`isMalicious`) that rejects:

- `;`, `&`, `|`
- `rm -rf`
- fork bombs
- `eval`, `exec`, `sudo`
- command substitution (`$()`)
- redirect operators

Is this overkill for a terminal that does nothing?
Absolutely.

Is it a deliberate demonstration of defensive thinking and injection awareness?
Also yes.

The sanitization is real.
The danger is fictional.
Much like most hacker movies.

#### Brakeman — Static Analysis

```bash
bundle exec brakeman
```

Brakeman scans Rails code without running it and flags patterns like:

- SQL injection via string interpolation
- Unsafe `render` usage
- Unescaped output (XSS risk)
- Mass assignment issues
- Hard-coded secrets

It’s not runtime monitoring.
It’s just a code reviewer that never gets tired.

Rails 8 includes it by default in development/test.

#### bundler-audit — Dependency CVE Scanning

```bash
bundle exec bundler-audit check --update
```

Checks `Gemfile.lock` against the Ruby Advisory Database for known vulnerabilities.

Because even if your code is clean, your dependencies might be living recklessly.

Also included by default in Rails 8.

### Honest Assessment

This project is intentionally simple.

The security tooling exists because:

- Good habits scale
- Rails apps can still have sharp edges
- Dependencies deserve scrutiny
- Security-aware development is part of real-world engineering

Even when the app is “just a portfolio.”

---

## Running Security Checks

```bash
bundle exec brakeman
bundle exec bundler-audit check --update
```

You probably won’t find anything.
But that’s the point.

---

## Development

```bash
bin/dev
```

Starts Rails + Tailwind watcher.

Open the site.
Press `~`.
Pretend you’re in a 2003 hacker film.

Alive for cheap and free for now:
[text](https://portfolio-5ihm.onrender.com/)