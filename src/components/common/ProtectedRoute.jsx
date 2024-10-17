import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

export default function ProtectedRoute({ element }) {
  const { isAuthenticated } = useContext(LoginContext);

  return isAuthenticated ? element : <Navigate to="/login" />;
}
