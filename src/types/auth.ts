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
