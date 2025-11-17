# ⚡ CampusConnect - Quick Start Guide

## 🚀 Start in 3 Steps

### Step 1: Start Backend
```bash
cd Backend_CampusConnect
npm run dev
```
✅ Server running on **http://localhost:5000**

### Step 2: Start Frontend
```bash
cd Frontend_CampusConnect\frontend_campusconnect
npm run dev
```
✅ App running on **http://localhost:5173**

### Step 3: Open Browser
```
Go to: http://localhost:5173
```

---

## 🎯 First-Time Setup (One Time Only)

### Backend
```bash
cd Backend_CampusConnect
npm install
```

✅ `.env` is already configured

### Frontend
```bash
cd Frontend_CampusConnect\frontend_campusconnect
npm install
```

✅ `.env` is already configured

---

## 🧪 Quick Test

### 1. Register
- Go to http://localhost:5173/register
- Fill in the form
- Click "Create Account"

### 2. Login
- Go to http://localhost:5173/login
- Enter credentials
- Click "Sign In"

### 3. Explore
- ✅ Create posts
- ✅ View events
- ✅ Join groups
- ✅ Browse resources
- ✅ Check profile

---

## 🔧 If Something Goes Wrong

### Backend Won't Start?
```bash
# Check if MongoDB is reachable
cd Backend_CampusConnect
npm start

# Look for error messages
```

### Frontend Blank?
```bash
# Clear cache and reinstall
cd Frontend_CampusConnect\frontend_campusconnect
rm -rf node_modules
npm install
npm run dev
```

### Port Already in Use?
```bash
# Kill existing processes
taskkill /F /IM node.exe

# Restart
npm run dev
```

---

## 📱 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/v1
- **Health Check**: http://localhost:5000

---

## ✅ That's It!

Your CampusConnect app is running! 🎊

For detailed documentation, see:
- `CAMPUS_CONNECT_SETUP_COMPLETE.md` - Full setup guide
- `PROJECT_SUMMARY.md` - Complete overview
- `API_DOCUMENTATION.md` - API reference





