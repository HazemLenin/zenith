import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types/chat";

interface UserContextType {
  userToken: string | null;
  setUserToken: (token: string | null) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

export const UserContext = createContext<UserContextType>({
  userToken: null,
  setUserToken: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  isAuthenticated: false,
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userToken, setUserToken] = useState<string | null>(
    localStorage.getItem("userToken")
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!userToken);

  useEffect(() => {
    if (userToken) {
      localStorage.setItem("userToken", userToken);
      setIsAuthenticated(true);

      // Fetch user data from token if needed
      try {
        const base64Url = userToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));

        setCurrentUser(payload.user);
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    } else {
      localStorage.removeItem("userToken");
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  }, [userToken]);

  const fetchUserData = async (token: string) => {
    try {
      // This would be replaced with your actual API endpoint
      const response = await fetch(
        `http://localhost:3000/api/users/${currentUser?.username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userToken,
        setUserToken,
        currentUser,
        setCurrentUser,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
