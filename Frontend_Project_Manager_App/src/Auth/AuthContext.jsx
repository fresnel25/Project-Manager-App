import { createContext, useState, useEffect } from "react";
import { loginUser as loginApi } from "../Api/userApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      const userData = parseJwt(token);
      setUser(userData);
    }
  }, [token]);

  // Fonction pour se connecter
  const loginUser = async ({ email, password }) => {
    const res = await loginApi({ email, password });
    const jwt = res.data.token;
    setToken(jwt);
    localStorage.setItem("token", jwt);

    const userData = parseJwt(jwt);
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};


function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}
