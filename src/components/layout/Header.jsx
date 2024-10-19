import React, { useContext } from "react";
import { NavbarContext } from "../../context/NavbarContext";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";

export default function Header() {
  const { toggleNavbar } = useContext(NavbarContext);

  return (
    <AppBar position="static">
      <Toolbar className="bg-blue-300">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleNavbar}
        >
          <MenuIcon />
        </IconButton>
        <SchoolIcon className="text-white mr-4" />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Canvas Clone Midterm
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
