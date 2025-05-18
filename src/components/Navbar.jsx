import {
  Box,
  Button,
  Flex,
  Stack,
  ClientOnly,
  IconButton,
  Skeleton,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useColorMode } from "@/components/ui/color-mode";
import { LuMoon, LuSun } from "react-icons/lu";
import { useState, useEffect } from "react";

export function Navbar() {
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
    { path: "/", label: "Home" },
    { path: "/events", label: "Events" },
    { path: "/schedule", label: "Schedule" },
    { path: "/booking", label: "Booking" },
    { path: "/contact-us", label: "Contact Us" },
    { path: "/about-us", label: "About Us" },
  ];

  return (
    <Box
      width="100%"
      position="sticky"
      top={0}
      zIndex={1000}
      bg={colorMode === "light" ? "white" : "black"}
      px={14}
      py={isSticky ? 5 : 5}
      boxShadow={isSticky ? "md" : "none"}
      transition="all 0.2s ease"
    >
      <Flex justify="space-between" align="center" width="100%">
        {/* Navigation links */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={3}
          align="center"
          wrap="wrap"
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

        {/* Toggle Button and Admin login */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          align="center"
          wrap="wrap"
        >
          <Link to="/admin">
            <Button>Login as Admin</Button>
          </Link>
          <ClientOnly fallback={<Skeleton boxSize="8" />}>
            <IconButton
              onClick={toggleColorMode}
              variant="outline"
              size="sm"
              aria-label="Toggle color mode"
            >
              {colorMode === "light" ? <LuSun /> : <LuMoon />}
            </IconButton>
          </ClientOnly>
        </Stack>
      </Flex>
    </Box>
  );
}
