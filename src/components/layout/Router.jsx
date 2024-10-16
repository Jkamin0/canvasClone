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

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Will need to fix */}
          <Route path="/" element={<GenericPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/pages" element={<AllPages />} />
          {/* Will need to fix */}
          <Route path="/announcement" element={<GenericAnnouncement />} />
          <Route path="/announcements" element={<AllAnnouncements />} />
          <Route path="/modules" element={<Modules />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
