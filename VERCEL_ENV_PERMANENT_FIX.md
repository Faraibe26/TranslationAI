# Vercel Environment Variable Setup - PERMANENT FIX

## Why Variables Keep Disappearing

Vercel's dashboard environment variables can get reset if:
1. You redeploy without the variables saved in code
2. Team members have different permissions
3. You're in Preview vs Production environment

## PROPER SOLUTION: Commit to Git

Instead of relying on the Vercel dashboard, commit environment files to git:

### Step 1: Get Your Railway Backend URL

1. Go to: https://railway.app
2. Log in and find your "pharmalingo-backend" service
3. Click on the service
4. Look for the "Public URL" or "URL" field
5. Copy the full URL (should look like: `https://xxxxx.up.railway.app`)

### Step 2: Update .env.production in Your Git Repo

```bash
cd /Users/faraibekhan/TranslationAI/frontend
```

Replace the URL in `.env.production`:
```
VITE_API_URL=https://YOUR-RAILWAY-URL-HERE
```

### Step 3: Commit and Push

```bash
cd /Users/faraibekhan/TranslationAI
git add frontend/.env.production
git commit -m "Add production environment variable with Railway backend URL"
git push origin main
```

### Step 4: Vercel Will Auto-Detect

When you push to GitHub, Vercel will:
1. See the `.env.production` file
2. Use it during build time
3. No manual Vercel dashboard changes needed

## Verify It Works

After pushing:
1. Check Vercel dashboard: https://vercel.com/dashboard
2. Click on your "translation-ai-phi" project
3. Go to "Deployments" tab
4. Wait for new deployment to complete (should show green checkmark)
5. Visit: https://translation-ai-phi.vercel.app
6. Try translating - it should now connect to Railway!

## If Still Having Issues

Check the browser console (F12):
- Open DevTools
- Go to Console tab
- Try translating
- Look for error messages - they'll show what URL it's trying to connect to

## Environment Files in This Project

```
frontend/
  .env.local          <- Local development (localhost:8000)
  .env.production     <- Production on Vercel (Railway URL)
```

Vercel automatically uses `.env.production` when deploying to production.
