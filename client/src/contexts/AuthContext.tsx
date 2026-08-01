import { useState, createContext, useContext, useEffect } from "react";
import type { CurrentUser } from "../types";
import { getCurrentUser } from "../utils/api";

type  AuthContextValue = {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: CurrentUser) => void;
  logout: () => void;
  isLoading: boolean;
};
export const  AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  isLoading: false
});

export function  AuthProvider({ children }: { children: React.ReactNode }) {
  const  [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const  [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   getCurrentUser()
     .then((res) => {
       setCurrentUser(res.data);
       setIsAuthenticated(true);
     })
     .catch(() => {
        localStorage.removeItem('auth-token');
     })
     .finally(() => {
       setIsLoading(false);
     });
 }, []);

  function  login( token: string, user: CurrentUser) {
    localStorage.setItem("auth-token", token)
    setIsAuthenticated(true);
    setCurrentUser(user);
  }
  function  logout() {
    localStorage.removeItem("auth-token");
    setIsAuthenticated(false);
    setCurrentUser(null);
  }
  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
export function  useAuth() {
  return  useContext(AuthContext);
}