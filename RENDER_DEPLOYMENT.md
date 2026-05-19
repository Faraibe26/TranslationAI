# Render.com Deployment Guide for PharmaLingo Backend

## Step 1: Create a Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended - easier deployment)
3. Authorize Render to access your GitHub account

## Step 2: Create a New Web Service
1. Click **New +** button in Render dashboard
2. Select **Web Service**
3. Select your GitHub repository: `Faraibe26/TranslationAI`
4. Connect it

## Step 3: Configure the Web Service

### Basic Settings
- **Name:** `pharmalingo-backend` (or similar)
- **Environment:** `Docker`
- **Region:** Choose closest to you (e.g., Oregon, Ohio)
- **Branch:** `main`

### Build & Deploy
- **Root Directory:** `backend` (important!)
- **Dockerfile Path:** `backend/Dockerfile`

### Environment Variables
No need to set any - the app uses defaults (PORT=8080 is Render's default)

### Auto-Deploy
- ✅ **Auto-deploy new pushes** (recommended)

## Step 4: Click Deploy
Render will:
1. Clone your repo
2. Build Docker image
3. Deploy container
4. Give you a URL like: `https://pharmalingo-backend.onrender.com`

## Step 5: Update Frontend with Backend URL
Once deployed:
1. Copy your Render URL (e.g., `https://pharmalingo-backend.onrender.com`)
2. Update `frontend/.env.production`:
```
VITE_API_URL=https://pharmalingo-backend.onrender.com
```
3. Commit and push
4. Vercel will auto-redeploy

## Expected Timeline
- Build: 2-3 minutes
- Deploy: 1-2 minutes
- Total: 3-5 minutes

## Testing
Once deployed:
```bash
# Test health check
curl https://pharmalingo-backend.onrender.com/

# Test translation
curl -X POST https://pharmalingo-backend.onrender.com/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","target_language":"es"}'
```

## Key Differences from Railway
✅ Simpler configuration
✅ No port conflicts (Render uses 10000 internally, handles proxy)
✅ Free tier available
✅ Better documentation
✅ More reliable health checks

## If Deployment Fails
Check Render logs for errors. Common issues:
- Missing `backend/Dockerfile` - make sure it exists
- Python import errors - verify `requirements.txt`
- Port issues - Render assigns dynamically, our app handles it

Good luck! 🚀
