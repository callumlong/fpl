# Cal's Vibecoded FPL Dashboard 🧑‍💻

A mini-league FPL dashboard. Deployed on Vercel — no local setup needed for anyone using it.

---

## Deploy to Vercel (one-time setup, ~10 minutes)

### Step 1 — Create a GitHub account (if you don't have one)
Go to **github.com** and sign up for free.

### Step 2 — Fork this repository
1. Click the Fork button (top right)
2. Name it something like `cals-fpl`

### Step 3 — Create a Vercel account
Go to **vercel.com** → **Sign Up** → choose **Continue with GitHub**.
Authorise Vercel to access your GitHub account.

### Step 4 — Import your project
1. In Vercel, click **Add New → Project**
2. Find `cals-fpl` in the list and click **Import**
3. On the configure screen:
   - **Framework Preset**: leave as **Other**
   - **Root Directory**: leave blank
   - **Output Directory**: set to `public`
4. Click **Deploy**

Vercel will build and deploy in about 30 seconds.
You'll get a URL like `cals-fpl.vercel.app` — share this with your friends!

---

## Making updates later

Whenever you want to update the dashboard:
1. Go to your GitHub repository
2. Click on the file you want to change (e.g. `public/index.html`)
3. Click the pencil ✏️ icon to edit
4. Make your changes, click **Commit changes**
5. Vercel automatically redeploys within ~30 seconds

---

## Project structure

```
api/fpl.js        — Serverless function. Proxies requests to the FPL API.
                    Runs on Vercel's servers, so no CORS issues.

public/index.html — The full dashboard. Single self-contained HTML file.

vercel.json       — Tells Vercel how to route /api/fpl/* requests to the function.
```

---

## How the proxy works

The FPL API blocks direct browser requests (CORS). The `api/fpl.js` function
runs on Vercel's servers and fetches from FPL on behalf of the browser, then
returns the data. Responses are cached (30s for most endpoints, 5min for
bootstrap data) so the dashboard is fast and won't hammer the FPL API.

---

## Adding a custom domain (optional, later)

1. Buy a domain (Cloudflare Registrar is cheapest — cloudflare.com/products/registrar)
2. In Vercel: go to your project → **Settings** → **Domains** → **Add**
3. Type your domain name, click **Add**
4. Vercel shows you two DNS records to add
5. In Cloudflare DNS, add those two records
6. Done — usually propagates in under 2 minutes
