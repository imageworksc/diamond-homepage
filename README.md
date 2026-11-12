# Diamond Building Services — homepage (staging)

Redesign of the Diamond Building Services homepage.

Staging URL: https://imageworksc.github.io/diamond-homepage/

## Structure

```
index.html
css/styles.css
js/main.js
images/          photos, logos, favicon.svg, icons/ (service icons)
.nojekyll
```

No inline styles or scripts in the HTML: the only `<script>` is the deferred
`js/main.js`, and no element carries a `style` attribute. At runtime the
script sets two custom properties (`--hdr` on `<html>`, `--mnav-top` on the
mobile menu), because they depend on measured heights.

`js/main.js` is ES2015+ (`const`/`let`, arrow functions, no `var`) and carries
only what this page uses: mobile menu, sticky header state, scroll reveals.

Bump `?v=` on the CSS and JS links on every deploy that touches either file.

## Running inside Drupal

The live page sits in a field of the site theme, not on its own. These rules
keep it measuring the same in both places:

- `1rem = 10px`. The theme sets `html { font-size: 62.5% }`, and
  `css/styles.css` sets the same value, so staging matches. Media queries stay
  on the browser's 16px, so `48rem` in a query still means 768px.
- The page wrapper is `#db-main`. Never use `id="main"` or the class
  `section`: the theme caps both at 1000px.
- `#db-main` clears floats, so the theme's floated menu can't narrow the hero.
- Anything the page adds to the field needs the `html-wrapper` class, or the
  theme recolours its links. The utility bar, header, mobile menu, `main` and
  footer all carry it.
- Element-level rules are scoped with `:where(.field-html-code)`, so they
  don't reach the site's header and footer. `index.html` has the same
  wrapper. Keep it inside `:where()` so no `!important` is needed.
- 4K and 5K screens scale the page's own wrapper (`zoom` on
  `.field-html-code`), never the site's `<html>`.
- No inline width patches in the field. If one seems needed, the fix belongs
  in these files.

Before handing off a page, test it inside a copy of the live page, at
390, 768, 1440, 1920, 2560, 3840 and 5120 wide. Staging alone won't show
these conflicts.

## Pending from the client

- [ ] Real photos to replace the placeholders (hero, safety, project).
- [ ] Placeholder copy marked with a dotted underline: credentials, project,
      testimonial, email, office hours, year founded, client types.
