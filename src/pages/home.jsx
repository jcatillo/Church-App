import {
    Stack,
    Image,
    Box,
    Separator,
    HStack,
    Text,
    Blockquote,
    Flex,
    Button,
    Card,
    SimpleGrid
  } from "@chakra-ui/react";
  import { motion } from "framer-motion"; // ✅ Import
  import heroImage from "../assets/IMG_4214.jpg";
  
  // Create motion wrapper
const MotionBox = motion(Box);
const MotionCard = motion(Card.Root);

  // Sample data for each service
const services = [
    {
      title: "Wake Mass",
      description:
        "A special mass held for the deceased, offering prayers and comfort for grieving families.",
      image:
        "https://images.pexels.com/photos/257030/pexels-photo-257030.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "Wedding",
      description:
        "A sacred ceremony celebrating the union of two people in holy matrimony, blessed by God.",
      image:
        "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "Baptismal",
      description:
        "A baptismal rite symbolizing purification, rebirth, and acceptance into the Christian faith.",
      image:
        "https://images.pexels.com/photos/17120314/pexels-photo-17120314/free-photo-of-baptism-of-newborn-baby.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "Healing Mass",
      description:
        "A spiritual gathering focused on prayer for healing, peace, and restoration of health.",
      image:
        "https://christthekingparish.ph/wp-content/uploads/2016/09/healing-mass-2.jpg"
    },
    {
      title: "Deliverance",
      description:
        "A ministry that involves prayers to break spiritual bondages and reclaim spiritual freedom.",
      image:
        "https://i.swncdn.com/media/960w/cms/CW/49758-Jesus-crucifixion-1200x627-thinkstock.1200w.tn.webp"
    }
  ];
  
  export function Home() {
    return (
      <Stack spacing={16}>
        {/* Hero Section with Overlay */}
        <Box
        width="98%"
        height={["300px", "400px", "600px", "700px"]}
        position="relative"
        borderRadius={10}
        mx="auto"
        overflow="hidden"
        >
        {/* Background image with motion */}
        <MotionBox
            width="100%"
            height="100%"
            backgroundImage={`url(${heroImage})`}
            backgroundPosition="bottom"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            backgroundAttachment="fixed"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Dark overlay */}
        <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            bg="blackAlpha.700"
            zIndex={1}
        />

        {/* Overlayed heading */}
        <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            color="white"
            fontSize={["xl", "2xl", "4xl", "5xl"]}
            fontWeight="bold"
            textAlign="center"
            zIndex={2}
        >
            Transforming Lives Through Christ
        </Text>
        </Box>

  
        {/* About the Church */}
        <Box id="aboutus">
          <Text
            textAlign="center"
            fontSize={["2xl", "3xl"]}
            fontWeight="bold"
            mt={10}
          >
            About The Church
          </Text>
  
          <Flex
            direction={["column", "column", "row"]}
            align="center"
            justify="center"
            px={[4, 10, 20]}
            py={10}
            gap={10}
            flexWrap="wrap"
          >
            {/* Quote on left */}
            <Box
              bg="white"
              flex="1"
              p={[4, 6, 8]}
              color="black"
              borderRadius={10}
              _hover={{ bg: "gray.100" }}
              flexShrink={0}
            >
              <Blockquote.Root>
                <Blockquote.Content>
                Sto. Tomas de Villanueva parish church in Danao stands as one of the oldest churches found in the Philippines. It was originally constructed in 1755 and its construction was credited to Fr. Manuel de Santa Barbara. The church was made up of numerous materials including sugar cane and cut coral stones from the sea which was a common building material for churches constructed near the shoreline during that period. Historical accounts about Danao mentioned that the church was opened to worship in 1824 under Recollect administration.
                </Blockquote.Content>
                <Button bg={"black"} color={"white"}>
                  Learn more
                </Button>
              </Blockquote.Root>
            </Box>
  
            {/* Image on right */}
            <Box
              flex="1"
              maxHeight={["300px", "400px", "600px", "700px"]}
              overflow="hidden"
              borderRadius={10}
              flexShrink={0}
            >
              <Image
                src={heroImage}
                alt="Hero Image"
                width="100%"
                height="100%"
                objectFit="cover"
                objectPosition="bottom"
              />
            </Box>
          </Flex>
        </Box>

        {/* Services Section */}
        <Box px={[4, 8, 20]} py={10}>
            <Text
            textAlign="center"
            fontSize={["2xl", "3xl"]}
            fontWeight="bold"
            mb={10}
            >
            Church Services
            </Text>

            {/* ...inside Services Section: */}
            <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing={12}  // increased spacing from 8 to 12
            justifyItems="center"
            >
            {services.map((service, index) => (
                <MotionCard
                key={index}
                maxW="sm"
                overflow="hidden"
                boxShadow="xl"
                borderRadius="md"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                m={5}>
                <Image
                    src={service.image}
                    alt={service.title}
                    height="200px"
                    objectFit="cover"
                    width="100%"
                />
                <Card.Body gap={10} p={4}>
                    <Card.Title fontSize="xl" fontWeight="bold">
                    {service.title}
                    </Card.Title>
                    <Card.Description fontSize="sm">
                    {service.description}
                    </Card.Description>
                </Card.Body>
                <Card.Footer p={4}>
                    <Button colorScheme="blue" width="100%">
                    Book an Appointment
                    </Button>
                </Card.Footer>
                </MotionCard>
            ))}
            </SimpleGrid>
        </Box>
      </Stack>
    );
  }
  