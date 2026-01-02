# Deployment & Content Management Guide 🚀

This guide will walk you through deploying your personal journal website to the internet and how to keep it updated with new stories and art.

## 1. Database: MongoDB Atlas (Free)
You need a database that lives on the internet.
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new "Cluster" (choose the free tier).
3. Under "Network Access", allow access from `0.0.0.0/0` (this allows your deployed servers to connect).
4. Under "Database Access", create a user with a password.
5. Get your **Connection String** (looks like `mongodb+srv://<user>:<password>@cluster0...`).

---

## 2. Backend: Render (Free Tier)
1. Sign up for [Render](https://render.com/).
2. Create a "New Web Service" and connect your GitHub repository.
3. **Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Environment Variables**:
   - `MONGO_URI`: (Your MongoDB Atlas connection string)
   - `PORT`: `5000`

---

## 3. Frontend: Vercel (Free & Best for Next.js)
1. Sign up for [Vercel](https://vercel.com/).
2. Import your GitHub repository.
3. **Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: (The URL provided by Render, e.g., `https://my-journal-api.onrender.com/api`)

---

## 4. How to Update Content ✍️

### Method A: Using the Admin Page (Recommended)
You can use the built-in admin panel to add new journals, verses, and art without touching code.
1. Go to your live website URL + `/admin` (e.g., `https://feben-journal.vercel.app/admin`).
2. Fill out the forms and click "Send".
3. **Note on Images**: Since the project is deployed, you should provide an **Image URL** (like a link from Google Drive or a specialized image host) instead of just a filename.

### Method B: Manual Updates (Local)
If you prefer adding data manually as we did:
1. Edit `backend/seeds/journal.json`, `verses.json`, or `art.json` on your computer.
2. Add your new images to `frontend/public/images/`.
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Added a new art piece"
   git push origin main
   ```
4. Re-run your seed script if you want to wipe and restart the data (be careful, this deletes old entries).

---

## 6. Avoiding Slow Loads (Cold Starts) ⚡
Because Render's free tier "sleeps" after 15 minutes of inactivity:
- I have added a **Background Ping** to the homepage. As soon as a user visits your site, it starts "waking up" the server in the background.
- **Pro Tip**: Use a free tool like [UptimeRobot](https://uptimerobot.com/). Set it to ping your backend URL (the one from Render) every 15 minutes. This will keep it "Always Awake" so your visitors never have to wait!

🌿 **God bless your journey of intention in 2026!** ✝️︎
