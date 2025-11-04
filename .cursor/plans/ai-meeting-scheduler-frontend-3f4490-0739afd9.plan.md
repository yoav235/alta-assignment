<!-- 0739afd9-e674-42b9-8d9b-1fe8901aaf89 9f642814-bd8a-4312-aa5b-e4dbed75442e -->
# AI Meeting Scheduler Frontend Implementation

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, Layout
│   ├── booking/         # BookingForm, TimeSlotPicker
│   ├── dashboard/       # WeeklyCalendar, Analytics, LeadsList, ManualBooking
│   └── auth/            # SignIn, SignUp forms
├── contexts/
│   └── AuthContext.jsx  # Authentication state management
├── pages/
│   ├── LandingPage.jsx  # Public landing page
│   ├── BookingPage.jsx  # Public booking interface
│   ├── Dashboard.jsx    # SAM dashboard
│   └── CancelPage.jsx   # Cancel/reschedule with token
├── services/
│   ├── api.js           # API client for backend
│   └── googleCalendar.js # Google Calendar API integration
├── utils/
│   └── helpers.js       # Date formatting, validation utilities
└── App.jsx              # Router setup
```

## Core Features

### 1. Landing Page (`pages/LandingPage.jsx`)

- Hero section with fake business summary
- "Schedule a Meeting" CTA button (opens booking modal/page)
- Phone number display for voice booking
- Header with "Sign In" / "Sign Up" buttons (top right)

### 2. Public Booking Flow (`components/booking/`)

- **BookingForm**: Lead details (name, email, phone)
- **TimeSlotPicker**: Fetch available slots from `GET /api/availability`
- Submit to `POST /api/meetings/book`
- Confirmation screen with meeting details and cancellation token link

### 3. Authentication (`components/auth/`, `contexts/AuthContext.jsx`)

- Sign In / Sign Up forms for SAMs
- JWT token storage in localStorage
- Protected routes for dashboard
- AuthContext to share auth state across app

### 4. SAM Dashboard (`pages/Dashboard.jsx`)

**Main Components:**

- **Google Calendar Integration** (`components/dashboard/WeeklyCalendar.jsx`)
  - Display SAM's weekly schedule synced with Google Calendar
  - OAuth 2.0 authentication with Google
  - Read-only view showing confirmed meetings
  - Visual time blocks with meeting details

- **Analytics Panel** (`components/dashboard/Analytics.jsx`)
  - KPIs: Booking conversion rate, time-to-book average
  - Double-booking incidents counter
  - No-show rate tracking
  - Weekly/monthly meeting counts

- **Potential Leads List** (`components/dashboard/LeadsList.jsx`)
  - Display upcoming meetings with lead details
  - Status indicators (confirmed, pending, cancelled)
  - Quick actions (view, cancel, reschedule)

- **Manual Booking System** (`components/dashboard/ManualBooking.jsx`)
  - SAM can manually book meetings for leads
  - Similar to public booking form but SAM-initiated
  - Bypass or use round-robin assignment

### 5. Cancel/Reschedule (`pages/CancelPage.jsx`)

- Token-based URL: `/cancel/:token`
- Fetch meeting details
- Cancel button → `POST /api/meetings/cancel`
- Reschedule option → redirect to booking with pre-filled data

## Google Calendar Integration

**Setup:**

1. Use Google Calendar API with OAuth 2.0
2. SAM connects Google account during first dashboard visit
3. Frontend displays calendar events using `@react-oauth/google` or `gapi`
4. Sync meetings from backend with Google Calendar events
5. Environment variable for Google Client ID (`VITE_GOOGLE_CLIENT_ID`)

**Key Files:**

- `services/googleCalendar.js`: API wrapper for calendar operations
- Store access token in localStorage after OAuth flow
- Refresh token handling for persistent sessions

## API Integration (`services/api.js`)

Configure base URL via environment variable:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```

**Endpoints:**

- `GET /api/availability` - Available time slots
- `POST /api/meetings/book` - Book meeting
- `POST /api/meetings/cancel` - Cancel with token
- `GET /api/meetings` - SAM's meetings list
- `POST /api/sams` - SAM availability rules
- `POST /api/auth/login` - SAM authentication
- `POST /api/auth/register` - SAM registration

## Routing (`App.jsx`)

```
/ → LandingPage (public)
/book → BookingPage (public)
/cancel/:token → CancelPage (public)
/signin → SignIn (public)
/signup → SignUp (public)
/dashboard → Dashboard (protected, SAM only)
```

## Styling Approach

- Modern, clean CSS with responsive design
- Mobile-first approach
- Professional color scheme (blues/greens for trust)
- Smooth transitions and hover effects
- Calendar view with grid layout for weekly schedule

## Dependencies to Install

```bash
npm install react-router-dom @react-oauth/google date-fns
```

- `react-router-dom`: Routing
- `@react-oauth/google`: Google OAuth & Calendar integration
- `date-fns`: Date formatting and manipulation

## Environment Variables

Create `.env` file:

```
VITE_API_URL=<your-backend-url>
VITE_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

## Implementation Notes

- Use React Context for auth state management (simpler than Redux)
- Implement loading states and error handling for all API calls
- Add input validation on booking forms
- Display timezone information clearly for meetings
- Handle Google Calendar OAuth errors gracefully
- Mobile-responsive design for all pages
- Accessibility considerations (ARIA labels, keyboard navigation)

### To-dos

- [ ] Install react-router-dom and setup routing structure with pages for booking, dashboard, SAM management, and cancel/reschedule
- [ ] Create API service layer with functions for all backend endpoints (availability, booking, cancel, meetings list, SAM management)
- [ ] Create configuration file for API URL and date/timezone utility functions
- [ ] Implement public booking page with lead form, availability slots display, and booking confirmation
- [ ] Build availability slots component with date grouping, timezone display, and slot selection
- [ ] Create token-based cancel/reschedule page with meeting details and action buttons
- [ ] Build dashboard with meetings list, filtering, status indicators, and SAM assignments
- [ ] Implement SAM management page with forms for working hours, buffers, weights, and availability overrides
- [ ] Add modern responsive CSS with mobile-first design, loading states, and error handling UI
- [ ] Create navigation component with routing links and responsive mobile menu