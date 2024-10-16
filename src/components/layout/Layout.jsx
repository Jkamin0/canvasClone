import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="h-screen">
      <Header />
      <div className="flex">
        <Navbar />
        <main className="p-4  w-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
