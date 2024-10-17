import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

export default function ProtectedRoute({ element }) {
  const { isAuthenticated, isLoading } = useContext(LoginContext);

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
}
