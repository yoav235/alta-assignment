# AI Meeting Scheduler - Frontend

A modern, responsive React application for AI-powered meeting scheduling with round-robin SAM (Sales Account Manager) assignment and Google Calendar integration.

## 🚀 Features

### Public Booking Flow
- **Landing Page**: Professional landing page with business overview and CTA
- **Phone Booking**: Display phone number for voice agent booking option

### 📊 SAM Dashboard
- **Weekly Calendar View**: Interactive calendar showing all scheduled meetings
- **Multiple View Modes**: Day, Week, and Month views
- **Meeting Details Modal**: Double-click meetings to view full client information
- **Meeting Management**: View all meetings with status, client details, and notes
- **Real-time Updates**: Fetches meetings from backend API
- **Meeting Summary**: Quick stats (total, confirmed, today's meetings)

### Features Implemented
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ Modern gradient UI with smooth animations
- ✅ Form validation with real-time error feedback
- ✅ Loading states and error handling
- ✅ API integration ready
- ✅ Token-based cancellation/rescheduling support
- ✅ Server-side Google OAuth (no client-side secrets)

## 📦 Tech Stack

- **React 19** - UI framework
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **date-fns** - Date formatting and manipulation

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd alta-assignment
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory with your backend URL:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

**Note:** Google OAuth is now handled entirely on the backend using Passport. No client-side Google Client ID is needed.

4. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx          # Navigation header with auth buttons
│   │   └── Header.css
│   └── booking/
│       ├── BookingForm.jsx     # Lead information form
│       ├── BookingForm.css
│       ├── TimeSlotPicker.jsx  # Available time slot selector
│       └── TimeSlotPicker.css
├── pages/
│   ├── LandingPage.jsx         # Public landing page
│   ├── LandingPage.css
│   ├── BookingPage.jsx         # Booking flow page
│   └── BookingPage.css
├── services/
│   └── api.js                  # Backend API client
├── utils/
│   └── helpers.js              # Utility functions (date, validation)
├── App.jsx                     # Main app with routing
├── App.css                     # Global app styles
├── index.css                   # Base styles
└── main.jsx                    # Entry point
```

## 🔌 Backend Integration

### Backend Service

The frontend integrates with a **complete, production-ready backend service** that handles all business logic, authentication, database operations, and API endpoints. The backend is built as a separate project and is fully functional.

**Note:** The backend codebase is maintained in a separate repository and will be shown on demand. The backend is fully operational and provides all required functionality for the AI Meeting Scheduler application.

### Backend Configuration

Configure the backend URL via the `VITE_API_URL` environment variable:

```env
VITE_API_URL=http://localhost:5000/api
```

### API Endpoints Used by Frontend

The frontend communicates with the backend through the following REST API endpoints:

#### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/login` | SAM email/password authentication | No |
| `POST` | `/api/auth/register` | Create new SAM account | No |
| `GET` | `/api/auth/me` | Get current authenticated user data | Yes (Bearer) |
| `GET` | `/auth/google` | Initiate Google OAuth flow (redirect) | No |
| `GET` | `/auth/google/callback` | OAuth callback handler (backend redirects to `/auth/callback?token={jwt}`) | No |

**Request/Response Examples:**

```javascript
// POST /api/auth/login
// Request: { email: "sam@example.com", password: "password123" }
// Response: { token: "jwt_token_here", user: { id, name, email, role } }

// GET /api/auth/me
// Headers: { Authorization: "Bearer jwt_token_here" }
// Response: { user: { id, name, email, role } }
```

#### 📅 Meeting Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/meetings/my-meetings` | Get all meetings for authenticated SAM | Yes (Bearer) |
| `POST` | `/api/meetings/book` | Book a new meeting | No |
| `POST` | `/api/meetings/cancel` | Cancel a meeting using cancellation token | No |
| `GET` | `/api/meetings/{token}` | Get meeting details by cancellation token | No |

**Request/Response Examples:**

```javascript
// POST /api/meetings/book
// Request: {
//   lead: { name: "John Doe", email: "john@example.com", phone: "+1234567890" },
//   start: "2024-01-15T10:00:00Z",
//   end: "2024-01-15T11:00:00Z"
// }
// Response: { 
//   meeting: { id, lead, start, end, samId, status },
//   cancelToken: "token_string"
// }

// GET /api/meetings/my-meetings
// Headers: { Authorization: "Bearer jwt_token_here" }
// Response: { 
//   data: { 
//     meetings: [
//       { id, leadName, leadEmail, leadPhone, start, end, status, notes }
//     ]
//   }
// }
```

#### ⏰ Availability Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/availability` | Get available time slots for booking | No |

**Request/Response Example:**

```javascript
// GET /api/availability?startDate=2024-01-15&endDate=2024-01-22
// Response: {
//   slots: [
//     { start: "2024-01-15T09:00:00Z", end: "2024-01-15T10:00:00Z" },
//     { start: "2024-01-15T10:00:00Z", end: "2024-01-15T11:00:00Z" }
//   ]
// }
```

#### 👥 SAM Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/sams` | Get list of all SAMs | Yes (Bearer) |
| `POST` | `/api/sams` | Create or update SAM configuration | Yes (Bearer) |

### Authentication Flow

**Google OAuth Flow:**
1. User clicks "Sign in with Google" button
2. Frontend redirects to: `{BACKEND_URL}/auth/google`
3. Backend handles OAuth with Google (Passport.js)
4. Backend redirects to: `{FRONTEND_URL}/auth/callback?token={jwt}`
5. Frontend stores token in localStorage
6. Frontend fetches user data from `/api/auth/me`
7. User redirected to dashboard

**Traditional Login Flow:**
1. User submits email/password form
2. Frontend posts to `/api/auth/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. User redirected to dashboard

### Backend Features

The backend service includes:

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Google OAuth Integration** - Server-side OAuth with Passport.js
- ✅ **Round-Robin Assignment** - Automatic meeting distribution to SAMs
- ✅ **Database Integration** - Persistent storage for users, meetings, and SAMs
- ✅ **Google Calendar Sync** - Integration with Google Calendar API
- ✅ **Meeting Management** - CRUD operations for meetings
- ✅ **Availability Calculation** - Business hours, buffers, and conflict detection
- ✅ **CORS Configuration** - Properly configured for frontend domain
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Input Validation** - Request validation and sanitization

### API Client Implementation

The frontend uses a centralized API client (`src/services/api.js`) that:
- Automatically injects Bearer tokens for authenticated requests
- Handles request/response formatting
- Provides consistent error handling
- Logs all API requests for debugging

**Note:** The backend codebase is maintained separately and will be provided on demand for review or integration purposes.

## 🎨 Pages & Components

### 1. Landing Page (`/`)
- Hero section with business summary
- Phone number for voice booking (1-800-SCHEDULE)
- Features showcase
- Statistics section
- Sign In / Sign Up buttons in header

### 2. Booking Page (`/book`)
- **Time Slot Picker**: 
  - Grouped by date with tab navigation
  - Grid layout of available times
  - Loading and error states
- **Booking Form**:
  - Name, email, phone validation
  - Real-time error feedback
  - Disabled state during submission
- **Confirmation Screen**:
  - Meeting details display
  - Cancellation token link
  - Actions to book another or return home

### 3. Dashboard (`/dashboard`)
- **Weekly Calendar Component**: 
  - Day view - detailed hourly breakdown (8 AM - 6 PM)
  - Week view - 7-day overview with all meetings
  - Month view - full month with meeting count per day
  - Double-click day headers to switch between views
- **Meeting Cards**: 
  - Color-coded cards with client details
  - Shows name, email, phone, time, and status
  - Hover effects and smooth animations
- **Meeting Details Modal**: 
  - Double-click any meeting to view full information
  - Displays client name, email, phone, date, time, status, and notes
  - Professional modal design with close options
- **Navigation Controls**: 
  - Previous/Next/Today buttons
  - View toggle (Day/Week/Month)
- **Meeting Summary**: 
  - Quick stats showing total meetings, confirmed meetings, and today's count
- **Protected Route**: Requires authentication, redirects to sign-in if not logged in

## 🚧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Form Validation

The booking form includes:
- Required field validation
- Email format validation
- Phone number validation (10+ digits)
- Real-time error feedback
- Touched field tracking

### API Service

The `api.js` service provides:
- Centralized API configuration
- Automatic auth token injection
- Error handling
- Request/response formatting

### Backend Integration Status

✅ **Backend is Complete and Operational**: The frontend is fully connected to a production-ready backend service.

✅ **All API Endpoints Implemented**: All required endpoints are functional and documented in the [Backend Integration](#-backend-integration) section above.

✅ **No Mock Data**: The application uses real backend API calls for all functionality including:
- Authentication (Google OAuth and email/password)
- Meeting management (booking, viewing, cancellation)
- User data fetching
- Availability checking

**Backend Configuration:**
- Set `VITE_API_URL` in `.env` file to point to your backend server
- Default: `http://localhost:5000/api` for local development
- Production: Set to your deployed backend URL

**Note:** The backend codebase is maintained in a separate repository and will be provided on demand for review or integration purposes.

## 🌐 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | Yes | `http://localhost:5000/api` |

### Google OAuth (Server-Side)

Google authentication is handled entirely on the backend using **Passport.js** (passport-google-oauth20). The frontend simply redirects users to the backend OAuth endpoint.

**Frontend Flow:**
1. User clicks "Sign in with Google" button
2. Frontend redirects to: `{backend}/auth/google`
3. Backend handles OAuth with Google
4. Backend redirects back to: `{frontend}/auth/callback?token={jwt}`
5. Frontend stores token and fetches user data from `/api/auth/me`

**No client-side Google configuration needed!** All OAuth secrets are securely stored on the backend.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 480px
- Tablet: 481px - 968px
- Desktop: > 968px

## 🤝 Contributing

This is a home assignment project. For questions or issues, please contact the project maintainer.

