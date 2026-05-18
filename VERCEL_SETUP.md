# 🚀 Vercel Environment Variable Setup Guide

## Step-by-Step Instructions

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Find and click on your **"translation"** project

### Step 2: Open Settings
1. Click **"Settings"** in the top navigation menu
2. On the left sidebar, click **"Environment Variables"**

### Step 3: Add the Environment Variable
1. Click the **"+ Add New"** button (usually in the top right)
2. Fill in the following fields:

   **Name:** 
   ```
   VITE_API_URL
   ```

   **Value:** 
   ```
   https://translationai-production.up.railway.app
   ```

3. Under "Select Environments", check ALL three boxes:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

4. Click **"Save"** or **"Add"**

### Step 4: Trigger a Redeploy
1. Go to **"Deployments"** tab (in the top menu)
2. Find your most recent deployment
3. Click the **"..."** (three dots) menu on the right
4. Select **"Redeploy"**
5. Wait 2-3 minutes for the deployment to complete

### Step 5: Test Your App
1. Once deployment is complete, visit your Vercel URL (should be something like `https://translation-nu-weld.vercel.app`)
2. Try translating a phrase
3. It should now work! 🎉

---

## If It Still Doesn't Work

**Check these things:**
1. Make sure `VITE_API_URL` is set in ALL three environments (Production, Preview, Development)
2. Make sure the value is exactly: `https://translationai-production.up.railway.app` (no trailing slash)
3. Wait for the redeploy to fully complete (check the deployment logs)
4. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

---

## Need Help?

If the 404 error persists:
1. Open your browser's **Developer Tools** (F12)
2. Go to the **Network** tab
3. Try translating something
4. Look for the failed request and check what URL it's trying to reach
5. Share that information for debugging
