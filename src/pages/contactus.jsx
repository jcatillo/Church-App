import {
  Stack,
  Box,
  Text,
  Input,
  Textarea,
  Button,
  SimpleGrid,
  Icon,
  VStack,
  HStack,
  Heading,
  Container,
} from "@chakra-ui/react";

import { useColorMode } from "@/components/ui/color-mode";

import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { Toaster, toaster } from "@/components/ui/toaster";

// Create motion wrapper
const MotionBox = motion(Box);

export function ContactUs() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    toaster.success({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Toaster />
      <Stack spacing={16}>
        {/* Header Section */}
        <Box textAlign="center" position="relative">
          <Box position="absolute" right={0} top={0}></Box>
          <Heading
            as="h1"
            fontSize={["3xl", "4xl", "5xl"]}
            fontWeight="bold"
            mb={4}
            color={isDark ? "white" : "black"}
          >
            Contact Us
          </Heading>
          <Text fontSize="xl" color={isDark ? "white" : "gray.600"}>
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} px={4} gap={7}>
          {/* Contact Information */}
          <VStack
            spacing={8}
            align="stretch"
            bg={isDark ? "#222324" : "white"}
            p={8}
            borderRadius="lg"
            boxShadow="md"
          >
            <Heading
              as="h2"
              size="lg"
              mb={4}
              color={isDark ? "white" : "black"}
            >
              Get in Touch
            </Heading>

            <HStack spacing={4}>
              <Icon as={FaPhone} boxSize={6} color="blue.500" />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" color={isDark ? "white" : "black"}>
                  Phone
                </Text>
                <Text color={isDark ? "white" : "gray.600"}>
                  +63 123 456 7890
                </Text>
              </VStack>
            </HStack>

            <HStack spacing={4}>
              <Icon as={FaEnvelope} boxSize={6} color="blue.500" />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" color={isDark ? "white" : "black"}>
                  Email
                </Text>
                <Text color={isDark ? "white" : "gray.600"}>
                  info@stotomaschurch.com
                </Text>
              </VStack>
            </HStack>

            <HStack spacing={4}>
              <Icon as={FaMapMarkerAlt} boxSize={6} color="blue.500" />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" color={isDark ? "white" : "black"}>
                  Address
                </Text>
                <Text color={isDark ? "white" : "gray.600"}>
                  Sto. Tomas de Villanueva Parish Church
                </Text>
                <Text color={isDark ? "white" : "gray.600"}>
                  Danao City, Cebu, Philippines
                </Text>
              </VStack>
            </HStack>

            <HStack spacing={4}>
              <Icon as={FaClock} boxSize={6} color="blue.500" />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" color={isDark ? "white" : "black"}>
                  Mass Schedule
                </Text>
                <Text color={isDark ? "white" : "gray.600"}>
                  Weekdays: 6:00 AM, 5:30 PM
                </Text>
                <Text color={isDark ? "white" : "gray.600"}>
                  Sunday: 6:00 AM, 8:00 AM, 10:00 AM, 4:00 PM
                </Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Contact Form */}
          <MotionBox
            as="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            bg={isDark ? "#222324" : "white"}
            p={8}
            borderRadius="lg"
            boxShadow="md"
          >
            <VStack spacing={4}>
              <Input
                placeholder="Your Name"
                size="lg"
                required
                bg={isDark ? "black" : "gray.50"}
                color={isDark ? "black" : "black"}
                _hover={{ borderColor: "blue.500" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
                _placeholder={{ color: isDark ? "gray.400" : "gray.500" }}
              />
              <Input
                type="email"
                placeholder="Your Email"
                size="lg"
                required
                bg={isDark ? "black" : "gray.50"}
                color={isDark ? "black" : "black"}
                _hover={{ borderColor: "blue.500" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
                _placeholder={{ color: isDark ? "gray.400" : "gray.500" }}
              />
              <Input
                placeholder="Subject"
                size="lg"
                required
                bg={isDark ? "black" : "gray.50"}
                color={isDark ? "black" : "black"}
                _hover={{ borderColor: "blue.500" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
                _placeholder={{ color: isDark ? "gray.400" : "gray.500" }}
              />
              <Textarea
                placeholder="Your Message"
                size="lg"
                required
                rows={6}
                bg={isDark ? "black" : "gray.50"}
                color={isDark ? "black" : "black"}
                _hover={{ borderColor: "blue.500" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
                _placeholder={{ color: isDark ? "gray.400" : "gray.500" }}
              />
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              >
                Send Message
              </Button>
            </VStack>
          </MotionBox>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
