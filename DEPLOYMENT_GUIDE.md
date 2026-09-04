# 🚀 Loom AI — 100% Free Deployment Guide (Netlify & Vercel)

This repository is pre-configured for **instant, zero-cost deployment** on **Vercel** or **Netlify**.

Thanks to the **Autonomous Embedded Factory Engine**, the demo functions **100% complete and ultra-fast with zero backend setup required**! Every workspace (Executive Overview, Production Intelligence, Breakdowns, Root Cause Analysis, Anomalies, Loss Impact, and Revenue & Loss) works out of the box with the authentic Ashok Textile Mills dataset.

---

## ⚡ Quick Comparison

| Deployment Option | Setup Time | Cost | Backend Setup Required? |
| :--- | :--- | :--- | :--- |
| **Option 1: Vercel (Recommended)** | 2 minutes | **FREE** | ❌ No (Pre-cached real mill data) |
| **Option 2: Netlify** | 2 minutes | **FREE** | ❌ No (Pre-cached real mill data) |
| **Option 3: Full-Stack (Vercel/Netlify + Render)** | 5 minutes | **FREE** | ✅ Yes (Render.com free Python service) |

---

## Option 1: Deploy Free to Vercel (Recommended)

Vercel provides the fastest edge hosting for Vite/React applications.

### Step-by-Step:
1. **Push your code to GitHub**:
   Ensure your latest code is pushed to your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure Vercel and Netlify free deployment"
   git push origin main
   ```

2. **Log into Vercel**:
   - Go to [https://vercel.com](https://vercel.com) and sign in with GitHub.

3. **Import Project**:
   - Click **"Add New..."** → **"Project"**.
   - Find and select your **`Loom-AI`** repository, then click **Import**.

4. **Configure Project Settings**:
   The repository already includes `vercel.json` and root `package.json`. 
   - **Framework Preset**: `Vite` (automatically detected).
   - **Root Directory**: Leave as `./` (or select `v2/frontend` if you prefer).
   - **Build Command**: `npm run build` (auto-detected).
   - **Output Directory**: `dist` (or `v2/frontend/dist`).

5. **Click "Deploy"**:
   - Vercel will build the frontend in ~45 seconds.
   - Your site is now live at `https://loom-ai-xxxx.vercel.app`!

---

## Option 2: Deploy Free to Netlify

Netlify is another excellent free option. The repository already includes a pre-configured `netlify.toml`.

### Step-by-Step:
1. **Log into Netlify**:
   - Go to [https://www.netlify.com](https://www.netlify.com) and sign in with GitHub.

2. **Add New Site**:
   - Click **"Add new site"** → **"Import an existing project"**.
   - Select **GitHub** and choose your **`Loom-AI`** repository.

3. **Verify Build Settings**:
   Netlify will automatically read `netlify.toml` from the repository:
   - **Base directory**: `v2/frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `v2/frontend/dist`

4. **Click "Deploy Loom-AI"**:
   - Netlify will build and publish your site in ~1 minute.
   - Your site is live at `https://your-app-name.netlify.app`!

---

## Option 3 (Optional): Connect a Live Cloud Python Backend on Render

If you want the real **Python FastAPI backend + SQLite database** running live in the cloud alongside your frontend:

### 1. Deploy the Backend to Render (100% Free):
1. Go to [https://render.com](https://render.com) and sign in.
2. Click **"New +"** → **"Web Service"**.
3. Connect your GitHub repository `Loom-AI`.
4. Configure the service settings:
   - **Name**: `loom-ai-backend`
   - **Region**: Singapore or Frankfurt (closest to your location)
   - **Root Directory**: `v2/backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: **Free**
5. Click **"Create Web Service"**.
6. Once deployed, Render will give you a public URL like:
   `https://loom-ai-backend.onrender.com`

### 2. Connect Your Frontend (on Vercel or Netlify) to the Backend:
1. Go to your **Vercel** or **Netlify** project dashboard.
2. Go to **Settings** → **Environment Variables**.
3. Add a new variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://loom-ai-backend.onrender.com` (your Render URL without trailing slash)
4. Trigger a **Redeploy**.
5. The frontend will now automatically query your cloud FastAPI backend! If Render ever sleeps or has a cold start, the frontend automatically and transparently uses the embedded factory snapshot so your demo never freezes.

---

## 🛡️ Built-in Failsafe: Why This Demo Cannot Fail

- **Zero-Latency In-Memory Snapshot**: Real factory telemetry for Ashok Textile Mills (all 192 looms, 50 root-cause candidate events, 8 deep investigation dossiers, anomaly clusters, loss waterfall, and ₹18.42L revenue attribution) is bundled into the client.
- **Auto-Detecting API Client**: `api.ts` first attempts to reach your cloud backend or local server. If unreachable or offline, it transparently falls back to the embedded factory snapshot.
- **SPA Routing Rules**: Both `vercel.json` and `netlify.toml` include rewrites for `/* -> /index.html`, ensuring page refreshes and deep links never trigger 404s.

---

## 🧪 Local Testing Before Deploying

You can verify the production build locally at any time:

```bash
# Build production bundle
npm run build

# Preview the exact production build locally
cd v2/frontend
npm run preview
```
Visit `http://localhost:4173` to test the production bundle locally!
