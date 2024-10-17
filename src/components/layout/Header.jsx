import React from "react";
import { School as SchoolIcon } from "@mui/icons-material";

export default function Header() {
  return (
    <header className="flex items-center bg-blue-300 p-4">
      <SchoolIcon className="text-white mr-4" />
      <h1 className="text-white text-3xl font-bold">Canvas Clone Midterm</h1>
    </header>
  );
}
