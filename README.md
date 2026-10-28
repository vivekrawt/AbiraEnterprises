# Abira Enterprises website

This is a static React website built with Vite. It follows the supplied homepage reference: a white and navy header, a wide packaging hero, a benefits row and a ten-item product grid. The product images and galleries come from the supplied packaging folders.

## Run locally

Requires Node.js 22.12 or later. No database or backend server is needed.

```powershell
cd "C:\Users\vivek\Desktop\fast\projects\packaging\packaging-site"
npm install
npm run dev
```

Open http://127.0.0.1:5173. Press Ctrl+C to stop. To create the deployable site, run `npm run build`; the static output is in `dist/`.

## Contact information and packaging briefs

Edit `client/public/settings.js` to add your phone number, email address, city and WhatsApp number. The WhatsApp number must include the country code and use digits only. Blank entries stay hidden. The form generates a brief in the visitor’s browser and offers copy, download, and a WhatsApp link once you add a number. No visitor details are saved or sent automatically.

## Files

- `client/src/components/` — React page sections and product galleries
- `client/src/styles.css` — design and responsive layout
- `client/src/data/catalogue.json` — product image catalogue
- `client/public/assets/` — product imagery and the supplied homepage reference used in the hero
- `client/public/settings.js` — public business contact details
- `shared/collections.js` — descriptions for the six collections

The image named `reference-homepage.png` is the user-provided visual reference. The hero displays its right-side packaging scene; the text, navigation and product cards are real page elements.
