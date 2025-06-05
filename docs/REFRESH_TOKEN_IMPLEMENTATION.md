# Refresh Token Implementation

This document explains the comprehensive refresh token implementation that ensures users stay logged in and have a seamless experience without frequent login interruptions.

## Problem Solved

Previously, when the access token expired, users were immediately logged out and redirected to the login page, creating a poor user experience. The application now automatically refreshes expired access tokens using refresh tokens, keeping users logged in seamlessly.

## Key Components

### 1. AuthUtils (`src/lib/auth-utils.ts`)

A utility class that handles all token-related operations:

- **Token Storage**: Securely stores both access and refresh tokens
- **Token Retrieval**: Gets tokens from localStorage with proper error handling
- **Expiry Management**: Tracks token expiration and determines when refresh is needed
- **Token Validation**: Checks if tokens exist and are valid

Key methods:

- `storeTokens(tokens: AuthTokens)`: Stores both access and refresh tokens
- `getAccessToken()`: Returns the current access token
- `getRefreshToken()`: Returns the current refresh token
- `isTokenExpired()`: Checks if token is expired (with 5-minute buffer)
- `shouldRefreshToken()`: Determines if a refresh attempt should be made
- `clearTokens()`: Safely removes all stored tokens

### 2. Enhanced API Layer (`src/lib/api.ts`)

Updated axios interceptors that handle automatic token refresh:

#### Request Interceptor

- Automatically adds the current access token to all API requests
- Uses AuthUtils for token retrieval instead of direct localStorage access

#### Response Interceptor

- **Detects 401 errors**: Automatically catches authentication failures
- **Prevents infinite loops**: Uses retry flags to avoid circular refresh attempts
- **Queue management**: Queues failed requests while refreshing tokens
- **Automatic retry**: Retries original requests with new tokens after successful refresh
- **Graceful fallback**: Redirects to login if refresh fails

### 3. Authentication Context (`src/context/AuthContext.tsx`)

Provides centralized authentication state management:

- **Global auth state**: Tracks authentication status across the app
- **Automatic monitoring**: Periodically checks token expiry
- **Cross-tab synchronization**: Detects logout in other browser tabs
- **Centralized methods**: Provides login, logout, and refresh functions

### 4. Authentication Hooks (`src/hooks/useAuth.ts`)

Convenient hooks for components to use authentication:

- `useAuthCheck()`: Provides auth status and handles redirects
- `useTokenStatus()`: Real-time token status monitoring

## How It Works

### Token Refresh Flow

1. **User makes API request**
2. **Request interceptor** adds access token to headers
3. **Server responds with 401** (token expired)
4. **Response interceptor** detects 401 error
5. **Automatic refresh** attempts to get new tokens using refresh token
6. **On success**:
   - New tokens are stored
   - Original request is retried with new access token
   - User continues seamlessly
7. **On failure**:
   - Tokens are cleared
   - User is redirected to login

### Token Expiry Monitoring

- **Proactive refresh**: Tokens are refreshed 5 minutes before actual expiry
- **Background monitoring**: AuthContext checks token status every 5 minutes
- **Real-time updates**: Components can subscribe to token status changes

## Security Features

### Token Storage

- Uses localStorage for persistence across browser sessions
- Separates access and refresh tokens for better security
- Includes expiry time tracking for proactive refresh

### Error Handling

- Prevents infinite refresh loops with retry flags
- Handles network errors gracefully
- Logs security events for monitoring

### Cross-Tab Synchronization

- Detects token changes in other browser tabs
- Automatically logs out user if tokens are cleared elsewhere
- Maintains consistent auth state across multiple tabs

## Usage Examples

### For Components

```typescript
import { useAuthCheck } from '@/src/hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, isLoading } = useAuthCheck();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <LoginPrompt />;

  return <SecureContent />;
}
```

### For API Calls

```typescript
// No changes needed! Refresh happens automatically
const response = await contentAPI.getAll();
```

### For Authentication Actions

```typescript
import { useAuth } from '@/src/context/AuthContext';

function LoginComponent() {
  const { login, logout } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // User is now logged in with tokens stored
    } catch (error) {
      // Handle login error
    }
  };
}
```

## Migration Notes

### Updated Components

- **LoginForm**: Now uses AuthUtils.storeTokens()
- **SignupForm**: Now uses AuthUtils.storeTokens()
- **NavBar**: Now uses authAPI.logout()
- **Content pages**: Now use AuthUtils for token checking
- **AuthDebug**: Enhanced with refresh token information

### Backward Compatibility

- Automatically clears old 'token' localStorage key
- Migrates existing users seamlessly
- No breaking changes to existing API calls

## Benefits

### User Experience

- **Seamless sessions**: Users stay logged in without interruption
- **No data loss**: Forms and work aren't lost due to sudden logouts
- **Background refresh**: Token refresh happens invisibly to users
- **Cross-tab consistency**: Logout in one tab affects all tabs

### Developer Experience

- **Automatic handling**: No manual token refresh logic needed
- **Error resilience**: Built-in error handling and retry logic
- **Easy debugging**: Enhanced debug component shows token status
- **Type safety**: Full TypeScript support with proper interfaces

### Security

- **Shorter access token lifetime**: Reduces exposure window
- **Secure refresh**: Refresh tokens are handled securely
- **Proper cleanup**: Tokens are cleared on logout/failure
- **Audit trail**: All authentication events are logged

## Monitoring and Debugging

### Debug Component

The AuthDebug component now shows:

- Access token status and preview
- Refresh token status and preview
- Token expiry time
- Whether tokens are expired
- Whether tokens are valid

### Console Logs

- Token refresh attempts and results
- Authentication failures and redirects
- Token storage and retrieval operations

## Future Enhancements

### Potential Improvements

1. **Token rotation**: Implement refresh token rotation for enhanced security
2. **Biometric authentication**: Add support for fingerprint/face ID
3. **Remember me**: Extend token lifetime for trusted devices
4. **Session management**: Server-side session tracking and management
5. **Multi-factor authentication**: Add 2FA support with token management

### Performance Optimizations

1. **Token caching**: In-memory token caching for better performance
2. **Request deduplication**: Avoid multiple refresh attempts
3. **Preemptive refresh**: Refresh tokens before they're needed
4. **Background sync**: Service worker integration for offline scenarios
