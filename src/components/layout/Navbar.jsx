import { Link } from "react-router-dom";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Notifications as AnnouncementsIcon,
  Article as PagesIcon,
  Lock as AuthenticateIcon,
  PersonAdd as CreateAccountIcon,
} from "@mui/icons-material";

export default function Navbar() {
  return (
    <div className="h-dvh w-56 bg-gray-800 text-white">
      <nav className="flex flex-col p-4 space-y-2">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="py-2 px-4 rounded hover:bg-gray-700 flex items-center"
            >
              <HomeIcon className="mr-2" />
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/login"
              className="py-2 px-4 rounded hover:bg-gray-700 flex items-center"
            >
              <AuthenticateIcon className="mr-2" />
              Authenticate
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="py-2 px-4 rounded hover:bg-gray-700 flex items-center"
            >
              <CreateAccountIcon className="mr-2" />
              Create Account
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="py-2 px-4 rounded hover:bg-gray-700 flex items-center"
            >
              <PersonIcon className="mr-2" />
              Profile Page
            </Link>
          </li>
          <li>
            <Link
              to="/announcements"
              className="py-2 px-4 rounded hover:bg-gray-700 flex items-center"
            >
              <AnnouncementsIcon className="mr-2" />
              Announcements
            </Link>
          </li>
          <li>
            <Link
              to="/pages"
              className="py-2 px-4 rounded hover:bg-gray-700 flex items-center"
            >
              <PagesIcon className="mr-2" />
              All Pages
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
