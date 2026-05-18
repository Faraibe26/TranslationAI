# 🚀 PharmaLingo Deployment Guide

This guide shows you how to deploy PharmaLingo to the cloud using **Vercel** (frontend) and **Railway** (backend).

## **Quick Summary**

| Component | Platform | Cost | URL |
|-----------|----------|------|-----|
| **Frontend** | Vercel | Free | https://pharmalingo.vercel.app |
| **Backend** | Railway | Free (up to $5/month) | https://pharmalingo.railway.app |

---

## **Prerequisites**

- ✅ GitHub account (with your code pushed)
- ✅ Vercel account (free)
- ✅ Railway account (free)

---

## **Step 1: Deploy Backend to Railway** 🚂

### 1.1 Create Railway Account
1. Go to https://railway.app
2. Click "Sign Up"
3. Select "Continue with GitHub"
4. Authorize Railway to access your GitHub repos

### 1.2 Create New Project
1. Click "Create a New Project" or "New Project"
2. Select "Deploy from GitHub repo"
3. Search and select `Faraibe26/TranslationAI`
4. Click "Deploy Now"

### 1.3 Configure Environment
1. Once deployed, click your project
2. Go to the **Variables** tab
3. Add these variables:
   ```
   TRANSLATION_API_KEY=  (leave blank for demo mode)
   PYTHON_VERSION=3.11
   ```
4. Railway will auto-detect `requirements.txt` and deploy

### 1.4 Get Your Backend URL
1. Go to "Settings" tab
2. Look for "Service Domain" or "URL"
3. It will look like: `https://pharmalingo.railway.app`
4. **Copy this URL** - you'll need it for Vercel!

### 1.5 Enable CORS (Important!)
1. In your Railway project, go to "Settings"
2. Look for "Public Networking" 
3. Make sure it's enabled
4. Your backend is now public!

---

## **Step 2: Deploy Frontend to Vercel** ⚡

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Select "Continue with GitHub"
4. Authorize Vercel to access your GitHub repos

### 2.2 Import Your Project
1. Click "Add New..." → "Project"
2. Search and select `TranslationAI`
3. Vercel auto-detects it's a Vite project
4. Click "Import"

### 2.3 Configure Build Settings
In the "Configure Project" screen:

**Root Directory**: Select `frontend`

**Build Command**: 
```
npm run build
```

**Output Directory**: 
```
dist
```

**Environment Variables**: Click "Add Environment Variable"
- **Name**: `VITE_API_URL`
- **Value**: `https://pharmalingo.railway.app` (your Railway backend URL from Step 1.4)

### 2.4 Deploy
1. Click "Deploy"
2. Wait for the build to complete (usually 1-2 minutes)
3. You'll get a URL like: `https://pharmalingo.vercel.app`

---

## **Step 3: Test Your Deployment** ✅

1. Open your Vercel URL in a browser
2. Try translating a phrase
3. Select Vietnamese, Korean, or Chinese (Taiwan) to test the new languages
4. Test dark mode
5. Try voice input/output

---

## **Troubleshooting**

### **"Error translating text"**
- Check that your Railway backend is deployed and running
- Verify the `VITE_API_URL` environment variable in Vercel matches your Railway URL
- Make sure Railway is in "Public" mode (not private)

### **Backend shows 502 Error**
- Go to Railway dashboard
- Click your project
- Check the logs for errors
- Redeploy if needed

### **Voice features not working**
- Voice features require HTTPS (which both Vercel and Railway provide)
- Some browsers may require user permission

### **CORS Errors**
- Railway CORS middleware is already configured
- If you get CORS errors, redeploy both frontend and backend

---

## **Update Your Code Later**

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```
3. **Vercel** automatically redeploys on every push to `main`
4. **Railway** may need manual redeploy (click "Redeploy" button)

---

## **Share Your Deployment**

Once deployed, share your Vercel URL with others:
- **Frontend**: `https://pharmalingo.vercel.app`
- **No installation needed** - it's already running!
- **Works on mobile** - fully responsive!

---

## **Next Steps (Optional Enhancements)**

1. **Add a real translation API**
   - Get API key from Google Translate or DeepL
   - Set `TRANSLATION_API_KEY` in Railway variables
   - Update `backend/main.py` to use the API

2. **Add a custom domain**
   - Vercel: Go to Settings → Domains
   - Railway: Go to Settings → Domain
   - Both support custom domains

3. **Monitor performance**
   - Vercel: Analytics tab
   - Railway: Metrics tab

4. **Set up CI/CD**
   - Both Vercel and Railway auto-deploy on GitHub push
   - Add status badges to your README

---

## **Cost Breakdown**

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | ✅ Yes | $0 (unless you scale) |
| Railway | ✅ Yes ($5/month credit) | ~$0.001/hour (scales with usage) |
| GitHub | ✅ Yes | $0 (free for public repos) |
| **Total** | | **$0 - $5/month** |

---

## **Support & Questions**

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- GitHub: https://github.com/Faraibe26/TranslationAI

---

**Congratulations!** 🎉 Your PharmaLingo app is now deployed to the cloud!
