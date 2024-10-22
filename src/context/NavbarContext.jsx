import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useApi } from "../api/apiV3";

export const NavbarContext = createContext({
  isOpen: false,
  toggleNavbar: () => {},
});

const useNavbarState = (navbarApi) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const initializeNavbarState = async () => {
      // Prevent default type seeding to run more than once
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      const [navbarData] = await navbarApi.getAll();
      if (navbarData) {
        setIsOpen(navbarData.isOpen);
      } else {
        await navbarApi.create({ id: "navbar", isOpen: false });
      }
    };

    initializeNavbarState();
  }, []);

  const toggleNavbar = async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    await navbarApi.update("navbar", { isOpen: newIsOpen });
  };

  return { isOpen, toggleNavbar };
};

export const NavbarContextProvider = ({ children }) => {
  const navbarApi = useApi("navbarState");
  const { isOpen, toggleNavbar } = useNavbarState(navbarApi);

  return (
    <NavbarContext.Provider value={{ isOpen, toggleNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
};
