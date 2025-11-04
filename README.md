# AI Meeting Scheduler - Frontend

A modern, responsive React application for AI-powered meeting scheduling with round-robin SAM (Sales Account Manager) assignment and Google Calendar integration.

## 🚀 Features

### Public Booking Flow
- **Landing Page**: Professional landing page with business overview and CTA
- **Time Slot Selection**: Interactive calendar interface to choose available meeting times
- **Lead Information Form**: Validated form for capturing lead details (name, email, phone)
- **Booking Confirmation**: Success screen with meeting details and cancellation token
- **Phone Booking**: Display phone number for voice agent booking option

### SAM Dashboard (Coming Soon)
- Google Calendar integration for weekly schedule view
- Analytics dashboard with KPIs (booking conversion, no-show rates, etc.)
- Potential leads list with meeting status
- Manual booking system for SAMs

### Features Implemented
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ Modern gradient UI with smooth animations
- ✅ Form validation with real-time error feedback
- ✅ Loading states and error handling
- ✅ API integration ready
- ✅ Token-based cancellation/rescheduling support

## 📦 Tech Stack

- **React 19** - UI framework
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **date-fns** - Date formatting and manipulation
- **@react-oauth/google** - Google Calendar integration (ready for implementation)

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

A `.env` file has been created with the backend URL. To enable Google Sign-In, add your Google Client ID:

```env
# Backend API URL (already configured)
VITE_API_URL=https://shift-manager-backend-y3kz.onrender.com/api

# Google OAuth Client ID (add your Client ID here)
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

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

## 🔌 API Integration

The app integrates with a separate backend service. Configure the backend URL via the `VITE_API_URL` environment variable.

### API Endpoints Used

- `GET /api/availability` - Fetch available time slots
- `POST /api/meetings/book` - Book a new meeting
- `POST /api/meetings/cancel` - Cancel a meeting with token
- `GET /api/meetings` - List SAM's meetings (dashboard)
- `POST /api/auth/login` - SAM authentication
- `POST /api/auth/register` - SAM registration

## 🎨 Pages & Components

### 1. Landing Page (`/`)
- Hero section with business summary
- "Schedule a Meeting" CTA button
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

### 3. Dashboard (Coming Soon)
- Google Calendar weekly view
- Analytics and KPIs
- Leads management
- Manual booking

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

### Backend Status

✅ **Backend URL Configured**: `https://shift-manager-backend-y3kz.onrender.com/api`

⚠️ **Current Mode - Mock Data:**
- **Booking component**: Uses mock calendar data (can be switched to real API)
- **Authentication**: Uses mock login/registration (can be switched to real API)
- **Calendar**: Mock availability for next 14 business days (9 AM - 5 PM)

### Switching to Real Backend

To connect components to the actual backend:

**For Booking:**
1. Open `src/pages/BookingPage.jsx`
2. Uncomment the real API import: `import { bookMeeting } from '../services/api';`
3. Replace the mock booking code with the commented API call
4. Update `Calendar.jsx` to fetch from `GET /api/availability` instead of mock data

**For Authentication:**
1. Open `src/contexts/AuthContext.jsx`
2. Uncomment the API calls in `login` and `register` functions
3. Remove or comment out the mock implementations

**Expected API Endpoints:**
- `GET /api/availability` → Returns: `{ slots: [{ start, end }, ...] }`
- `POST /api/meetings/book` → Accepts: `{ lead: { name, email, phone }, start, end }`
- `POST /api/auth/login` → Accepts: `{ email, password }`
- `POST /api/auth/register` → Accepts: `{ name, email, password }`
- `POST /api/auth/google` → Accepts: `{ credential }` (Google JWT token)

## 🎯 Next Steps

According to the implementation plan, the following features are pending:

1. **Authentication Pages**
   - Sign In page for SAMs
   - Sign Up page for SAMs
   - Auth context for state management

2. **SAM Dashboard**
   - Google Calendar OAuth integration
   - Weekly calendar view component
   - Analytics panel with KPIs
   - Potential leads list
   - Manual booking system

3. **Cancel/Reschedule Page**
   - Token-based meeting cancellation
   - Reschedule functionality

4. **Google Calendar Integration**
   - OAuth 2.0 flow
   - Calendar API service
   - Real-time sync with backend

## 🌐 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | Yes | `http://localhost:5000/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes (for Google Sign-In) | `xxx.apps.googleusercontent.com` |

### Setting Up Google OAuth

To enable Google Sign-In:

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select an existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Your production domain (e.g., `https://yourdomain.com`)
   - Add authorized redirect URIs (same as above)
5. **Copy the Client ID** and add it to your `.env` file:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```
6. **Restart the dev server** after adding the environment variable

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 480px
- Tablet: 481px - 968px
- Desktop: > 968px

## 🤝 Contributing

This is a home assignment project. For questions or issues, please contact the project maintainer.

## 📄 License

Private project for Alta home assignment.
