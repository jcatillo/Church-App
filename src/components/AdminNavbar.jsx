"use client";

import {
  Box,
  Button,
  Flex,
  Stack,
  IconButton,
  CloseButton,
  Portal,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBackdrop,
  DrawerPositioner,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerTrigger,
  DrawerCloseTrigger,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useColorMode } from "@/components/ui/color-mode";
import { LuMoon, LuSun, LuMenu } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io"; // Added missing import
import { auth } from "@/config/firebase";
import { useState, useEffect } from "react";

export function AdminNavbar() {
  const { toggleColorMode, colorMode } = useColorMode();
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { path: "/admin/home", label: "Home" },
    { path: "/admin/calendar", label: "Calendar" },
    { path: "/admin/booking", label: "Bookings" },
    // { path: "/booking", label: "Booking" },
    // { path: "/contact-us", label: "Contact Us" },
    // { path: "/about-us", label: "About Us" },
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/";
      console.log(auth.currentUser);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Box
      width="100%"
      position="sticky"
      top={0}
      zIndex={1000}
      bg={colorMode === "light" ? "white" : "gray.900"}
      px={{ base: 4, md: 14 }}
      py={isSticky ? 5 : 5}
      boxShadow={isSticky ? "md" : "none"}
      transition="all 0.2s ease"
    >
      <Flex justify="space-between" align="center" width="100%">
        {/* Desktop Navigation links */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={3}
          align="center"
          wrap="wrap"
          display={{ base: "none", md: "flex" }}
        >
          {links.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant={location.pathname === link.path ? "solid" : "ghost"}
                colorScheme="whiteAlpha"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </Stack>

        {/* Hamburger Icon for Mobile */}
        <Drawer.Root>
          <DrawerTrigger asChild>
            <IconButton
              display={{ base: "flex", md: "none" }}
              variant="outline"
              size="sm"
              aria-label="Open menu"
              
            >
                {<LuMenu />}
            </IconButton>
          </DrawerTrigger>
          <Portal>
            <DrawerBackdrop />
            <DrawerPositioner>
              <DrawerContent bg={colorMode === "light" ? "white" : "gray.900"}>
                <DrawerCloseTrigger asChild>
                  <CloseButton size="sm" position="absolute" right="8px" top="8px" />
                </DrawerCloseTrigger>
                <DrawerHeader>Menu</DrawerHeader>
                <DrawerBody>
                  <Stack direction="column" spacing={4}>
                    {links.map((link) => (
                      <Link key={link.path} to={link.path}>
                        <Button
                          variant={location.pathname === link.path ? "solid" : "ghost"}
                          colorScheme="whiteAlpha"
                          width="100%"
                          justifyContent="flex-start"
                        >
                          {link.label}
                        </Button>
                      </Link>
                    ))}
                    <Button
                      onClick={handleLogout}
                      width="100%"
                      justifyContent="flex-start"
                    >
                      Logout {<IoIosLogOut />}
                    </Button>
                    <Button
                      onClick={toggleColorMode}
                      variant="outline"
                      width="100%"
                      justifyContent="center"
                    >
                      {colorMode === "light" ? <LuSun /> : <LuMoon />}
                    </Button>
                  </Stack>
                </DrawerBody>
              </DrawerContent>
            </DrawerPositioner>
          </Portal>
        </Drawer.Root>

        {/* Toggle Button and Admin login */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          align="center"
          wrap="wrap"
          display={{ base: "none", md: "flex" }}
        >
          <Link to="/login">
            <Button onClick={handleLogout}>
              Logout{<IoIosLogOut />}
            </Button>
          </Link>
          <IconButton
            onClick={toggleColorMode}
            variant="outline"
            size="sm"
            aria-label="Toggle color mode"
          >
            {colorMode === "light" ? <LuSun /> : <LuMoon />}
          </IconButton>
        </Stack>
      </Flex>
    </Box>
  );
}