# Project instructions

## Shared site header
- For every new Agrismart page, use the navigation markup in `index.html` as the source of truth. Copy that homepage header instead of recreating it from scratch.
- Load `css/header.css` and the shared header scripts used by the homepage (`js/header.js`, `js/theme.js`, `js/language.js`, and `js/auth.js`) so layout, mobile navigation, theme, language, and authentication stay consistent.
- Include the inline SVG icon sprite from `index.html` whenever the copied header references its icon symbols.
- Change only the logo destination and page-specific active navigation state as needed; preserve the shared structure and styling.
- Link the shared Contact navigation item to `contact.html` on every page; keep the home page footer anchor distinct from the page route.