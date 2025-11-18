# Moments - Service Booking Platform

A full-stack service booking platform with Next.js frontend and Node.js backend, Firebase authentication, Firestore database, and Cloudinary image uploads.

## Architecture

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Node.js with Express
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Image Storage**: Cloudinary

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Firebase Authentication (Email/Password)
4. Create a Firestore Database
5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Copy the Firebase config for web app
6. Create a service account:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file as `firebase-service-account.json` in `backend/config/`

### 2. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up or log in
3. Get your Cloud Name, API Key, and API Secret from the Dashboard

### 3. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env file with your credentials:
# - PORT=5000
# - FRONTEND_URL=http://localhost:3000
# - Firebase credentials (or use service account file)
# - Cloudinary credentials

# Place firebase-service-account.json in backend/config/ directory

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

```powershell
# Navigate to frontend directory
cd ..\frontend

# Install dependencies
npm install

# Create .env.local file
Copy-Item .env.example .env.local

# Edit .env.local with your Firebase config:
# - NEXT_PUBLIC_FIREBASE_API_KEY=
# - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# - NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
# - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
# - NEXT_PUBLIC_FIREBASE_APP_ID=
# - NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start the frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/set-claims/:uid` - Set custom claims (admin)

### Users

- `GET /api/users` - Get all users (admin)
- `GET /api/users/:uid` - Get user by ID
- `PUT /api/users/:uid` - Update user
- `DELETE /api/users/:uid` - Delete user (admin)

### Providers

- `GET /api/providers` - Get all providers
- `GET /api/providers/:id` - Get provider by ID
- `GET /api/providers/user/:uid` - Get provider by user ID
- `POST /api/providers` - Create provider
- `PUT /api/providers/:id` - Update provider
- `PATCH /api/providers/:id/status` - Update provider status (admin)
- `DELETE /api/providers/:id` - Delete provider

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/provider/:providerId` - Get services by provider
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Bookings

- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/user/:userId` - Get user's bookings
- `GET /api/bookings/provider/:providerId` - Get provider's bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

### Upload

- `POST /api/upload/single` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images
- `DELETE /api/upload/:publicId` - Delete image

## Frontend API Usage

```typescript
import {
  authAPI,
  providersAPI,
  servicesAPI,
  bookingsAPI,
  uploadAPI,
} from "@/lib/api";

// Register user
await authAPI.register({ uid, email, name, phone });

// Get providers
const providers = await providersAPI.getAll({ status: "approved" });

// Create booking
const booking = await bookingsAPI.create({
  providerId: "provider-id",
  serviceId: "service-id",
  date: "2025-11-20",
  time: "14:00",
  totalPrice: 100,
});

// Upload image
const file = event.target.files[0];
const result = await uploadAPI.uploadSingle(file);
console.log(result.url); // Cloudinary URL
```

## User Roles

- **User**: Can browse services and create bookings
- **Provider**: Can create and manage services, view bookings
- **Admin**: Full access to all resources

## Firestore Collections

- `users` - User profiles
- `providers` - Service provider information
- `services` - Services offered by providers
- `bookings` - Service bookings

## Environment Variables

### Backend (.env)

```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env.local)

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Development

- Backend runs on port 5000 (or PORT in .env)
- Frontend runs on port 3000
- Backend auto-reloads with nodemon
- Frontend auto-reloads with Next.js

## Security

- All API routes (except auth/register) require Firebase authentication token
- Role-based access control with Firebase custom claims
- CORS enabled for frontend origin only
- Image upload limited to 5MB per file
- File type validation for images only

## Troubleshooting

1. **CORS errors**: Ensure FRONTEND_URL in backend .env matches your frontend URL
2. **Firebase errors**: Check that firebase-service-account.json is in backend/config/
3. **Upload errors**: Verify Cloudinary credentials in backend .env
4. **Auth errors**: Ensure Firebase Auth is enabled in Firebase Console
5. **Database errors**: Check Firestore rules allow authenticated read/write

## License

ISC
