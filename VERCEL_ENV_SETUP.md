# Setting Up Vercel Environment Variable for Railway Backend

## Problem
The Vercel frontend is returning an "error" when you try to translate because it doesn't know where the backend API is located.

## Solution
You need to set the `VITE_API_URL` environment variable in Vercel to point to your Railway backend.

## Step-by-Step Instructions

### 1. Find Your Railway Backend URL

Go to your Railway dashboard:
- Visit: https://railway.app/dashboard
- Click on your "Backend" or "PharmaLingo" project
- Look for the **Deployments** tab
- Find your latest successful deployment
- Copy the **Public URL** (should look like `https://something.up.railway.app`)

**Common Railway URL patterns:**
- `https://backend-production-xxxx.up.railway.app`
- `https://pharmalingo-backend-xxxx.up.railway.app`
- Check your deployment logs for the exact URL

### 2. Test the Railway Backend

Before setting up Vercel, verify your Railway backend is actually working:

```bash
# Test the health check
curl https://your-railway-url/

# Test the translation endpoint
curl -X POST https://your-railway-url/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","target_language":"es"}'
```

Both should return successful responses without 502 errors.

### 3. Set Environment Variable in Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your project: `translation-ai-phi`
3. Go to **Settings** (top menu)
4. Select **Environment Variables** (left sidebar)
5. Click **Add New** and fill in:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-railway-url` (replace with actual Railway URL)
   - **Environments:** Select all (Production, Preview, Development)
6. Click **Save**

### 4. Redeploy Vercel

After setting the environment variable:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots (**...**) menu
4. Select **Redeploy**
5. Wait for the new deployment to complete (should take 1-2 minutes)

### 5. Test the Frontend

1. Visit: https://translation-ai-phi.vercel.app
2. Open browser DevTools (**F12** or **Cmd+Option+I**)
3. Go to **Console** tab
4. Try translating:
   - Select a language (e.g., Spanish)
   - Type: "Hello"
   - Click "Translate"
5. Check for errors in the console

**Expected successful response:**
```json
{
  "translated_text": "[ES] Hello",
  "source_language": "en",
  "target_language": "es"
}
```

## Troubleshooting

### Still Getting "error"?

1. **Check the console error message:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for the actual error message
   - Take a screenshot if needed

2. **Common issues:**
   - Wrong Railway URL
   - Railway backend returned 502 error
   - CORS configuration issue
   - Environment variable not saved properly

3. **Verify Railway is running:**
   ```bash
   curl https://your-railway-url/
   ```

4. **Check Vercel deployment logs:**
   - Go to Vercel dashboard
   - Click on the latest deployment
   - Check **Function Logs** or **Build Logs** for errors

### CORS Error in Console?

If you see a CORS error like:
```
Access to XMLHttpRequest at 'https://...' from origin 'https://translation-ai-phi.vercel.app' 
has been blocked by CORS policy
```

This means the backend isn't configured for Vercel. Check `backend/main.py` has:
```python
allow_origins=[
    ...
    "https://translation-ai-phi.vercel.app",
    ...
]
```

If missing, add it and push to GitHub to trigger a Railway rebuild.

## Quick Debug Commands

```bash
# Test backend health
curl https://YOUR_RAILWAY_URL/

# Test translation
curl -X POST https://YOUR_RAILWAY_URL/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"test","target_language":"es"}'

# Check if Railway is reachable
ping YOUR_RAILWAY_URL

# View Vercel env vars (from project root)
cat .env.local  # Shows local setup
```

## After Everything is Working

Once translations work on Vercel:
1. Test all 9 languages
2. Test voice input/output
3. Test dark mode toggle
4. Test translation history
5. Test on mobile (use responsive design)

## Support

If you're still having issues:
1. Share the exact error message from the console
2. Share your Railway URL (can mask the domain)
3. Verify the backend Dockerfile is using `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`
