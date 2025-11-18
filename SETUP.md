# Quick Setup Guide

## Prerequisites

- Node.js installed (v18 or higher)
- Firebase account
- Cloudinary account

## Step-by-Step Setup

### 1. Firebase Setup (Required)

1. **Create Firebase Project**

   - Go to https://console.firebase.google.com
   - Click "Add project"
   - Follow the wizard to create your project

2. **Enable Authentication**

   - In Firebase Console, go to "Authentication"
   - Click "Get Started"
   - Enable "Email/Password" provider

3. **Create Firestore Database**

   - Go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode" (we'll set rules later)
   - Select a region

4. **Get Web App Config (for Frontend)**

   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click "Add app" > Select Web (</>) icon
   - Register app with a nickname
   - Copy the config object

5. **Get Service Account (for Backend)**
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `firebase-service-account.json`
   - Move it to `backend/config/` folder

### 2. Cloudinary Setup (Required)

1. **Create Account**

   - Go to https://cloudinary.com
   - Sign up for free account

2. **Get Credentials**
   - From Dashboard, copy:
     - Cloud Name
     - API Key
     - API Secret

### 3. Backend Configuration

1. **Install Dependencies**

   ```powershell
   cd backend
   npm install
   ```

2. **Configure Environment**

   - Edit `backend/.env` file
   - Add Cloudinary credentials
   - Optionally add Firebase env vars if not using service account file
   - Ensure `firebase-service-account.json` is in `backend/config/`

3. **Test Backend**
   ```powershell
   npm run dev
   ```
   - Should see: "Server running on port 5000"
   - Test: http://localhost:5000/health

### 4. Frontend Configuration

1. **Install Dependencies**

   ```powershell
   cd frontend
   npm install --legacy-peer-deps
   ```

2. **Configure Environment**

   - Edit `frontend/.env.local` file
   - Add Firebase web config from Step 1.4
   - Verify `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

3. **Test Frontend**
   ```powershell
   npm run dev
   ```
   - Should open: http://localhost:3000

### 5. Verify Integration

1. **Both servers should be running:**

   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

2. **Test the connection:**
   - Try to sign up/sign in on the frontend
   - Check browser console for errors
   - Check backend terminal for request logs

## Troubleshooting

### Backend won't start

- **Error: "Cannot find module 'firebase-admin'"**

  - Run `npm install` in backend folder

- **Error: "Invalid service account"**

  - Check `firebase-service-account.json` is in `backend/config/`
  - Verify JSON file is valid
  - Or use environment variables in `.env`

- **Error: "CLOUDINARY_CLOUD_NAME is not defined"**
  - Add Cloudinary credentials to `backend/.env`

### Frontend won't start

- **Error: "ERESOLVE could not resolve"**

  - Use `npm install --legacy-peer-deps`

- **Error: "Firebase: Firebase App named '[DEFAULT]' already exists"**
  - This is normal during hot reload, can be ignored

### CORS Errors

- Make sure `FRONTEND_URL` in `backend/.env` is `http://localhost:3000`
- Make sure `NEXT_PUBLIC_API_URL` in `frontend/.env.local` is `http://localhost:5000/api`

### Authentication Errors

- Ensure Firebase Auth is enabled in Firebase Console
- Check that Firebase config in `.env.local` is correct
- Verify the API is receiving the auth token (check Network tab)

## Firestore Security Rules

For development, use test mode rules. For production, update rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId ||
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Providers collection
    match /providers/{providerId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.uid ||
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow delete: if request.auth.uid == resource.data.uid ||
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Services collection
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth.uid == resource.data.userId ||
                     request.auth.uid == resource.data.providerId ||
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.userId ||
                       request.auth.uid == resource.data.providerId ||
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow delete: if request.auth.uid == resource.data.userId ||
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Next Steps

1. **Create admin user** - Set custom claims via backend API
2. **Add providers** - Use the provider registration flow
3. **Create services** - Providers can add their services
4. **Test bookings** - Users can book services
5. **Upload images** - Test image upload to Cloudinary

## Running in Production

1. Update `.env` files with production values
2. Set `NODE_ENV=production` in backend
3. Build frontend: `npm run build`
4. Deploy backend to service like Railway, Render, or Heroku
5. Deploy frontend to Vercel, Netlify, or similar
6. Update CORS and API URLs
7. Update Firestore security rules
