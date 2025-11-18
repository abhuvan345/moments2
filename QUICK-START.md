# 🚀 Moments - Quick Reference Card

## ⚡ Quick Start Commands

```powershell
# 1. Configure Firebase & Cloudinary credentials
# Edit: backend/.env and frontend/.env.local

# 2. Start Backend (Terminal 1)
cd backend
npm run dev

# 3. Start Frontend (Terminal 2)
cd frontend
npm run dev

# OR use the combined script from project root
.\start.ps1
```

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 📁 Key Files to Configure

### Required Before Running:

1. **backend/config/firebase-service-account.json**

   - Download from Firebase Console
   - Project Settings → Service Accounts → Generate New Private Key

2. **backend/.env**

   - CLOUDINARY_CLOUD_NAME=\*\*\*
   - CLOUDINARY_API_KEY=\*\*\*
   - CLOUDINARY_API_SECRET=\*\*\*

3. **frontend/.env.local**
   - NEXT_PUBLIC_FIREBASE_API_KEY=\*\*\*
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=\*\*\*
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID=\*\*\*
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=\*\*\*
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=\*\*\*
   - NEXT_PUBLIC_FIREBASE_APP_ID=\*\*\*

## 🎯 User Flows

### New User Sign Up

```
1. Visit: http://localhost:3000/auth/signup
2. Fill in: Name, Email, Password
3. Select: User or Provider role
4. Click: Create Account
5. Redirects to appropriate dashboard
```

### Sign In

```
1. Visit: http://localhost:3000/auth/signin
2. Enter: Email & Password
3. Click: Sign In
4. Redirects to: /user/dashboard
```

### Provider Registration

```
1. Sign up with Provider role
2. Complete provider profile
3. Wait for admin approval
4. Once approved, can add services
```

## 🔐 Authentication Testing

### Using Frontend:

```javascript
// The auth context is already integrated
import { useAuth } from "@/lib/auth-context";

// In component:
const { user, signIn, signUp, signOut } = useAuth();
```

### Using API Directly:

```powershell
# Sign up first through Firebase Auth
# Then get the ID token from user.getIdToken()

# Make authenticated request:
curl http://localhost:5000/api/users/USER_UID `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📊 Database Collections

| Collection | Description         | Access                             |
| ---------- | ------------------- | ---------------------------------- |
| users      | User profiles       | User (own), Admin (all)            |
| providers  | Provider businesses | Public (read), Owner/Admin (write) |
| services   | Service listings    | Public (read), Provider (write)    |
| bookings   | Service bookings    | User/Provider (own), Admin (all)   |

## 🛠️ Common Commands

```powershell
# Backend
cd backend
npm install                 # Install dependencies
npm run dev                # Start with nodemon
npm start                  # Start production

# Frontend
cd frontend
npm install --legacy-peer-deps  # Install dependencies
npm run dev                # Start dev server
npm run build              # Build for production
npm start                  # Start production server

# Both
npm audit                  # Check for vulnerabilities
npm audit fix              # Fix vulnerabilities
```

## 🔍 Debugging Tips

### Backend Not Starting?

```powershell
# Check if port is in use
netstat -ano | findstr :5000

# Kill process on port 5000 (if needed)
taskkill /PID <PID> /F

# Check environment variables
cat backend/.env
```

### Frontend Not Starting?

```powershell
# Clear Next.js cache
Remove-Item frontend/.next -Recurse -Force

# Reinstall dependencies
cd frontend
Remove-Item node_modules -Recurse -Force
npm install --legacy-peer-deps
```

### CORS Issues?

```powershell
# Verify .env settings:
# backend/.env → FRONTEND_URL=http://localhost:3000
# frontend/.env.local → NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Restart both servers after changes
```

### Firebase Auth Not Working?

```
1. Check Firebase Console → Authentication enabled
2. Verify credentials in frontend/.env.local
3. Check browser console for specific errors
4. Clear browser cache/cookies
```

## 📝 Testing Checklist

- [ ] Backend health check responds
- [ ] Frontend loads homepage
- [ ] User can sign up
- [ ] User can sign in
- [ ] User can view profile
- [ ] Provider can register
- [ ] Images upload to Cloudinary
- [ ] Services can be created
- [ ] Bookings can be made
- [ ] API returns proper errors

## 🎨 Frontend API Usage Examples

```typescript
import {
  authAPI,
  providersAPI,
  servicesAPI,
  bookingsAPI,
  uploadAPI,
} from "@/lib/api";

// Register user
await authAPI.register({ uid, email, name });

// Get providers
const { providers } = await providersAPI.getAll({ status: "approved" });

// Create service
const { service } = await servicesAPI.create({
  providerId: "provider-id",
  name: "Wedding Photography",
  price: 2000,
  duration: 480,
});

// Upload image
const file = event.target.files[0];
const { url } = await uploadAPI.uploadSingle(file);
```

## 📞 Support Resources

- `README.md` - Full documentation
- `SETUP.md` - Detailed setup guide
- `CHECKLIST.md` - Step-by-step checklist
- `ARCHITECTURE.md` - System architecture
- `backend/BACKEND-COMPLETE.md` - Backend specifics

## ✅ Verification Steps

1. **Backend Running:**

   ```powershell
   curl http://localhost:5000/health
   # Should return: {"status":"ok","message":"Server is running"}
   ```

2. **Frontend Running:**

   - Open browser to http://localhost:3000
   - Should see Moments homepage

3. **Database Connected:**

   - Create a user via sign up
   - Check Firebase Console → Firestore
   - User document should appear

4. **Cloudinary Working:**
   - Upload an image through app
   - Check Cloudinary Console → Media Library
   - Image should appear

## 🎯 Next Steps After Setup

1. **Create Admin User**

   ```javascript
   // Use backend API
   POST /api/auth/set-claims/:uid
   Body: { "claims": { "admin": true } }
   ```

2. **Customize UI**

   - Update colors in `tailwind.config.ts`
   - Modify components in `frontend/components/`

3. **Add Features**

   - Reviews/ratings system
   - Payment integration
   - Notifications
   - Calendar integration

4. **Deploy to Production**
   - Backend → Railway/Render
   - Frontend → Vercel
   - Update environment variables
   - Update CORS settings

---

**Status:** ✅ Fully configured and ready to run!

**Last Updated:** 2025-11-18
