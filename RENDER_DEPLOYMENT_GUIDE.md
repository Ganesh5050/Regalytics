# 🚀 Render Deployment Guide - Regalytics Backend

This guide helps you deploy your Regalytics backend to **Render** as a **backup/alternative** to Railway.

---

## 📋 **Why Deploy to Both Railway AND Render?**

✅ **Redundancy** - If Railway has issues, switch to Render instantly  
✅ **Zero Downtime** - Always have a backup ready  
✅ **Cost Optimization** - Use free tiers of both platforms  
✅ **Easy Failover** - Just change one environment variable in frontend  

---

## 🎯 **Prerequisites**

1. ✅ GitHub/GitLab account with your code pushed
2. ✅ Render account (free) - [https://render.com](https://render.com)
3. ✅ Your repository contains the `render.yaml` file (already created)

---

## 🚀 **OPTION 1: Deploy Using Blueprint (Recommended - Easiest)**

### **Step 1: Push Code to Repository**
```bash
git add render.yaml backend/render-build.sh backend/src/database/init-postgres.ts
git commit -m "Add Render deployment configuration"
git push origin main
```

### **Step 2: Deploy on Render**

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com

2. **Click "New" → "Blueprint"**

3. **Connect Your Repository**
   - Select your GitHub/GitLab account
   - Find `regalytics-ui-main` repository
   - Click "Connect"

4. **Review Configuration**
   - Render will read `render.yaml` automatically
   - You'll see:
     - ✅ Web Service: `regalytics-backend`
     - ✅ PostgreSQL Database: `regalytics-db`

5. **Click "Apply"**
   - Render will:
     - Create PostgreSQL database
     - Deploy backend service
     - Auto-generate JWT_SECRET
     - Connect everything

6. **Wait for Deployment** (3-5 minutes)
   - Watch the build logs
   - Status will show "Live" when ready

7. **Get Your Backend URL**
   - Format: `https://regalytics-backend.onrender.com`
   - Copy this URL!

---

## 🚀 **OPTION 2: Manual Deployment (More Control)**

### **Step 1: Create PostgreSQL Database**

1. Go to Render Dashboard
2. Click "New" → "PostgreSQL"
3. Fill in:
   - **Name:** `regalytics-db`
   - **Database:** `regalytics`
   - **User:** `regalytics`
   - **Region:** Oregon (or closest to you)
   - **Plan:** Free
4. Click "Create Database"
5. **Copy the "Internal Database URL"** (starts with `postgresql://`)

### **Step 2: Create Web Service**

1. Click "New" → "Web Service"
2. Connect your repository
3. Fill in:
   - **Name:** `regalytics-backend`
   - **Region:** Oregon (same as database)
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

### **Step 3: Add Environment Variables**

Click "Advanced" → "Add Environment Variable":

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `JWT_SECRET` | Generate a random secure string (use: https://randomkeygen.com) |
| `DATABASE_URL` | Paste the Internal Database URL from Step 1 |

### **Step 4: Deploy**

1. Click "Create Web Service"
2. Wait for build and deployment (5-10 minutes)
3. Your backend URL: `https://regalytics-backend.onrender.com`

---

## ✅ **Verify Deployment**

### **Test Health Endpoint**
```bash
curl https://regalytics-backend.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-23T...",
  "uptime": 123.45,
  "version": "1.0.0",
  "environment": "production"
}
```

### **Test Login**
```bash
curl -X POST https://regalytics-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@regalytics.com","password":"admin123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@regalytics.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }
}
```

---

## 🔄 **Update Frontend to Use Render Backend**

You have **TWO OPTIONS**:

### **Option A: Keep Railway, Use Render as Backup Only**
Do nothing! Keep using Railway. If Railway goes down, then:

1. Update `.env.production`:
```env
VITE_API_URL=https://regalytics-backend.onrender.com/api
VITE_WS_URL=wss://regalytics-backend.onrender.com/ws
```

2. Redeploy frontend:
```bash
npm run build
# Deploy to Vercel/your hosting
```

### **Option B: Switch to Render Immediately**

1. Update environment variables in your frontend hosting (Vercel/Netlify):
```env
VITE_API_URL=https://regalytics-backend.onrender.com/api
VITE_WS_URL=wss://regalytics-backend.onrender.com/ws
```

2. Redeploy frontend

---

## 🎛️ **Managing Both Deployments**

### **Environment Variables Strategy**

Create separate environment files:

**`.env.railway`** (for Railway backend):
```env
VITE_API_URL=https://your-railway-backend.up.railway.app/api
VITE_WS_URL=wss://your-railway-backend.up.railway.app/ws
```

**`.env.render`** (for Render backend):
```env
VITE_API_URL=https://regalytics-backend.onrender.com/api
VITE_WS_URL=wss://regalytics-backend.onrender.com/ws
```

### **Quick Switch Script**

Add to `package.json`:
```json
{
  "scripts": {
    "build:railway": "cp .env.railway .env.production && npm run build",
    "build:render": "cp .env.render .env.production && npm run build",
    "deploy:railway": "npm run build:railway && <your-deploy-command>",
    "deploy:render": "npm run build:render && <your-deploy-command>"
  }
}
```

---

## 📊 **Default Credentials**

Both Railway (SQLite) and Render (PostgreSQL) have the same default users:

| Email | Password | Role |
|-------|----------|------|
| `admin@regalytics.com` | `admin123` | admin |
| `compliance@regalytics.com` | `compliance123` | compliance_officer |
| `analyst@regalytics.com` | `analyst123` | analyst |

⚠️ **IMPORTANT:** Change these passwords after first login!

---

## ⚠️ **Important Notes**

### **Render Free Tier Limitations**

1. **Web Service:**
   - ✅ 750 hours/month free
   - ⚠️ Sleeps after 15 minutes of inactivity
   - ⏱️ Cold start: 30-60 seconds on first request
   - 💡 **Solution:** Use a cron job to ping every 14 minutes (see below)

2. **PostgreSQL Database:**
   - ✅ Free for 90 days
   - 💰 Then $7/month
   - 🗄️ 1GB storage
   - 🔌 Max 97 connections

3. **Ephemeral Filesystem:**
   - ❌ File uploads won't persist
   - 💡 Use cloud storage (S3, Cloudinary) for files

### **Keep Your Render Backend Awake**

Use **Cron-Job.org** (free):

1. Go to https://cron-job.org
2. Create free account
3. Add job:
   - **URL:** `https://regalytics-backend.onrender.com/api/health`
   - **Schedule:** Every 14 minutes
   - **Enable:** Yes

**OR** use UptimeRobot (free): https://uptimerobot.com

---

## 🔧 **Troubleshooting**

### **Build Fails**
```bash
# Check logs in Render dashboard
# Common fix: Ensure package.json has correct scripts
```

### **Database Connection Error**
```bash
# Verify DATABASE_URL is set correctly
# Check database is in same region as web service
```

### **502 Bad Gateway**
```bash
# Service is sleeping (free tier)
# Wait 30-60 seconds and try again
# Set up cron job to keep it awake
```

### **401 Unauthorized**
```bash
# JWT_SECRET mismatch
# Regenerate and update environment variable
```

---

## 🎯 **Deployment Checklist**

- [ ] Code pushed to GitHub/GitLab
- [ ] `render.yaml` in repository root
- [ ] Blueprint deployed on Render
- [ ] PostgreSQL database created
- [ ] Backend service shows "Live" status
- [ ] Health endpoint returns 200 OK
- [ ] Login endpoint works with default credentials
- [ ] Frontend environment variables updated (optional)
- [ ] Cron job set up to prevent sleeping (optional)
- [ ] Default passwords changed in production

---

## 📞 **Need Help?**

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **PostgreSQL Docs:** https://render.com/docs/databases

---

## 🎉 **Success!**

You now have:
- ✅ **Railway backend** (existing, SQLite)
- ✅ **Render backend** (new, PostgreSQL)
- ✅ **Easy failover** capability
- ✅ **Zero downtime** architecture

**Your backend URL:** `https://regalytics-backend.onrender.com`

**Next Steps:**
1. Test the Render backend thoroughly
2. Keep both running in parallel
3. Monitor both platforms
4. Switch DNS/frontend config if Railway has issues

---

*Last updated: October 2025*

