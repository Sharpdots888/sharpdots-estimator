# Deploying the Estimator to Heroku

Run these commands from a normal Terminal on your Mac:

```bash
cd "/Volumes/JTMMX/Users/JT/Documents/New project"
git init
git add .
git commit -m "Deploy estimator app"
git branch -M main
heroku create sharpdots-estimator
git push heroku main
heroku open
```

If `sharpdots-estimator` is already taken, use a unique app name:

```bash
heroku create sharpdots-estimator-jt
```

If you already created a Heroku app in the dashboard, connect this folder to it instead:

```bash
heroku git:remote -a YOUR-HEROKU-APP-NAME
git push heroku main
heroku open
```

The app starts with:

```bash
node server.js
```

Heroku reads that from the included `Procfile`.

## Space-Fold Portal SSO Receiver

The Estimator can receive launch links from Space-Fold Portal in this form:

```text
https://quoting-proposals-1bd7339045ad.herokuapp.com/?sso_token=...
```

On receipt, the server validates the token against the portal, creates a signed Estimator session cookie, and redirects to the same page without the token in the URL.

Configuration:

| Variable | Purpose |
| --- | --- |
| `SPACEFOLD_PORTAL_URL` | Portal base URL. Defaults to `https://portal.space-fold.com`. |
| `ESTIMATOR_SESSION_SECRET` | Secret used to sign Estimator session cookies. Use a stable secret before production enforcement. Falls back to `SESSION_SECRET` when present. |
| `ESTIMATOR_AUTH_MODE` | `portal-token-preferred` by default. Set to `portal-token-required` after confirming portal launch and session behavior. |
| `ESTIMATOR_SESSION_TTL_HOURS` | Estimator session lifetime. Defaults to `8`. |

Rollout guidance:

1. Deploy with `ESTIMATOR_AUTH_MODE=portal-token-preferred` first to verify portal launch creates a session without blocking direct internal access.
2. Smoke check `/api/auth/me` after launching from the portal.
3. Switch to `ESTIMATOR_AUTH_MODE=portal-token-required` only after the portal launcher path is confirmed for the internal team.
