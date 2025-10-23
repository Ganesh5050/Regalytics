# 🔄 Switching Between Railway and Render Backends

This guide shows you how to quickly switch your frontend between Railway and Render backends.

---

## 🎯 **Current Setup**

You now have **TWO backend deployments**:

| Platform | Database | Status | URL |
|----------|----------|--------|-----|
| **Railway** | SQLite | Active | `https://your-app.up.railway.app` |
| **Render** | PostgreSQL | Backup | `https://regalytics-backend.onrender.com` |

---

## ⚡ **Quick Switch (Emergency)**

### **If Railway Goes Down RIGHT NOW:**

**Option 1: Environment Variable (Recommended)**

If using Vercel/Netlify:
1. Go to your hosting dashboard
2. Update environment variables:
   ```
   VITE_API_URL=https://regalytics-backend.onrender.com/api
   VITE_WS_URL=wss://regalytics-backend.onrender.com/ws
   ```
3. Trigger redeploy
4. ✅ **Done!** (5 minutes)

**Option 2: Code Change (If no hosting dashboard access)**

1. Edit `env.production` or `.env`:
   ```env
   VITE_API_URL=https://regalytics-backend.onrender.com/api
   VITE_WS_URL=wss://regalytics-backend.onrender.com/ws
   ```

2. Rebuild and deploy:
   ```bash
   npm run build
   # Then deploy to your hosting
   ```

---

## 📋 **Create Environment Files (Recommended Setup)**

Create separate environment files for easy switching:

### **File: `.env.railway`**
```env
# Railway Backend Configuration
VITE_API_URL=https://your-railway-backend.up.railway.app/api
VITE_WS_URL=wss://your-railway-backend.up.railway.app/ws
VITE_USE_REAL_API=true
```

### **File: `.env.render`**
```env
# Render Backend Configuration  
VITE_API_URL=https://regalytics-backend.onrender.com/api
VITE_WS_URL=wss://regalytics-backend.onrender.com/ws
VITE_USE_REAL_API=true
```

### **Update package.json**

Add these scripts:
```json
{
  "scripts": {
    "build:railway": "cp .env.railway .env.production && npm run build",
    "build:render": "cp .env.render .env.production && npm run build",
    "preview:railway": "cp .env.railway .env.local && npm run dev",
    "preview:render": "cp .env.render .env.local && npm run dev"
  }
}
```

### **Usage**

```bash
# Build for Railway
npm run build:railway

# Build for Render
npm run build:render

# Test Railway backend locally
npm run preview:railway

# Test Render backend locally
npm run preview:render
```

---

## 🔍 **Test Which Backend You're Using**

Add this component to check which backend is active:

**`src/components/common/BackendIndicator.tsx`:**
```typescript
export function BackendIndicator() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const isRailway = apiUrl?.includes('railway');
  const isRender = apiUrl?.includes('render');

  return (
    <div className="fixed bottom-4 right-4 bg-primary text-white px-3 py-1 rounded text-xs">
      Backend: {isRailway ? '🚂 Railway' : isRender ? '🎨 Render' : '❓ Unknown'}
    </div>
  );
}
```

---

## 🎛️ **Load Balancing (Advanced)**

Deploy to **both** backends and use a smart switcher:

**`src/services/SmartApiService.ts`:**
```typescript
class SmartApiService {
  private railwayUrl = 'https://your-railway.up.railway.app/api';
  private renderUrl = 'https://regalytics-backend.onrender.com/api';
  private currentBackend = 'railway';

  async request(endpoint: string) {
    try {
      // Try Railway first
      const response = await fetch(`${this.railwayUrl}${endpoint}`, {
        timeout: 5000
      });
      this.currentBackend = 'railway';
      return response;
    } catch (error) {
      console.warn('Railway failed, switching to Render...');
      // Fallback to Render
      const response = await fetch(`${this.renderUrl}${endpoint}`);
      this.currentBackend = 'render';
      return response;
    }
  }

  getCurrentBackend() {
    return this.currentBackend;
  }
}
```

---

## 📊 **Monitoring Both Backends**

### **Health Check Script**

Create `scripts/check-backends.js`:
```javascript
const axios = require('axios');

const backends = {
  railway: 'https://your-railway.up.railway.app/api/health',
  render: 'https://regalytics-backend.onrender.com/api/health'
};

async function checkBackends() {
  for (const [name, url] of Object.entries(backends)) {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      console.log(`✅ ${name}: UP (${response.data.uptime}s uptime)`);
    } catch (error) {
      console.log(`❌ ${name}: DOWN`);
    }
  }
}

checkBackends();
```

**Run it:**
```bash
node scripts/check-backends.js
```

### **UptimeRobot Setup**

Monitor both backends:

1. Go to https://uptimerobot.com (free)
2. Add monitors:
   - **Railway:** `https://your-railway.up.railway.app/api/health`
   - **Render:** `https://regalytics-backend.onrender.com/api/health`
3. Get alerts via email/SMS when either goes down

---

## 🚨 **Emergency Procedures**

### **Railway Down → Switch to Render**

1. **Immediate (5 min):**
   ```bash
   # Update environment on hosting platform
   VITE_API_URL=https://regalytics-backend.onrender.com/api
   # Redeploy
   ```

2. **Test:**
   ```bash
   curl https://your-frontend.com/api/health
   # Should hit Render now
   ```

3. **Notify users** (optional):
   - Add banner: "We're running on backup servers"

### **Render Down → Switch to Railway**

Same process, but use Railway URL.

### **Both Down** 😱

1. Check status pages:
   - Railway: https://railway.app/status
   - Render: https://status.render.com

2. Enable maintenance mode in frontend
3. Use mock data temporarily:
   ```env
   VITE_USE_REAL_API=false
   ```

---

## 💡 **Best Practices**

1. ✅ **Monitor both backends** - Use UptimeRobot
2. ✅ **Test failover monthly** - Switch backends to ensure it works
3. ✅ **Keep both in sync** - Deploy to both when updating
4. ✅ **Document your Railway URL** - Save it somewhere safe
5. ✅ **Different databases** - Railway (SQLite) ≠ Render (PostgreSQL)
   - They won't have the same data!
   - Consider periodic data sync

---

## 🔄 **Data Synchronization (Optional)**

Since Railway uses SQLite and Render uses PostgreSQL, data won't sync automatically.

**Options:**

1. **Primary/Backup Strategy:**
   - Railway = Primary (active)
   - Render = Backup (emergency only)
   - Accept data loss if switching

2. **Periodic Sync:**
   - Export SQLite from Railway
   - Import to Render PostgreSQL
   - Run weekly/monthly

3. **Shared Database:**
   - Point both to same PostgreSQL (Render or external)
   - Update Railway to use PostgreSQL instead of SQLite

---

## 📝 **Checklist**

- [ ] Both backends deployed and running
- [ ] Health endpoints responding on both
- [ ] Environment files created (`.env.railway`, `.env.render`)
- [ ] Package.json scripts added
- [ ] Tested switching between backends
- [ ] Monitoring setup (UptimeRobot)
- [ ] Emergency procedure documented
- [ ] Team knows how to switch

---

## 🎉 **You're All Set!**

You now have:
- ✅ Railway backend (primary)
- ✅ Render backend (backup)
- ✅ Easy switching mechanism
- ✅ Zero downtime capability

**If Railway shuts down, you're covered!** 🛡️

---

*Last updated: October 2025*

