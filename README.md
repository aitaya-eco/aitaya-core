# aitaya.ng — waitlist

Static site + one serverless function. No build step, no framework.

- `index.html` + `assets/` — the site (three.js vendored locally, brand font bundled)
- `api/waitlist.js` — POST {email} → same Postgres `waitlist` table as before, using the `DATABASE_URL` env var already set in the Vercel project. GET returns the signup count.
- `vercel.json` — tells Vercel to serve static files and build only the api function; it overrides the old Next.js project settings automatically.

Deploy = push to main. Nothing to configure.
