// src/store/auth-context.js
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  token: null,
  updateToken: () => {},
  logout: () => {},
  isAuthenticated: false
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Simple method to update token (refresh token is now handled by cookies)
  const updateToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  // Logout function to clear token and call backend logout
  const logout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      updateToken(null);
    }
  };

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!token) return;

    const refreshBeforeExpiry = async () => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        const now = Date.now();
        const timeout = exp - now - 60000; // 1 min before expiry

        if (timeout > 0) {
          setTimeout(async () => {
            try {
              const res = await fetch(`${process.env.REACT_APP_API_URL}/users/refresh`, {
                method: 'POST',
                credentials: 'include' // send refresh cookie
              });
              const data = await res.json();
              if (res.ok && data.accessToken) {
                updateToken(data.accessToken);
              } else {
                // If refresh fails, clear token
                updateToken(null);
              }
            } catch (err) {
              console.error('Token refresh error:', err);
              updateToken(null);
            }
          }, timeout);
        } else {
          // Already expired → try refresh immediately
          try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/refresh`, {
              method: 'POST',
              credentials: 'include'
            });
            const data = await res.json();
            if (res.ok && data.accessToken) {
              updateToken(data.accessToken);
            } else {
              updateToken(null);
            }
          } catch (err) {
            console.error('Token refresh error:', err);
            updateToken(null);
          }
        }
      } catch (error) {
        console.error('Token parsing error:', error);
        updateToken(null);
      }
    };

    refreshBeforeExpiry();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, updateToken, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
