import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  // Load initial user state from localStorage
  const initialAuthUser = localStorage.getItem("Users");
  const [authUser, setAuthUser] = useState(
    initialAuthUser ? JSON.parse(initialAuthUser) : null
  );

  // Update localStorage whenever authUser changes
  useEffect(() => {
    if (authUser) {
      localStorage.setItem("Users", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("Users");
    }
  }, [authUser]);

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming the AuthContext
export const useAuth = () => useContext(AuthContext);
