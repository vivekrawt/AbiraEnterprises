# Abira Enterprises website

This is a static React website built with Vite. It has a home page for the company overview and enquiries, plus a separate searchable product catalogue with category and subcategory listings. Cart and search state are shared between the two views.

## Run locally

Requires Node.js 22.12 or later. No database or backend server is needed.

```powershell
cd "C:\Users\vivek\Desktop\fast\projects\packaging\packaging-site"
npm install
npm run dev
```

Open http://127.0.0.1:5173. Press Ctrl+C to stop. To create the deployable site, run `npm run build`; the static output is in `dist/`.

## Contact information and packaging briefs

Contact details and EmailJS identifiers are set in `client/public/settings.js`. The general enquiry form sends a visitor's contact details and requirements to the configured business email through EmailJS and shows a copyable/downloadable brief. Set the EmailJS template recipient to `{{to_email}}`; template fields can use `{{name}}`, `{{business}}`, `{{email}}`, `{{reply_to}}`, `{{phone}}`, `{{details}}`, and/or `{{message}}`. The form sends only after the visitor submits; enquiry details are not stored by the website.

## Shopping cart order requests

Product cards across the catalogue and search results let visitors add quantities starting at 10 units. The catalogue is available from the header menu or the home-page **Explore Products** button. Search is centered in the header and submits results to the catalogue from either view. The cart is saved in `sessionStorage` for the current browser tab. It has no prices or payment checkout; visitors can submit their organization and contact details to email an itemized order list directly to the configured business email. The `{{message}}` and `{{order_table}}` template fields contain a clearly labeled plain-text list. For a formatted HTML table, add `{{{order_table_html}}}` to the EmailJS template's HTML body. No cart PDF is generated or attached.

## Files

- `client/src/components/` — React page sections and product galleries
- `client/src/styles.css` — design and responsive layout
- `client/src/data/catalogue.json` — product image catalogue
- `client/public/assets/` — product imagery and the supplied homepage reference used in the hero
- `client/public/settings.js` — public business contact details
- `client/src/components/CartDialog.jsx` — session cart and email order requests
- `shared/collections.js` — descriptions for the six collections

The image named `reference-homepage.png` is the user-provided visual reference. The hero displays its right-side packaging scene; the text, navigation and product cards are real page elements.
