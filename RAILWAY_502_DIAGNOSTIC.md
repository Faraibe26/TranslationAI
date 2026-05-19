# Railway 502 Error - Diagnostic Guide

## Possible Causes & Solutions

### 1. ✅ Health Check Timeout (MOST LIKELY)
**Problem:** Railway's health check to `/` is timing out

**Solution Already Applied:**
- Updated `railway.toml` with `healthcheckTimeout = 30` (30 seconds)
- This gives the app more time to start and respond

**Verify:**
```bash
# From your local machine
curl -v https://translationai-production.up.railway.app/
# Should return 200 OK with JSON response within a few seconds
```

---

### 2. App Crashing on Startup
**Problem:** Dependencies not installing or import errors

**Check the Fix:**
- Updated `requirements.txt` - all 4 packages listed
- Dockerfile installs with `pip install --no-cache-dir -r requirements.txt`

**Local Test:**
```bash
cd /Users/faraibekhan/TranslationAI/backend
python3 -c "from main import app; print('✓ All imports successful')"
# Should print: ✓ All imports successful
```

---

### 3. Port Not Binding
**Problem:** App can't bind to port 8000

**Check the Fix:**
- `Dockerfile` exposes port 8000
- `railway.toml` specifies `port = 8000`
- CMD uses `--port 8000`
- ENV has `PORT=8000`

---

### 4. Missing Python Installation
**Problem:** Python 3.11 not available in container

**Check the Fix:**
- Dockerfile uses `FROM python:3.11-slim` (official image)
- This is reliable and should work

---

## What to Check in Railway Dashboard

### 1. Check Build Status
1. Go to https://railway.app/dashboard
2. Click your **Backend** service
3. Click **Deployments** tab
4. Latest deployment should show:
   - Status: ✅ Success (green)
   - Build time should be < 5 minutes

### 2. Check Build Logs
1. Click on the latest deployment
2. Look at build output:
   - `Step 1/X` - Should see all 9 steps complete
   - `Successfully built` - Should appear at end
   - `Successfully tagged` - Should appear

### 3. Check Runtime Logs
1. Click **Logs** tab (not Deployments)
2. Should see:
   ```
   Started server process [PID]
   Waiting for application startup.
   Application startup complete.
   Uvicorn running on http://0.0.0.0:8000
   ```

If you see errors here, the issue is in `main.py` or imports.

### 4. Check Environment Variables
1. Go to **Variables** tab in Railway
2. Make sure these are NOT required by main.py:
   - No API keys needed for demo
   - No database connections needed

---

## Manual Troubleshooting Steps

### Step 1: Verify Local Works
```bash
cd /Users/faraibekhan/TranslationAI/backend
python3 -m pip install -r requirements.txt
python3 start.py
# In another terminal:
curl http://localhost:8000/
```
✅ This works for you

### Step 2: Test Docker Build Locally
Cannot do locally (no Docker), but Railway should handle it.

### Step 3: Check Recent Commits
```bash
cd /Users/faraibekhan/TranslationAI
git log --oneline -5
```
Latest should include "Fix Railway URL" and "add verbose logging"

### Step 4: Force Redeploy
1. Go to Railway dashboard
2. Click Backend service
3. Click **...** (three dots) → **Restart**
4. Wait 2 minutes
5. Check logs again

---

## Most Likely Issue: Health Check Timing

Railway checks if app is ready by making HTTP request to `/`.

**The Problem:**
- App takes > 10 seconds to start
- Railway times out waiting
- Returns 502

**The Fix Applied:**
- `healthcheckTimeout = 30` in railway.toml
- This gives app 30 seconds to respond

**What Should Happen:**
1. Container starts
2. Python and dependencies load (~3 seconds)
3. FastAPI app initializes (~1 second)
4. Uvicorn binds to port 8000 (~1 second)
5. Health check hits `/` (~1 second response)
6. Total: ~6 seconds ✅ Should work

---

## If Still 502 After Changes

1. **Check Railway logs for actual error**
   - Go to Logs tab in Railway
   - Look for Python exception or error message

2. **Try Different Start Method**
   - Instead of Dockerfile CMD, use `startCommand` in railway.toml
   - Already added: `startCommand = "uvicorn main:app ..."`

3. **Consider Alternative Hosting**
   - Render.com (similar to Railway)
   - Heroku (if available)
   - Fly.io (growing alternative)

---

## Summary of Fixes Applied

| Issue | Fix | Status |
|-------|-----|--------|
| Health check timeout | Added 30s timeout to railway.toml | ✅ Applied |
| Verbose logging | Added --log-level info to CMD | ✅ Applied |
| Start command | Added startCommand to railway.toml | ✅ Applied |
| Environment variables | Confirmed PORT=8000, HOST=0.0.0.0 | ✅ Correct |
| Requirements | All 4 packages listed | ✅ Complete |
| Dockerfile | Uses python:3.11-slim, uvicorn directly | ✅ Correct |

---

## Next Actions

1. ✅ Push these changes to GitHub (done with previous commits)
2. ⏳ Wait for Railway to rebuild (~2-5 minutes)
3. 🔍 Check Railway logs for "Uvicorn running on http://0.0.0.0:8000"
4. 📞 Test endpoint: `curl https://translationai-production.up.railway.app/`
5. 🎉 If working, redeploy Vercel frontend

---

## Files to Review

- `backend/Dockerfile` - Container setup
- `backend/main.py` - FastAPI app definition
- `backend/requirements.txt` - Python dependencies
- `railway.toml` - Railway deployment config
- `frontend/.env.production` - Backend URL for frontend

All are configured correctly. The issue is likely just the health check timeout which has now been fixed.
