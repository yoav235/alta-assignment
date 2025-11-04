# Google OAuth Migration - Client to Server-Side

## Summary

Migrated from client-side Google OAuth (using `@react-oauth/google`) to a **server-side OAuth flow** using Passport.js on the backend.

## Changes Made

### ✅ Removed from Frontend

1. **Packages Uninstalled:**
   - `@react-oauth/google` - No longer needed for client-side OAuth
   - `jwt-decode` - Was used to decode Google JWT tokens

2. **Removed Components:**
   - `GoogleOAuthProvider` wrapper in `src/main.jsx`
   - `<GoogleLogin>` components from Sign In/Sign Up pages
   - Client-side Google login handler `loginWithGoogle()` in AuthContext

3. **Environment Variables:**
   - Removed `VITE_GOOGLE_CLIENT_ID` (no longer needed)

### ✅ Added to Frontend

1. **New Component:**
   - `src/components/auth/GoogleAuthButton.jsx` - Simple button that redirects to backend OAuth
   - `src/components/auth/GoogleAuthButton.css` - Styling for the button

2. **New Page:**
   - `src/pages/OAuthCallback.jsx` - Handles OAuth callback with JWT token from backend

3. **New Auth Methods:**
   - `handleOAuthCallback(token)` - Stores JWT token from backend
   - `fetchCurrentUser()` - Fetches user data from `/api/auth/me`

4. **New Route:**
   - `/auth/callback` - OAuth callback page

## How It Works Now

### Sign In with Google Flow:

```
1. User clicks "Sign in with Google" button
   ↓
2. Frontend redirects to: {backend}/auth/google
   ↓
3. Backend handles OAuth with Google (Passport.js)
   ↓
4. Backend redirects back to: {frontend}/auth/callback?token={jwt}
   ↓
5. Frontend stores JWT token
   ↓
6. Frontend fetches user data from /api/auth/me
   ↓
7. User redirected to /dashboard
```

## Backend Requirements

Your backend must implement these endpoints:

### 1. OAuth Initiation
```
GET /auth/google
- Initiates Passport OAuth flow
- Redirects user to Google login
```

### 2. OAuth Callback
```
GET /auth/google/callback
- Receives authorization code from Google
- Creates/finds user in database
- Generates JWT token
- Redirects to: {frontend_url}/auth/callback?token={jwt}
```

### 3. Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: {
  user: {
    id: string,
    name: string,
    email: string,
    role: string
  }
}
```

## Environment Setup

### Frontend `.env`:
```env
VITE_API_URL=https://shift-manager-backend-y3kz.onrender.com/api
```

### Backend Requirements:
- Passport.js configured with `passport-google-oauth20`
- Google OAuth credentials (Client ID & Secret) stored on backend
- Authorized redirect URI: `{backend_url}/auth/google/callback`
- Frontend callback URL configured to redirect after OAuth

## Security Improvements

✅ **No client-side secrets** - Google OAuth credentials never exposed to frontend  
✅ **Server-controlled flow** - OAuth handled entirely by backend  
✅ **JWT-based auth** - Backend issues JWT after successful OAuth  
✅ **Secure token storage** - JWT stored in localStorage, used for API calls  

## Testing

### Test Google Sign-In:
1. Go to Sign In or Sign Up page
2. Click "Sign in with Google" button
3. Console should log: `🔐 Redirecting to Google OAuth: {backend}/auth/google`
4. After Google authentication, you should see:
   - `🔄 OAuth Callback - Token: received`
   - `🔐 Processing OAuth callback with token`
   - `👤 Fetching current user from backend`
   - `✅ User data fetched: {...}`
   - Redirect to dashboard

### Verify in Console:
- Open browser DevTools → Console tab
- All OAuth steps are logged with emojis for easy tracking

## Files Modified

- `src/main.jsx` - Removed GoogleOAuthProvider
- `src/contexts/AuthContext.jsx` - Replaced client OAuth with server OAuth handling
- `src/pages/SignInPage.jsx` - Replaced GoogleLogin with GoogleAuthButton
- `src/pages/SignUpPage.jsx` - Replaced GoogleLogin with GoogleAuthButton
- `src/App.jsx` - Added /auth/callback route
- `README.md` - Updated documentation to reflect server-side OAuth

## Files Created

- `src/components/auth/GoogleAuthButton.jsx`
- `src/components/auth/GoogleAuthButton.css`
- `src/pages/OAuthCallback.jsx`
- `OAUTH_MIGRATION.md` (this file)

