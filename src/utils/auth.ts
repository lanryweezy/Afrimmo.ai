// Authentication and security utilities for the application

// Token storage with security considerations
const TOKEN_KEY = 'afrimmo_auth_token';
const REFRESH_TOKEN_KEY = 'afrimmo_refresh_token';
const USER_DATA_KEY = 'afrimmo_user_data';

// Secure token storage using httpOnly cookies approach (client-side simulation)
export const tokenStorage = {
  setToken: (token: string) => {
    // In a real app, the JWT would come from an httpOnly cookie
    // Here we simulate secure storage with additional protections
    try {
      // Store token with expiration
      const tokenData = {
        token,
        expiry: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },

  getToken: (): string | null => {
    try {
      const tokenDataStr = localStorage.getItem(TOKEN_KEY);
      if (!tokenDataStr) return null;

      const tokenData = JSON.parse(tokenDataStr);
      
      // Check if token is expired
      if (Date.now() > tokenData.expiry) {
        tokenStorage.clearToken();
        return null;
      }

      return tokenData.token;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  setRefreshToken: (refreshToken: string) => {
    try {
      const refreshTokenData = {
        token: refreshToken,
        expiry: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      };
      localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(refreshTokenData));
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  },

  getRefreshToken: (): string | null => {
    try {
      const refreshTokenDataStr = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshTokenDataStr) return null;

      const refreshTokenData = JSON.parse(refreshTokenDataStr);
      
      // Check if refresh token is expired
      if (Date.now() > refreshTokenData.expiry) {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        return null;
      }

      return refreshTokenData.token;
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  },

  clearRefreshToken: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  setUserData: (userData: any) => {
    try {
      // Encrypt sensitive user data before storing (simplified version)
      const encryptedData = btoa(JSON.stringify(userData)); // Base64 encoding as a simple obfuscation
      localStorage.setItem(USER_DATA_KEY, encryptedData);
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  },

  getUserData: (): any => {
    try {
      const userDataStr = localStorage.getItem(USER_DATA_KEY);
      if (!userDataStr) return null;

      // Decrypt user data (simplified version)
      const decryptedData = atob(userDataStr);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  },

  clearUserData: () => {
    localStorage.removeItem(USER_DATA_KEY);
  },

  clearAllAuthData: () => {
    tokenStorage.clearToken();
    tokenStorage.clearRefreshToken();
    tokenStorage.clearUserData();
  }
};

// Authentication state management
export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Password strength checker
export const checkPasswordStrength = (password: string): { score: number; feedback: string[] } => {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add uppercase letters');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add lowercase letters');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add numbers');
  }

  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add special characters');
  }

  return { score, feedback };
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';

  // Remove potentially dangerous content
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

// CSRF token generation (simplified)
export const generateCSRFToken = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Validate JWT token format (without verifying signature)
export const isValidJWT = (token: string): boolean => {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    // Decode header and payload (without verifying signature)
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    // Check if token is expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};

// Rate limiting simulation
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts = 5, windowMs = 60000) { // 5 attempts per minute
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(timestamp => now - timestamp < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false; // Rate limit exceeded
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }
}

// Security headers for API requests
export const getSecureHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  };

  if (includeAuth) {
    const token = tokenStorage.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Session management
export const sessionManager = {
  startSession: () => {
    // Set a session identifier
    sessionStorage.setItem('session_id', crypto.randomUUID());
    
    // Set up session timeout
    const timeout = 30 * 60 * 1000; // 30 minutes
    setTimeout(() => {
      if (tokenStorage.getToken()) {
        // Refresh token or prompt for re-authentication
        console.log('Session about to expire, refreshing...');
      }
    }, timeout - 5 * 60 * 1000); // Refresh 5 minutes before expiry
  },

  endSession: () => {
    sessionStorage.removeItem('session_id');
    tokenStorage.clearAllAuthData();
  },

  isActive: (): boolean => {
    return !!sessionStorage.getItem('session_id') && !!tokenStorage.getToken();
  }
};