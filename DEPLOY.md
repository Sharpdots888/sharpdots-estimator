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
