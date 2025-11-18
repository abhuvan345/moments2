# 🏗️ Moments Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              Next.js Frontend (Port 3000)              │   │
│  │                                                         │   │
│  │  - React Components (UI)                               │   │
│  │  - Auth Context (Firebase Auth)                        │   │
│  │  - API Client (HTTP Requests)                          │   │
│  │  - State Management                                    │   │
│  └────────────────────────────────────────────────────────┘   │
│                            ↕                                    │
│                       HTTP/HTTPS                                │
└─────────────────────────────────────────────────────────────────┘
                             ↕
┌─────────────────────────────────────────────────────────────────┐
│                  Node.js Backend (Port 5000)                     │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │   Express API    │  │   Middleware     │                    │
│  │                  │  │                  │                    │
│  │  - Routes        │←→│  - Auth Verify   │                    │
│  │  - Controllers   │  │  - CORS          │                    │
│  │  - Validation    │  │  - File Upload   │                    │
│  └──────────────────┘  └──────────────────┘                    │
│           ↕                      ↕                              │
│  ┌──────────────────────────────────────────┐                  │
│  │            Firestore Models              │                  │
│  │                                           │                  │
│  │  - User Model    - Service Model         │                  │
│  │  - Provider Model - Booking Model        │                  │
│  └──────────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
           ↕                              ↕
┌──────────────────────┐      ┌──────────────────────┐
│   Firebase Services  │      │     Cloudinary       │
│                      │      │                      │
│  ┌────────────────┐  │      │  ┌────────────────┐ │
│  │ Authentication │  │      │  │ Image Storage  │ │
│  │   (JWT Auth)   │  │      │  │  & Transform   │ │
│  └────────────────┘  │      │  └────────────────┘ │
│                      │      │                      │
│  ┌────────────────┐  │      │  ┌────────────────┐ │
│  │   Firestore    │  │      │  │  CDN Delivery  │ │
│  │   (Database)   │  │      │  │                │ │
│  └────────────────┘  │      │  └────────────────┘ │
└──────────────────────┘      └──────────────────────┘
```

## Data Flow

### 1. User Authentication

```
User → Frontend (Sign Up/In)
     → Firebase Auth (Create/Verify Token)
     → Backend API (/api/auth/register)
     → Firestore (Create User Profile)
     → Frontend (Redirect to Dashboard)
```

### 2. Browse Services

```
User → Frontend (Browse Page)
     → Backend API (GET /api/services)
     → Firestore (Query Services Collection)
     → Backend (Return Services)
     → Frontend (Display Services)
```

### 3. Image Upload

```
User → Frontend (Select Images)
     → Backend API (POST /api/upload/multiple)
     → Multer (Validate & Process Files)
     → Cloudinary (Upload Images)
     → Backend (Return URLs)
     → Frontend (Display/Save URLs)
```

### 4. Create Booking

```
User → Frontend (Book Service)
     → Backend API (POST /api/bookings)
     → Auth Middleware (Verify Token)
     → Firestore (Create Booking)
     → Backend (Return Booking)
     → Frontend (Show Confirmation)
