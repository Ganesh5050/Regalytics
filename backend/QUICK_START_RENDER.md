# ⚡ QUICK START - Deploy to Render in 5 Minutes

## 🎯 **Fastest Way to Deploy**

### **Step 1: Push to GitHub** (1 minute)
```bash
cd backend
git add .
git commit -m "Add Render deployment config"
git push origin main
```

### **Step 2: Deploy on Render** (2 minutes)

1. Go to **https://dashboard.render.com**
2. Click **"New" → "Blueprint"**
3. **Connect your GitHub repository**
4. Click **"Apply"**
5. ✅ **Done!** Wait 3-5 minutes for deployment

### **Step 3: Get Your URL** (30 seconds)
- Your backend: `https://regalytics-backend.onrender.com`
- Test it: `https://regalytics-backend.onrender.com/api/health`

### **Step 4: Test Login** (30 seconds)
```bash
curl -X POST https://regalytics-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@regalytics.com","password":"admin123"}'
```

---

## 🔄 **Switch Frontend to Render** (Optional)

**Only if Railway goes down:**

Update your frontend environment variable:
```env
VITE_API_URL=https://regalytics-backend.onrender.com/api
```

Redeploy frontend. Done!

---

## ✅ **Default Credentials**

- **Admin:** admin@regalytics.com / admin123
- **Compliance:** compliance@regalytics.com / compliance123
- **Analyst:** analyst@regalytics.com / analyst123

---

## 🚨 **Important Notes**

### Free Tier Limitations:
- ⏱️ **Sleeps after 15 min** of inactivity
- 🕐 **Cold start:** 30-60 seconds
- 💰 **Database:** Free for 90 days, then $7/month

### Keep It Awake:
Use **cron-job.org** to ping every 14 minutes:
- URL: `https://regalytics-backend.onrender.com/api/health`
- Schedule: Every 14 minutes

---

## 📚 **Full Guide**

See `RENDER_DEPLOYMENT_GUIDE.md` for detailed instructions.

---

**That's it! You now have a backup backend on Render! 🎉**

