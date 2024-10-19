import React, { createContext, useContext, useState, useEffect } from "react";
import { useApi } from "../api/apiV3";

export const NavbarContext = createContext({
  isOpen: false,
  toggleNavbar: () => {},
});

export const NavbarContextProvider = ({ children }) => {
  const navbarApi = useApi("navbarState");
  const [isOpen, setIsOpen] = useState(false);

  // Load the initial state from local storage
  useEffect(() => {
    const fetchNavbarState = async () => {
      const navbarData = await navbarApi.getAll();
      if (navbarData.length > 0) {
        setIsOpen(navbarData[0].isOpen);
      } else {
        // Initialize state if it doesn't exist
        await navbarApi.create({ id: "navbar", isOpen: false });
      }
    };

    fetchNavbarState();
  }, []);

  const toggleNavbar = async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    // Update the value in local storage
    await navbarApi.update("navbar", { isOpen: newIsOpen });
  };

  return (
    <NavbarContext.Provider value={{ isOpen, toggleNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
};
