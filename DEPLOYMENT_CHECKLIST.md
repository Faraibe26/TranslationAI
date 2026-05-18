# 📋 PharmaLingo Deployment Checklist

Copy this and follow step-by-step:

## **Step 1: Deploy Backend (5 minutes)**

- [ ] Go to https://railway.app
- [ ] Sign up with GitHub
- [ ] Click "New Project" → "Deploy from GitHub repo"
- [ ] Select `Faraibe26/TranslationAI`
- [ ] Wait for deployment to complete
- [ ] Copy the Railway URL (look for Service Domain)
- [ ] Example: `https://pharmalingo.railway.app`

## **Step 2: Deploy Frontend (5 minutes)**

- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub
- [ ] Click "Add New Project"
- [ ] Select `TranslationAI`
- [ ] Set Root Directory: `frontend`
- [ ] Add Environment Variable:
  - Name: `VITE_API_URL`
  - Value: `https://pharmalingo.railway.app` (from Step 1)
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Copy your Vercel URL
- [ ] Example: `https://pharmalingo.vercel.app`

## **Step 3: Test (2 minutes)**

- [ ] Open your Vercel URL in browser
- [ ] Try translating text
- [ ] Test Vietnamese, Korean, Chinese (Taiwan)
- [ ] Test dark mode
- [ ] Test voice input/output

## **Step 4: Share! 🚀**

Send this URL to pharmacy staff:
```
https://pharmalingo.vercel.app
```

That's it! No installation needed for them. ✅

---

## **If Something Goes Wrong**

**Error: "Cannot connect to backend"**
- Check Railway is still running (go to railway.app dashboard)
- Verify VITE_API_URL is correct in Vercel
- Wait a few minutes and refresh

**Error: "CORS error"**
- Railway has CORS enabled by default
- Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

**Backend shows as offline on Railway**
- Go to Railway → Your Project → Logs
- Check for errors
- Click "Redeploy" button

---

## **Key URLs to Remember**

- GitHub: https://github.com/Faraibe26/TranslationAI
- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard

---

**All set! Your PharmaLingo app is ready to share! 💊**
