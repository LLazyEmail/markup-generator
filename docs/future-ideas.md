# Future ideas (harvested from legacy code)

Ideas from the removed `old/` folder (see [legacy-notes.md](./legacy-notes.md))
that could be revisited in v4.x. None are committed work.

1. **Source validation in `@llazyemail/cli`** — port `checkErrors` / `checkWarnings`
   as pure functions returning structured results (`{ level, message }[]`) instead
   of printing; let the CLI do colouring. Source: `old/command-line-methods.js`.
2. **HTML sanity check** — replace the 5000-char substring heuristic of `checkHtml`
   with a parser-based check (e.g. "body contains at least one `<table>`").
   Source: `old/command-line-methods.js`.
3. **Template option guards** — `title` / `bodyContent` / `previewText` required-option
   errors could become a typed validator in `@llazyemail/template`, with messages
   kept as exported constants. Source: `old/command-line-methods.js`, `old/constants.js`.
4. **Logger abstraction** — a tiny `printMessage(level, msg)` with pluggable output
   (chalk-free by default) so the core stays dependency-light.
5. **Fixtures** — the HackerNoon newsletter (`old/source.md`) and the front-matter
   recipe menu (`old/03-source-frontmatter.md`) were good real-world inputs; if
   needed, re-add trimmed copies under `tests/fixtures/` from git history.
6. **Front-matter driven lists** — the `recipes:` YAML array (title, subtitle,
   image, link) is a nice generic "card list" model for templates.
