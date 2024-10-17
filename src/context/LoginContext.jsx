import { createContext, useState, useEffect } from "react";
import { useApi } from "../api/apiV3";

export const LoginContext = createContext({
  error: null,
  isAuthenticated: false,
  isLoading: false,
  user: null,
  login: () => {},
  logout: () => {},
  createUser: () => {},
  updateUser: () => {},
});

export default function LoginContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const userApi = useApi("users");

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await userApi.getByField("isLoggedIn", true);
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
    };
    fetchUser();
  }, []);

  async function handleLogin(email, password) {
    setIsLoading(true);
    setError(null);

    try {
      const user = await userApi.getByField("email", email);
      if (user && user.password === password) {
        setUser({ ...user, isLoggedIn: true });
        setIsAuthenticated(true);
        await userApi.update(user.id, { ...user, isLoggedIn: true });
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    setIsLoading(true);
    setError(null);

    try {
      await userApi.update(user.id, { ...user, isLoggedIn: false });
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateUser(
    email,
    password,
    fullName,
    major,
    age,
    isTeacher
  ) {
    setIsLoading(true);
    setError(null);

    try {
      const existingUser = await userApi.getByField("email", email);
      if (existingUser) {
        throw new Error("email already taken");
      }

      const newUser = {
        email,
        password,
        isLoggedIn: false,
        fullName,
        major,
        age,
        isTeacher,
      };

      const newUserId = await userApi.create(newUser);
      const createdUser = await userApi.getById(newUserId);

      setUser(createdUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateUser(updatedData) {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = {
        ...user,
        ...updatedData,
      };

      await userApi.update(user.id, updatedUser);
      setUser(updatedUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const ctxValue = {
    error,
    isAuthenticated,
    isLoading,
    user,
    login: handleLogin,
    logout: handleLogout,
    createUser: handleCreateUser,
    updateUser,
  };

  return (
    <LoginContext.Provider value={ctxValue}>{children}</LoginContext.Provider>
  );
}
