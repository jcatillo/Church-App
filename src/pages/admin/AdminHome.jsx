import {
  Stack,
  Box,
  Text,
  Button,
  SimpleGrid,
  Icon,
  VStack,
  HStack,
  Heading,
  Container,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Create motion wrapper
const MotionBox = motion(Box);

export function AdminHome() {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for initial data fetch
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (path) => {
    setIsLoading(true);
    navigate(path);
  };

  const adminFeatures = [
    {
      title: "Manage Bookings",
      description: "View, approve, and manage all church facility bookings",
      icon: FaBookmark,
      path: "/admin/bookings",
    },
    {
      title: "Create Events",
      description: "Create and manage church events and activities",
      icon: FaCalendarAlt,
      path: "/admin/events",
    },
  ];

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Stack spacing={16}>
        <Box textAlign="center">
          <Heading
            fontSize={["3xl", "4xl", "5xl"]}
            fontWeight="bold"
            mb={4}
            color={isDark ? "white" : "black"}
          >
            Admin Dashboard
          </Heading>
          <Text fontSize="xl" color={isDark ? "white" : "gray.600"}>
            Manage your church's bookings and events efficiently
          </Text>
        </Box>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={10}
          px={4}
          gap={"25px"}
        >
          {adminFeatures.map((feature, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              p={8}
              borderRadius="lg"
              boxShadow="md"
              bg={isDark ? "#222324" : "white"}
              _hover={{ transform: "translateY(-5px)", transition: "all 0.3s" }}
            >
              <HStack spacing={4} mb={4}>
                <Icon as={feature.icon} boxSize={8} color="blue.500" />
                <Heading size="md" color={isDark ? "white" : "black"}>
                  {feature.title}
                </Heading>
              </HStack>
              <VStack spacing={4} align="stretch">
                <Text color={isDark ? "white" : "gray.600"}>
                  {feature.description}
                </Text>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => handleNavigation(feature.path)}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                >
                  Manage
                </Button>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
