# 🎉 Moments - Complete Setup Checklist

## ✅ What Has Been Created

### Backend (`/backend`)

- ✓ Express.js server with Node.js
- ✓ Firebase Admin SDK integration for authentication
- ✓ Firestore database models (User, Provider, Service, Booking)
- ✓ Cloudinary integration for image uploads
- ✓ RESTful API routes with authentication middleware
- ✓ CORS configuration for frontend communication
- ✓ File upload middleware with validation

### Frontend (`/frontend`)

- ✓ Next.js 15 with TypeScript
- ✓ Firebase client SDK for authentication
- ✓ API client library for backend communication
- ✓ Authentication context and hooks
- ✓ Updated sign-in and sign-up pages
- ✓ UI components with shadcn/ui

### Configuration Files

- ✓ Environment variable templates (`.env.example`, `.env.local.example`)
- ✓ Startup scripts for easy launch
- ✓ Documentation (README.md, SETUP.md)

## 📋 Required Setup Steps

### Step 1: Firebase Configuration (REQUIRED)

1. **Create Firebase Project:**

   - Visit: https://console.firebase.google.com
   - Click "Add project"
   - Complete the setup wizard

2. **Enable Authentication:**

   - In Firebase Console → Authentication
   - Click "Get Started"
   - Enable "Email/Password" sign-in method

3. **Create Firestore Database:**

   - In Firebase Console → Firestore Database
   - Click "Create database"
   - Start in "Test mode" (update rules later)
   - Choose a region close to you

4. **Get Backend Credentials:**

   - Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as: `backend/config/firebase-service-account.json`

5. **Get Frontend Credentials:**
   - Project Settings → General
   - Scroll to "Your apps"
   - Click Web icon (</>)
   - Copy the config values

### Step 2: Cloudinary Configuration (REQUIRED)

1. **Create Account:**

   - Visit: https://cloudinary.com
   - Sign up for free

2. **Get Credentials:**
   - From Dashboard, copy:
     - Cloud Name
     - API Key
     - API Secret

### Step 3: Backend Setup

```powershell
# Navigate to backend
cd backend

# The .env file is already created, edit it with your credentials
notepad .env

# Required values to update in .env:
# - CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
# - CLOUDINARY_API_KEY=your-actual-api-key
# - CLOUDINARY_API_SECRET=your-actual-api-secret

# Ensure firebase-service-account.json is in backend/config/

# Start the backend
.\start-backend.ps1
# OR
npm run dev
```

### Step 4: Frontend Setup

```powershell
# Navigate to frontend (in new terminal)
cd frontend

# The .env.local file is already created, edit it with your credentials
notepad .env.local

# Required values to update in .env.local:
# - NEXT_PUBLIC_FIREBASE_API_KEY=your-key
# - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
# - NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
# - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
# - NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Start the frontend
.\start-frontend.ps1
# OR
npm run dev
```

### Step 5: Verify Everything Works

1. **Backend Health Check:**

   - Open: http://localhost:5000/health
   - Should see: `{"status":"ok","message":"Server is running"}`

2. **Frontend:**

   - Open: http://localhost:3000
   - Should see the Moments homepage

3. **Test Authentication:**

   - Click "Sign Up"
   - Create a new account
   - Check Firebase Console → Authentication to see the user

4. **Check Console Logs:**
   - Backend terminal: Should show incoming requests
   - Frontend browser console: Should be error-free

## 🚀 Quick Start (After Configuration)

### Option 1: Start Both at Once

```powershell
# From project root
.\start.ps1
```

### Option 2: Start Separately

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📚 API Endpoints Reference

### Authentication

- `POST /api/auth/register` - Create user profile

### Users

- `GET /api/users` - Get all users (admin)
- `GET /api/users/:uid` - Get user profile
- `PUT /api/users/:uid` - Update user profile

### Providers

- `GET /api/providers` - Browse providers
- `POST /api/providers` - Register as provider
- `PUT /api/providers/:id` - Update provider
- `PATCH /api/providers/:id/status` - Approve/reject (admin)

### Services

- `GET /api/services` - Browse services
- `POST /api/services` - Create service (provider)
- `PUT /api/services/:id` - Update service
- `GET /api/services/provider/:providerId` - Get provider's services

### Bookings

- `GET /api/bookings/user/:userId` - Get user's bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/status` - Update status

### Upload

- `POST /api/upload/single` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images

## 🔧 Common Issues & Solutions

### Backend won't start

**Error: "Cannot find module 'express'"**

```powershell
cd backend
npm install
```

**Error: "Firebase service account error"**

- Verify `firebase-service-account.json` exists in `backend/config/`
- Check JSON file is valid
- Ensure file permissions are correct

**Error: "Cloudinary credentials missing"**

- Edit `backend/.env`
- Add your Cloudinary credentials
- Restart server

### Frontend won't start

**Error: "Module not found"**

```powershell
cd frontend
npm install --legacy-peer-deps
```

**Error: "Firebase not configured"**

- Edit `frontend/.env.local`
- Add Firebase config values
- Restart dev server

### CORS Issues

**Error: "CORS policy blocked"**

- Check `FRONTEND_URL` in `backend/.env` is `http://localhost:3000`
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local` is `http://localhost:5000/api`
- Restart both servers

### Authentication Issues

**Error: "Unauthorized"**

- Check Firebase Auth is enabled
- Verify user is signed in
- Check browser's Application/Storage for auth token

## 🎯 Next Steps

1. **Test Sign Up/Sign In:**

   - Create a user account
   - Sign in with credentials
   - Check Firebase Console to verify user

2. **Create Admin User:**

   ```powershell
   # Use backend API to set admin claims
   # POST /api/auth/set-claims/:uid
   # Body: { "claims": { "admin": true } }
   ```

3. **Test Provider Registration:**

   - Sign up as provider
   - Fill provider profile
   - Admin approves provider

4. **Add Services:**

   - Provider creates services
   - Upload images
   - Set pricing

5. **Make Bookings:**
   - Browse services
   - Create booking
   - Check booking status

## 📖 Additional Resources

- **Firebase Docs:** https://firebase.google.com/docs
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Next.js Docs:** https://nextjs.org/docs
- **Express Docs:** https://expressjs.com

## 🆘 Need Help?

1. Check `SETUP.md` for detailed setup instructions
2. Check `README.md` for API documentation
3. Review error messages in terminal/console
4. Verify all environment variables are set correctly
5. Ensure Firebase and Cloudinary are configured properly

## ✨ Project Structure

```
moments/
├── backend/
│   ├── config/          # Firebase & Cloudinary config
│   ├── middleware/      # Auth & upload middleware
│   ├── models/          # Firestore models
│   ├── routes/          # API routes
│   ├── .env             # Environment variables
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── app/             # Next.js pages
│   ├── components/      # UI components
│   ├── lib/             # Utilities & API client
│   ├── .env.local       # Environment variables
│   └── package.json
└── README.md
```

---

**Status:** ✅ All files created and dependencies installed
**Next:** Configure Firebase and Cloudinary credentials
**Then:** Run `.\start.ps1` to launch the application
