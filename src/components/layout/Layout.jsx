import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <div className="h-screen">
      <Header onMenuClick={toggleDrawer} />
      <div className="flex">
        <Navbar isDrawerOpen={isDrawerOpen} onClose={toggleDrawer} />
        <main className="p-4  w-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
