export interface User {
  id: string;
  _id?: string; // MongoDB style ID that backend might return
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  profilePicUrl?: string; // Backend API response uses this field
  googleId?: string; // Google OAuth ID
  googleEmail?: string; // Google email
  authProvider?: 'local' | 'google'; // Authentication provider
  verified?: boolean; // Email verification status
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  tokenType?: string;
}

export interface AuthResponse {
  statusCode: string;
  message: string;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Google Auth specific types
export interface GoogleAuthResponse {
  success: boolean;
  user?: User;
  tokens?: AuthTokens;
  error?: string;
  isNewUser?: boolean;
}

export interface GoogleAuthState {
  isAuthenticating: boolean;
  error: string | null;
}
