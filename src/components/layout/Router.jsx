import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../../pages/User/LoginPage";
import RegisterPage from "../../pages/User/RegisterPage";
import ProfilePage from "../../pages/User/ProfilePage";
import GenericPage from "../../pages/PageTypes/GenericPage";
import AllPages from "../../pages/PageTypes/AllPages";
import GenericAnnouncement from "../../pages/PageTypes/GenericAnnouncement";
import AllAnnouncements from "../../pages/PageTypes/AllAnnouncements";
import Modules from "../../pages/PageTypes/Modules";
import Layout from "./Layout";
import HomePage from "../../pages/PageTypes/HomePage";
import ProtectedRoute from "../common/ProtectedRoute";
import LoginContextProvider from "../../context/LoginContext";
import { NavbarContextProvider } from "../../context/NavbarContext";

const AppRoutes = () => {
  return (
    <LoginContextProvider>
      <NavbarContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/profile"
                element={<ProtectedRoute element={<ProfilePage />} />}
              />
              <Route
                path="/pages"
                element={<ProtectedRoute element={<AllPages />} />}
              />
              <Route
                path="/announcements"
                element={<ProtectedRoute element={<AllAnnouncements />} />}
              />
              <Route
                path="/modules"
                element={<ProtectedRoute element={<Modules />} />}
              />
              <Route
                path="/announcements/:id"
                element={<ProtectedRoute element={<GenericAnnouncement />} />}
              />
              <Route
                path="/pages/:id"
                element={<ProtectedRoute element={<GenericPage />} />}
              />
            </Route>
          </Routes>
        </Router>
      </NavbarContextProvider>
    </LoginContextProvider>
  );
};

export default AppRoutes;