```

## Request Flow with Authentication

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │ 1. User Action (e.g., Create Booking)
       ↓
┌──────────────────────────────────────────────┐
│ Frontend API Client                          │
│ - Gets Firebase Auth Token                   │
│ - Adds to Authorization Header               │
│ - Sends HTTP Request                         │
└──────┬───────────────────────────────────────┘
       │ 2. HTTP Request with Bearer Token
       ↓
┌──────────────────────────────────────────────┐
│ Backend: CORS Middleware                     │
│ - Checks Origin                              │
│ - Allows/Denies Request                      │
└──────┬───────────────────────────────────────┘
       │ 3. Request Allowed
       ↓
┌──────────────────────────────────────────────┐
│ Backend: Auth Middleware                     │
│ - Extracts Token                             │
│ - Verifies with Firebase Admin              │
│ - Attaches User to Request                   │
└──────┬───────────────────────────────────────┘
       │ 4. Token Verified
       ↓
┌──────────────────────────────────────────────┐
│ Backend: Route Handler                       │
│ - Processes Business Logic                   │
│ - Calls Model Methods                        │
└──────┬───────────────────────────────────────┘
       │ 5. Database Operation
       ↓
┌──────────────────────────────────────────────┐
│ Firestore Database                           │
│ - Performs CRUD Operation                    │
│ - Returns Result                             │
└──────┬───────────────────────────────────────┘
       │ 6. Response Data
       ↓
┌──────────────────────────────────────────────┐
│ Backend: Send Response                       │
│ - Formats JSON Response                      │
│ - Sends to Frontend                          │
└──────┬───────────────────────────────────────┘
       │ 7. JSON Response
       ↓
┌──────────────────────────────────────────────┐
│ Frontend: Update UI                          │
│ - Parse Response                             │
│ - Update State                               │
│ - Render Changes                             │
└──────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

- **Framework:** Next.js 15 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Auth:** Firebase Client SDK
- **State:** React Context + Hooks

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** JavaScript (ES6+)
- **Auth:** Firebase Admin SDK
- **Database:** Cloud Firestore
- **Storage:** Cloudinary

### Services

- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore (NoSQL)
- **Image CDN:** Cloudinary
- **Hosting:** Local Development (Ready for deployment)

## Security Layers

```
┌──────────────────────────────────────┐
│ Layer 1: CORS Protection             │
│ - Only allows frontend origin        │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ Layer 2: Firebase Auth               │
│ - JWT token verification             │
│ - Token expiration check             │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ Layer 3: Role-Based Access           │
│ - User role verification             │
│ - Custom claims check                │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ Layer 4: Resource Ownership          │
│ - User can only access own data      │
│ - Provider can manage own services   │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ Layer 5: Input Validation            │
│ - File type/size limits              │
│ - Request body validation            │
└──────────────────────────────────────┘
```

## API Endpoints Map

```
/api
├── /auth
│   ├── POST /register          (Create user profile)
│   └── POST /set-claims/:uid   (Admin: Set custom claims)
│
├── /users
│   ├── GET  /                  (Admin: List all users)
│   ├── GET  /:uid              (Get user profile)
│   ├── PUT  /:uid              (Update user profile)
│   └── DELETE /:uid            (Admin: Delete user)
│
├── /providers
│   ├── GET  /                  (List providers)
│   ├── GET  /:id               (Get provider details)
│   ├── GET  /user/:uid         (Get provider by user ID)
│   ├── POST /                  (Create provider)
│   ├── PUT  /:id               (Update provider)
│   ├── PATCH /:id/status       (Admin: Approve/reject)
│   └── DELETE /:id             (Delete provider)
│
├── /services
│   ├── GET  /                  (List services)
│   ├── GET  /:id               (Get service details)
│   ├── GET  /provider/:pid     (Get provider's services)
│   ├── POST /                  (Provider: Create service)
│   ├── PUT  /:id               (Provider: Update service)
│   └── DELETE /:id             (Provider: Delete service)
│
├── /bookings
│   ├── GET  /                  (Admin: List all bookings)
│   ├── GET  /:id               (Get booking details)
│   ├── GET  /user/:uid         (Get user's bookings)
│   ├── GET  /provider/:pid     (Provider: Get bookings)
│   ├── POST /                  (Create booking)
│   ├── PUT  /:id               (Update booking)
│   ├── PATCH /:id/status       (Update booking status)
│   └── DELETE /:id             (Cancel booking)
│
└── /upload
    ├── POST /single            (Upload one image)
    ├── POST /multiple          (Upload multiple images)
    └── DELETE /:publicId       (Delete image)
```

## Environment Configuration

### Backend (.env)

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
FIREBASE_PROJECT_ID=***
CLOUDINARY_CLOUD_NAME=***
CLOUDINARY_API_KEY=***
CLOUDINARY_API_SECRET=***
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=***
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=***
NEXT_PUBLIC_FIREBASE_PROJECT_ID=***
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Deployment Ready

### Backend Options:

- Railway
- Render
- Heroku
- Google Cloud Run
- AWS Elastic Beanstalk

### Frontend Options:

- Vercel (Recommended for Next.js)
- Netlify
- AWS Amplify
- Google Cloud Platform

### Database:

- Already on Firebase Cloud (No deployment needed)

### Images:

- Already on Cloudinary CDN (No deployment needed)

---

**Your application is fully integrated and ready to run!** 🎉

See `CHECKLIST.md` for setup instructions.
