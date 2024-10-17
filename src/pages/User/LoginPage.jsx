import React, { useContext, useState } from "react";
import { LoginContext } from "../../context/LoginContext";
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";

export default function LoginPage() {
  const { login, logout, error, isLoading, isAuthenticated, user } =
    useContext(LoginContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
    setEmail("");
    setPassword("");
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      {isAuthenticated ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Welcome, {user?.fullName || "User"}
          </h2>
          <p className="mb-4">You are logged in as {user?.email}</p>
          <form onSubmit={handleLogout}>
            <SubmitButton type="submit" isLoading={isLoading} fullWidth>
              Logout
            </SubmitButton>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleLogin}>
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <SubmitButton type="submit" isLoading={isLoading} fullWidth>
              Login
            </SubmitButton>
          </form>
        </div>
      )}
    </div>
  );
}
