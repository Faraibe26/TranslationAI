# Fix Vercel Environment Variable Issue

## Problem
Vercel environment variables keep getting erased after saving. This is likely because:
1. Environment variable is not persisting across deployments
2. It's set for wrong environment (Production vs Preview vs Development)
3. Frontend is deploying before backend URL is available

## Solution: Set Environment Variable in Vercel Dashboard

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Click on project: `translation-ai-phi`

### Step 2: Navigate to Settings → Environment Variables
1. Click **Settings** tab (top navigation)
2. Left sidebar → **Environment Variables**

### Step 3: Add the Backend URL
1. Click **Add New** button
2. Fill in:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://www.translationai-production.up.railway.app`
   - **Environments:** Select ALL (✓ Production, ✓ Preview, ✓ Development)
3. Click **Add**

### Step 4: Redeploy
1. Go back to **Deployments** tab
2. Find your latest deployment
3. Click **...** (three dots) → **Redeploy**
4. Click **Redeploy** again to confirm

### Step 5: Verify
1. Wait for deployment to complete
2. Visit https://translation-ai-phi.vercel.app
3. Open DevTools Console (F12)
4. Try to translate something
5. Should see no CORS errors

## If Problem Persists

### Check What URL Frontend Is Using
Open browser console (F12) on Vercel site and run:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

If it shows `undefined`, the environment variable wasn't loaded.

### Force Clear Vercel Cache
1. In Vercel Settings
2. Find the deployment
3. Click **...** → **Redeploy with cache cleared**

### Alternative: Use .env.production in Git
If Vercel dashboard keeps erasing variables, we can commit them to git:

Create `frontend/.env.production`:
```
VITE_API_URL=https://www.translationai-production.up.railway.app
```

This file will be read during build and won't be erased.

## Backend URL Details
- **Production URL:** https://www.translationai-production.up.railway.app
- **Health Check:** https://www.translationai-production.up.railway.app/
- **Translate Endpoint:** https://www.translationai-production.up.railway.app/api/translate

## Testing the Connection
```bash
# Test health check
curl https://www.translationai-production.up.railway.app/

# Test translation endpoint
curl -X POST https://www.translationai-production.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","target_language":"es"}'
```

## Expected Flow
1. User visits Vercel frontend
2. Frontend reads `VITE_API_URL` environment variable
3. Frontend makes POST request to `https://www.translationai-production.up.railway.app/api/translate`
4. Railway backend responds with translation
5. Frontend displays result

If environment variable is not set, frontend falls back to `http://localhost:8000` which doesn't exist on Vercel, causing error.
