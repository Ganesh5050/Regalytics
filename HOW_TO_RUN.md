# How to Run Regalytics UI Project

## 🚀 Quick Start Guide

This guide will help you set up and run the Regalytics compliance management platform on your local machine.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Windows PowerShell (for Windows users)

## 🗂️ Project Structure

```
regalytics-ui-main/
├── frontend/          # React + TypeScript frontend
├── backend/           # Node.js + Express backend
└── .env.local         # Environment configuration
```

## 🔧 Setup Instructions

### 1. Install Dependencies (if needed)

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### 2. Start the Backend Server

The backend runs on **port 3001** by default.

```bash
cd backend
npm run dev
```

You should see output like:
```
🚀 Server running on port 3001
📡 WebSocket server running on port 3001
🌐 API available at http://localhost:3001/api
```

### 3. Start the Frontend Server

Open a **new terminal window** and run:

```bash
npm run dev
```

The frontend will start on port 5173 (or next available port).

### 4. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api

## 🔑 Environment Configuration

### ⚠️ Important: Backend Port Configuration

The backend runs on **port 3001**. If you experience connection issues, make sure your `.env.local` file is configured correctly:

**File:** `.env.local`

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=http://localhost:3001
VITE_USE_REAL_API=true

# Application Configuration
VITE_APP_NAME=Regalytics
VITE_APP_VERSION=1.0.0

# Development Configuration
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

### 🛠️ Troubleshooting Connection Issues

If the frontend cannot connect to the backend:

1. **Check the backend port:** Make sure the backend is running on port 3001
2. **Verify .env.local:** Ensure the file contains the correct port (3001, not 3002)
3. **Restart servers:** Stop both servers and restart them:
   - Backend: `cd backend && npm run dev`
   - Frontend: `npm run dev`

## 📱 Login Credentials

Use the following credentials to login:

- **Email:** admin@example.com
- **Password:** admin123

Or use the demo login option on the login page.

## 🗃️ Database

The project uses SQLite database located at:
```
backend/database.sqlite
```

The database is automatically initialized with sample data when the backend starts.

## 📊 Features Available

- **Real-time Dashboard** - Live monitoring and analytics
- **Client Management** - KYC and risk assessment
- **Transaction Monitoring** - Real-time transaction analysis
- **Alert Management** - Priority-based workflows
- **Advanced Reporting** - Customizable reports
- **Audit Trail** - Complete compliance tracking

## 🔍 Development Tips

1. **Hot Reload:** Both frontend and backend support hot reload during development
2. **API Testing:** Use http://localhost:3001/api/health to test backend connection
3. **WebSocket:** Real-time features use WebSocket connection on port 3001
4. **Logs:** Check console output for detailed error messages

## 🆘 Common Issues

### Issue: "Login Failed" or "Network Error"
**Solution:** Check that `.env.local` points to port 3001, not 3002

### Issue: "WebSocket connection failed"
**Solution:** Ensure backend is running and `VITE_WS_URL` is set to `http://localhost:3001`

### Issue: Port already in use
**Solution:** The servers will automatically try alternative ports if 3001/5173 are busy

## 📞 Support

If you encounter any issues:
1. Check that both servers are running
2. Verify the `.env.local` configuration
3. Check the browser console for error messages
4. Ensure the backend database is initialized

---

**🎉 Your Regalytics platform should now be running successfully!**
