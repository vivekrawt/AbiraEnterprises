# Abira Enterprises — MERN website

The original Abira design has been migrated to **MongoDB, Express, React and Node.js**. It retains all six collections, all 112 supplied images, responsive layouts, galleries, category filters, FAQs and contact settings. Enquiries now go through the Express API and are saved in MongoDB. This is a full application, not a static HTML page wrapped in React.

## Run on Windows

Prerequisites: Node.js 22.12 or newer and either a running MongoDB Community Server or a MongoDB Atlas connection. Node.js and the npm packages are already available in this checkout. MongoDB is not installed as a system service by this migration.

```powershell
cd "C:\Users\vivek\Desktop\fast\projects\packaging\packaging-site"
npm install
# On a fresh checkout only; do not overwrite an existing configured .env:
Copy-Item .env.example .env
```

An `.env` with the local default has already been created here. Set `MONGODB_URI` to your running MongoDB database. The local default is:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/abira_packaging
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
TRUST_PROXY=0
```

Then run:

```powershell
npm run dev
```

Open **http://127.0.0.1:5173**. The API runs on port 5000. Vite proxies `/api` requests, so there is no browser-side database connection. The catalogue is seeded automatically at server startup; repeat starts update catalogue records without deleting enquiries. Stop with Ctrl+C.

If the API reports that MongoDB is unavailable, start your local MongoDB service or use a valid Atlas URI in `.env`. Do not put the URI in frontend code or `settings.js`.

## Docker alternative

With Docker Desktop installed and running, launch both the website and MongoDB:

```powershell
docker compose up --build -d
```

Open **http://localhost:5000**. MongoDB uses the persistent `abira-mongo` volume. `docker compose down` stops the app while retaining the database; adding `-v` would delete it. Docker is optional and was not installed by this migration.

For frontend development with only MongoDB in Docker, run `docker compose up -d mongo` and then `npm run dev`.

## Run the production build locally

With MongoDB available and `.env` configured:

```powershell
npm run build
$env:NODE_ENV="production"
npm start
```

Open **http://localhost:5000**. Express serves the compiled React files and the API from one origin. `node server.mjs` is also a compatibility entry point to this server; it requires the same database and built frontend.

## Project structure

```text
client/
  src/
    components/       React sections, galleries, navigation and enquiry form
    App.jsx           Page composition and shared selection state
    api.js            API client
    styles.css        Existing responsive design
  public/
    assets/           All 112 product/reference images
    settings.js       Public phone, WhatsApp, email and city
  vite.config.js      React build and development proxy
server/
  app.js              Express routes, validation, limits and static serving
  index.js            Database connection and server lifecycle
  models.js           MongoDB Product and Enquiry models via Mongoose
  database.js         Connection and repeatable catalogue seed
  data/catalogue.json Source catalogue records
  tests/api.test.js   Integration tests using a temporary real MongoDB
shared/collections.js Collection descriptions used by React and Express
dist/                 Generated production build; edit client source instead
.env                  Private local database/runtime configuration (ignored)
```

## Contact details and content edits

Edit **`client/public/settings.js`** to add the phone, email, city and WhatsApp number. The WhatsApp number must contain country code and number as digits only. Blank values stay hidden. This is public configuration: never put passwords here. The enquiry form saves in MongoDB independently of these contact settings; WhatsApp is an optional follow-up link.

Collection text is in `shared/collections.js`; page copy is in the React components; visual styles are in `client/src/styles.css`. In development changes update through Vite. Rebuild and redeploy production after editing.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Database readiness |
| GET | `/api/collections` | Six collection descriptions |
| GET | `/api/products?collection=corrugated` | MongoDB product references; omit filter for all |
| POST | `/api/enquiries` | Validate and persist a customer enquiry |

The enquiry API uses a request UUID to prevent duplicates when retrying a lost response. It validates input and limits requests. No endpoint exposes customer enquiries publicly. View submissions in MongoDB Compass/Atlas under `abira_packaging.enquiries`; there is no admin dashboard or automatic email notification in this version. Keep database access restricted to authorised operators.

## Checks

```powershell
npm run build
npm test
```

Tests start a temporary real MongoDB process, download its binary from MongoDB if necessary, and stop it afterwards. They do not use `.env` or modify your business database. They cover catalogue seeding/filtering, persisted enquiries, duplicate retries, validation, malformed/oversized JSON, rate limiting, private enquiry access and database failure handling.

## Hosting the MERN version

The earlier private Sites URL still serves the original static website. It has not been replaced with a frontend whose backend is unavailable. The current Sites runtime does not host this conventional Node server and MongoDB connection.

Deploy this project to a Node.js or Docker-capable host with a persistent MongoDB database (local to the host or Atlas). Configure `MONGODB_URI`, `NODE_ENV=production`, the platform's `PORT`, and the correct `TRUST_PROXY` hop count if behind a proxy. Build with `npm ci && npm run build`; start with `npm start`. The supplied Dockerfile is an alternative. Serve the site over HTTPS. Production uses one origin for both React and `/api`, so no frontend API URL needs to be changed. Actual deployment needs a selected Node hosting account and database credentials.

The Docker Compose file is for local development and binds ports to loopback. It does not provision public hosting, database authentication or backups.

## References and source material

Design inspiration: https://packhelp.com/ and https://noissue.co/. Product/reference images come from the supplied packaging folders; originals remain unchanged. The original static source is retained locally under the ignored `review/static-original` directory.

Framework documentation: https://react.dev/learn, https://vite.dev/guide/, https://expressjs.com/, https://mongoosejs.com/docs/connections.html.
