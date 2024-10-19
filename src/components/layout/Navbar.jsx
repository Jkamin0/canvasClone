import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NavbarContext } from "../../context/NavbarContext";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Notifications as AnnouncementsIcon,
  Article as PagesIcon,
  Lock as AuthenticateIcon,
  PersonAdd as CreateAccountIcon,
  ViewModule as ModulesIcon,
} from "@mui/icons-material";

export default function Navbar() {
  const { isOpen, toggleNavbar } = useContext(NavbarContext);

  return (
    <Drawer anchor="left" open={isOpen} onClose={toggleNavbar}>
      <div className="w-56 h-full bg-gray-800 text-white">
        <div className="flex justify-start p-2">
          <IconButton onClick={toggleNavbar}>
            <CloseIcon />
          </IconButton>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className="py-3 px-4 rounded hover:bg-gray-700 flex items-center"
              >
                <HomeIcon className="mr-3" />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="py-3 px-4 rounded hover:bg-gray-700 flex items-center"
              >
                <AuthenticateIcon className="mr-3" />
                Authenticate
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="py-3 px-4 rounded hover:bg-gray-700 flex items-center"
              >
                <CreateAccountIcon className="mr-3" />
                Create Account
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="py-3 px-4 rounded hover:bg-gray-700 flex items-center"
              >
                <PersonIcon className="mr-3" />
                Profile Page
              </Link>
            </li>
            <li>
              <Link
                to="/announcements"
                className="py-3 px-4 rounded hover:bg-gray-700 flex items-center"
              >
                <AnnouncementsIcon className="mr-3" />
                Announcements
              </Link>
            </li>
            <li>
              <Link
                to="/pages"
                className="py-3 px-4 rounded hover:bg-gray-700 flex items-center"
              >
                <PagesIcon className="mr-3" />
                All Pages
              </Link>
            </li>
            <li>
              <Link
                to="/modules"
                className="py-3 px-4 rounded hover:bg-gray-700 flex items-center"
              >
                <ModulesIcon className="mr-3" />
                Modules
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </Drawer>
  );
}
